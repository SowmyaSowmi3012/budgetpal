import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [memberInputs, setMemberInputs] = useState({});
  const [groupSummaries, setGroupSummaries] = useState({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/groups`, config);
      setGroups(res.data);
      fetchGroupSummaries(res.data);
    } catch (err) {
      toast.error("Failed to fetch groups");
    }
  };

  const fetchGroupSummaries = async (groupList) => {
    try {
      const summaries = {};
      for (let group of groupList) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/groups/${group._id}/summary`, config);
        summaries[group._id] = res.data;
      }
      setGroupSummaries(summaries);
    } catch (err) {
      console.error("❌ Error fetching group summaries", err);
    }
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return toast.error("Group name is required");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/groups`, { name: groupName }, config);
      setGroups((prev) => [...prev, res.data]);
      setGroupName("");
      toast.success("Group created!");
    } catch (err) {
      toast.error("Failed to create group");
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/groups/${id}`, config);
      setGroups((prev) => prev.filter((g) => g._id !== id));
      toast.success("Group deleted");
    } catch (err) {
      toast.error("Failed to delete group");
    }
  };

  const handleEditGroup = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleUpdateGroup = async (id) => {
    if (!editedName.trim()) return toast.error("Group name required");
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/groups/${id}`, { name: editedName }, config);
      setGroups((prev) =>
        prev.map((group) => (group._id === id ? { ...group, name: res.data.name } : group))
      );
      setEditingId(null);
      setEditedName("");
      toast.success("Group updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleAddMember = async (groupId, email) => {
    if (!email) return toast.error("Enter an email");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/groups/${groupId}/add-member`, { email }, config);
      toast.success("Member added!");
      setMemberInputs((prev) => ({ ...prev, [groupId]: "" }));
      fetchGroups(); // Refresh members list
    } catch {
      toast.error("Failed to add member");
    }
  };

  const handleGoToGroup = (id) => {
    navigate(`/groups/${id}`);
  };

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchGroups();
  }
}, []);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">👥 Groups</h2>

      {/* Group creation form */}
      <form
        onSubmit={handleAddGroup}
        className="space-y-4 max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow"
      >
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
        >
          ➕ Add Group
        </button>
      </form>

      {/* Group list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Groups</h3>
        {groups.length > 0 ? (
          <ul className="space-y-5">
            {groups.map((group) => (
              <li
                key={group._id}
                className="bg-secondary dark:bg-gray-700 px-4 py-4 rounded shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {editingId === group._id ? (
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="font-medium text-lg">{group.name}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {editingId === group._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateGroup(group._id)}
                          className="text-green-600 hover:scale-110"
                          title="Save"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:scale-110"
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditGroup(group._id, group.name)}
                          className="text-blue-600 hover:scale-110"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group._id)}
                          className="text-red-600 hover:scale-110"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Add member input */}
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="email"
                    placeholder="Add member by email"
                    value={memberInputs[group._id] || ""}
                    onChange={(e) =>
                      setMemberInputs({ ...memberInputs, [group._id]: e.target.value })
                    }
                    className="px-2 py-1 rounded border dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() =>
                      handleAddMember(group._id, memberInputs[group._id])
                    }
                    className="bg-primary text-white px-3 py-1 rounded"
                  >
                    ➕ Add
                  </button>
                </div>

                {/* Members list */}

                {/* Group Summary */}
                <div className="mt-3">
                  <p className="font-semibold">
                    💰 Total Group Expenses: ₹
                    {groupSummaries[group._id]?.total || 0}
                  </p>
                  <button
                    onClick={() => handleGoToGroup(group._id)}
                    className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                  >
                    🔗 Open Group Dashboard
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No groups created yet.</p>
        )}
      </div>
    </>
  );
};

export default Groups;
