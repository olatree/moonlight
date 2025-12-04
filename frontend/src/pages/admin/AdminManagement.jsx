// src/pages/admin/AdminManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api/axios";

// const API_URL = "http://localhost:8000/api/admins";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [view, setView] = useState("list"); // list | add | edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/admins");
      setAdmins(res.data.admins || res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admins", formData);
      alert("Admin added successfully!");
      resetForm();
      fetchAdmins();
      setView("list");
    } catch (err) {
      console.error("Error adding admin:", err);
      alert(err.response?.data?.message || "Failed to add admin");
    }
  };

  // Load admin into form for editing
  const handleEditClick = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // leave empty; only change if user sets new one
      role: admin.role,
    });
    setEditingId(admin._id);
    setView("edit");
  };

  // Save edited admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admins/${editingId}`, formData);
      alert("Admin updated successfully!");
      resetForm();
      fetchAdmins();
      setView("list");
    } catch (err) {
      console.error("Error updating admin:", err);
      alert(err.response?.data?.message || "Failed to update admin");
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await api.delete(`/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "admin" });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Management</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => {
            resetForm();
            setView("list");
          }}
          className={`px-4 py-2 rounded ${
            view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          View All Admins
        </button>
        <button
          onClick={() => {
            resetForm();
            setView("add");
          }}
          className={`px-4 py-2 rounded ${
            view === "add" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Add Admin
        </button>
      </div>

      {/* Admin List */}
      {/* {view === "list" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id} className="text-center">
                    <td className="border p-2">{admin.userId}</td>
                    <td className="border p-2">{admin.name}</td>
                    <td className="border p-2">{admin.email}</td>
                    <td className="border p-2">{admin.role}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border p-2 text-center" colSpan="4">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )} */}

      {/* Admin List */}
{view === "list" && (
  <>
    {/* Desktop / Tablet: Table view */}
    <div className="hidden sm:block w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="min-w-[900px] border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin._id} className="text-center">
                  <td className="border p-2 whitespace-nowrap">{admin.userId}</td>
                  <td className="border p-2">{admin.name}</td>
                  <td className="border p-2">{admin.email}</td>
                  <td className="border p-2 capitalize">{admin.role}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(admin)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center" colSpan="5">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile: Card view */}
    <div className="sm:hidden space-y-4">
      {admins.length > 0 ? (
        admins.map((admin) => (
          <div
            key={admin._id}
            className="border rounded-lg shadow-sm p-4 bg-white"
          >
            <p className="text-sm font-semibold">ID: {admin.userId}</p>
            <p className="text-sm">Name: {admin.name}</p>
            <p className="text-sm">Email: {admin.email}</p>
            <p className="text-sm capitalize">Role: {admin.role}</p>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => handleEditClick(admin)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAdmin(admin._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No admins found</p>
      )}
    </div>
  </>
)}


      {/* Add Admin Form */}
      {view === "add" && (
        <form
          onSubmit={handleAddAdmin}
          className="bg-white p-6 rounded shadow-md max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Add Admin</h2>
          <div className="mb-4">
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Admin
          </button>
        </form>
      )}

      {/* Edit Admin Form */}
      {view === "edit" && (
        <form
          onSubmit={handleUpdateAdmin}
          className="bg-white p-6 rounded shadow-md max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>
          <div className="mb-4">
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Update Admin
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminManagement;
