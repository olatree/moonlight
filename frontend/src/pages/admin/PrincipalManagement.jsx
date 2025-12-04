// // src/pages/admin/AdminManagement.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:8000/api/principals";

// const AdminManagement = () => {
//   const [admins, setAdmins] = useState([]);
//   const [view, setView] = useState("list"); // list | add | edit
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     // role: "principal",
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setAdmins(res.data.principals || res.data);
//       console.log("Fetched principals:", res.data);
//     } catch (err) {
//       console.error("Error fetching principals:", err);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Add new admin
//   const handleAddAdmin = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(API_URL, formData);
//       alert("Principal added successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       console.error("Error adding principal:", err);
//       alert(err.response?.data?.message || "Failed to add principal");
//     }
//   };

//   // Load admin into form for editing
//   const handleEditClick = (admin) => {
//     setFormData({
//       name: admin.name,
//       email: admin.email,
//       password: "", // leave empty; only change if user sets new one
//     });
//     setEditingId(admin._id);
//     setView("edit");
//   };

//   // Save edited admin
//   const handleUpdateAdmin = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API_URL}/${editingId}`, formData);
//       alert("Admin updated successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       console.error("Error updating admin:", err);
//       alert(err.response?.data?.message || "Failed to update admin");
//     }
//   };

//   // Delete admin
//   const handleDeleteAdmin = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this admin?")) return;
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchAdmins();
//     } catch (err) {
//       console.error("Error deleting admin:", err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ name: "", email: "", password: "" });
//     setEditingId(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Principal Management</h1>

//       <div className="mb-4 flex gap-4">
//         <button
//           onClick={() => {
//             resetForm();
//             setView("list");
//           }}
//           className={`px-4 py-2 rounded ${
//             view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           View Principals
//         </button>
//         <button
//           onClick={() => {
//             resetForm();
//             setView("add");
//           }}
//           className={`px-4 py-2 rounded ${
//             view === "add" ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Add Principal
//         </button>
//       </div>

      
// {view === "list" && (
//   <>
//     {/* Desktop / Tablet: Table view */}
//     <div className="hidden sm:block w-full overflow-x-auto">
//       <div className="inline-block min-w-full">
//         <table className="min-w-[900px] border border-gray-300 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.length > 0 ? (
//               admins.map((admin) => (
//                 <tr key={admin._id} className="text-center">
//                   <td className="border p-2 whitespace-nowrap">{admin.userId}</td>
//                   <td className="border p-2">{admin.name}</td>
//                   <td className="border p-2">{admin.email}</td>
//                   <td className="border p-2 space-x-2">
//                     <button
//                       onClick={() => handleEditClick(admin)}
//                       className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteAdmin(admin._id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td className="border p-2 text-center" colSpan="5">
//                   No Principals found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>

//     {/* Mobile: Card view */}
//     <div className="sm:hidden space-y-4">
//       {admins.length > 0 ? (
//         admins.map((admin) => (
//           <div
//             key={admin._id}
//             className="border rounded-lg shadow-sm p-4 bg-white"
//           >
//             <p className="text-sm font-semibold">ID: {admin.userId}</p>
//             <p className="text-sm">Name: {admin.name}</p>
//             <p className="text-sm">Email: {admin.email}</p>
//             <div className="flex justify-end space-x-2 mt-3">
//               <button
//                 onClick={() => handleEditClick(admin)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDeleteAdmin(admin._id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center text-gray-500">No Principals found</p>
//       )}
//     </div>
//   </>
// )}


//       {/* Add Admin Form */}
//       {view === "add" && (
//         <form
//           onSubmit={handleAddAdmin}
//           className="bg-white p-6 rounded shadow-md max-w-md"
//         >
//           <h2 className="text-xl font-semibold mb-4">Add Principal</h2>
//           <div className="mb-4">
//             <label className="block font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           {/* <div className="mb-4">
//             <label className="block font-medium">Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="principal">Principal</option>
//             </select>
//           </div> */}
//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Add Principal
//           </button>
//         </form>
//       )}

//       {/* Edit Admin Form */}
//       {view === "edit" && (
//         <form
//           onSubmit={handleUpdateAdmin}
//           className="bg-white p-6 rounded shadow-md max-w-md"
//         >
//           <h2 className="text-xl font-semibold mb-4">Edit Principal</h2>
//           <div className="mb-4">
//             <label className="block font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-medium">Password (leave blank to keep current)</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//               placeholder="Enter new password"
//             />
//           </div>
//           {/* <div className="mb-4">
//             <label className="block font-medium">Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="admin">Admin</option>
//               <option value="super_admin">Super Admin</option>
//             </select>
//           </div> */}
//           <button
//             type="submit"
//             className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//           >
//             Update Principal
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AdminManagement;


// // src/pages/admin/AdminManagement.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import api from "../../api/axios";


// const AdminManagement = () => {
//   const [admins, setAdmins] = useState([]);
//   const [view, setView] = useState("list"); // list | add | edit
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     picture: null,
//     signature: null,
//     picturePreview: "",
//     signaturePreview: "",
//   });

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     try {
//       const res = await api.get("/principals");
//       setAdmins(res.data.principals || res.data);
//     } catch (err) {
//       console.error("Error fetching principals:", err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       setFormData({
//         ...formData,
//         [name]: file,
//         [name + "Preview"]: URL.createObjectURL(file),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleAddAdmin = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     if (formData.picture) data.append("picture", formData.picture);
//     if (formData.signature) data.append("signature", formData.signature);

//     try {
//       await api.post("/principals", data);
//       alert("Principal added successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add principal");
//     }
//   };

//   const handleUpdateAdmin = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     if (formData.password) data.append("password", formData.password);
//     if (formData.picture) data.append("picture", formData.picture);
//     if (formData.signature) data.append("signature", formData.signature);

//     try {
//       await api.put(`principals/${editingId}`, data);
//       alert("Principal updated successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update");
//     }
//   };

//   const handleEditClick = (admin) => {
//     setFormData({
//       name: admin.name || "",
//       email: admin.email || "",
//       password: "",
//       picture: null,
//       signature: null,
//       picturePreview: admin.picture || "",
//       signaturePreview: admin.signature || "",
//     });
//     setEditingId(admin._id);
//     setView("edit");
//   };

//   const handleDeleteAdmin = async (id) => {
//     if (!window.confirm("Delete this principal?")) return;
//     try {
//       await api.delete(`principals/${id}`);
//       fetchAdmins();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       picture: null,
//       signature: null,
//       picturePreview: "",
//       signaturePreview: "",
//     });
//     setEditingId(null);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Principal Management</h1>

//       <div className="mb-6 flex flex-wrap gap-4">
//         <button
//           onClick={() => { resetForm(); setView("list"); }}
//           className={`px-6 py-3 rounded-lg font-medium ${view === "list" ? "bg-blue-600 text-white" : "bg-white border"}`}
//         >
//           View Principals
//         </button>
//         <button
//           onClick={() => { resetForm(); setView("add"); }}
//           className={`px-6 py-3 rounded-lg font-medium ${view === "add" ? "bg-green-600 text-white" : "bg-white border"}`}
//         >
//           + Add Principal
//         </button>
//       </div>

//       {/* LIST VIEW */}
//       {view === "list" && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left">Photo</th>
//                   <th className="px-6 py-4 text-left">ID</th>
//                   <th className="px-6 py-4 text-left">Name</th>
//                   <th className="px-6 py-4 text-left">Email</th>
//                   <th className="px-6 py-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {admins.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-8 text-gray-500">
//                       No principals found
//                     </td>
//                   </tr>
//                 ) : (
//                   admins.map((admin) => (
//                     <tr key={admin._id} className="border-t hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         {admin.picture ? (
//                           <img src={admin.picture} alt={admin.name} className="w-12 h-12 rounded-full object-cover" />
//                         ) : (
//                           <div className="w-12 h-12 bg-gray-300 rounded-full" />
//                         )}
//                       </td>
//                       <td className="px-6 py-4 font-mono text-sm">{admin.userId}</td>
//                       <td className="px-6 py-4 font-medium">{admin.name}</td>
//                       <td className="px-6 py-4">{admin.email}</td>
//                       <td className="px-6 py-4 text-center space-x-3">
//                         <button onClick={() => handleEditClick(admin)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm">
//                           Edit
//                         </button>
//                         <button onClick={() => handleDeleteAdmin(admin._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ADD & EDIT FORM */}
//       {(view === "add" || view === "edit") && (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-8">{view === "add" ? "Add New Principal" : "Edit Principal"}</h2>
//           <form onSubmit={view === "add" ? handleAddAdmin : handleUpdateAdmin} className="space-y-6">
//             <div>
//               <label className="block font-medium mb-2">Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full border rounded-lg px-4 py-3"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-2">Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full border rounded-lg px-4 py-3"
//                 required
//                 disabled={view === "edit"}
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-2">
//                 {view === "add" ? "Password *" : "New Password (leave blank to keep current)"}
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 className="w-full border rounded-lg px-4 py-3"
//                 required={view === "add"}
//                 placeholder={view === "edit" ? "Enter new password only" : ""}
//               />
//             </div>

//             {/* Principal Photo */}
//             <div>
//               <label className="block font-medium mb-2">Principal Photo *</label>
//               <input
//                 type="file"
//                 name="picture"
//                 accept="image/*"
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//               {formData.picturePreview && (
//                 <img
//                   src={formData.picturePreview}
//                   alt="Preview"
//                   className="mt-4 w-32 h-32 object-cover rounded-lg border shadow"
//                 />
//               )}
//             </div>

//             {/* Signature */}
//             <div>
//               <label className="block font-medium mb-2">Signature *</label>
//               <input
//                 type="file"
//                 name="signature"
//                 accept="image/*"
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//               {formData.signaturePreview && (
//                 <img
//                   src={formData.signaturePreview}
//                   alt="Signature"
//                   className="mt-4 max-w-full h-32 object-contain border rounded bg-gray-50 p-4"
//                 />
//               )}
//             </div>

//             <div className="flex justify-end gap-4 pt-6">
//               <button
//                 type="button"
//                 onClick={() => { resetForm(); setView("list"); }}
//                 className="px-6 py-3 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={`px-8 py-3 text-white rounded-lg font-medium ${
//                   view === "add" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {view === "add" ? "Add Principal" : "Update Principal"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminManagement;

// // src/pages/admin/AdminManagement.jsx
// import React, { useState, useEffect } from "react";
// import api from "../../api/axios";

// const AdminManagement = () => {
//   const [admins, setAdmins] = useState([]);
//   const [view, setView] = useState("list"); // list | add | edit
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     picture: null,
//     signature: null,
//     picturePreview: "",
//     signaturePreview: "",
//   });

//   // Cleanup blob URLs on unmount or preview change
//   useEffect(() => {
//     return () => {
//       if (formData.picturePreview?.startsWith("blob:")) {
//         URL.revokeObjectURL(formData.picturePreview);
//       }
//       if (formData.signaturePreview?.startsWith("blob:")) {
//         URL.revokeObjectURL(formData.signaturePreview);
//       }
//     };
//   }, [formData.picturePreview, formData.signaturePreview]);

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     setFetchLoading(true);
//     try {
//       const res = await api.get("/principals");
//       setAdmins(res.data.principals || res.data || []);
//       console.log("Fetched principals:", res.data);
//     } catch (err) {
//       alert("Failed to load principals: " + (err.response?.data?.message || err.message));
//       console.error("Error fetching principals:", err);
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const revokePreviousPreview = (currentPreview) => {
//     if (currentPreview?.startsWith("blob:")) {
//       URL.revokeObjectURL(currentPreview);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files && files[0]) {
//       const file = files[0];
//       const previewKey = name + "Preview";

//       // Revoke old blob URL
//       revokePreviousPreview(formData[previewKey]);

//       setFormData((prev) => ({
//         ...prev,
//         [name]: file,
//         [previewKey]: URL.createObjectURL(file),
//       }));
//     } else if (files && !files[0]) {
//       // File cleared
//       revokePreviousPreview(formData[name + "Preview"]);
//       setFormData((prev) => ({
//         ...prev,
//         [name]: null,
//         [name + "Preview"]: "",
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateForm = () => {
//     if (!formData.name.trim() || !formData.email.trim()) {
//       alert("Name and email are required.");
//       return false;
//     }

//     if (view === "add") {
//       if (!formData.password) {
//         alert("Password is required for new principal.");
//         return false;
//       }
//       if (!formData.picture || !formData.signature) {
//         alert("Please upload both photo and signature.");
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleAddAdmin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     if (formData.picture) data.append("picture", formData.picture);
//     if (formData.signature) data.append("signature", formData.signature);

//     try {
//       await api.post("/principals", data);
//       alert("Principal added successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add principal");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateAdmin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     if (formData.password) data.append("password", formData.password);
//     if (formData.picture) data.append("picture", formData.picture);
//     if (formData.signature) data.append("signature", formData.signature);

//     try {
//       await api.put(`/principals/${editingId}`, data);
//       alert("Principal updated successfully!");
//       resetForm();
//       fetchAdmins();
//       setView("list");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update principal");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = (admin) => {
//     // Revoke any existing previews first
//     revokePreviousPreview(formData.picturePreview);
//     revokePreviousPreview(formData.signaturePreview);

//     setFormData({
//       name: admin.name || "",
//       email: admin.email || "",
//       password: "",
//       picture: null,
//       signature: null,
//       picturePreview: admin.picture || "",
//       signaturePreview: admin.signature || "",
//     });
//     setEditingId(admin._id);
//     setView("edit");
//   };

//   const handleDeleteAdmin = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this principal?")) return;

//     try {
//       await api.delete(`/principals/${id}`);
//       alert("Principal deleted successfully");
//       fetchAdmins();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to delete principal");
//     }
//   };

//   const resetForm = () => {
//     revokePreviousPreview(formData.picturePreview);
//     revokePreviousPreview(formData.signaturePreview);

//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       picture: null,
//       signature: null,
//       picturePreview: "",
//       signaturePreview: "",
//     });
//     setEditingId(null);
//   };

//   const cancelForm = () => {
//     resetForm();
//     setView("list");
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Principal Management</h1>

//       {/* Navigation Buttons */}
//       <div className="mb-8 flex flex-wrap gap-4">
//         <button
//           onClick={() => { resetForm(); setView("list"); }}
//           className={`px-6 py-3 rounded-lg font-medium transition-colors ${
//             view === "list"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           View Principals
//         </button>
//         <button
//           onClick={() => { resetForm(); setView("add"); }}
//           className={`px-6 py-3 rounded-lg font-medium transition-colors ${
//             view === "add"
//               ? "bg-green-600 text-white shadow-md"
//               : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           + Add New Principal
//         </button>
//       </div>

//       {/* LIST VIEW */}
//       {view === "list" && (
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Photo</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {fetchLoading ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-12 text-gray-500">
//                       Loading principals...
//                     </td>
//                   </tr>
//                 ) : admins.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-12 text-gray-500">
//                       No principals found
//                     </td>
//                   </tr>
//                 ) : (
//                   admins.map((admin) => (
//                     <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         {admin.picture ? (
//                           <img
//                             src={admin.picture}
//                             alt={admin.name}
//                             className="w-12 h-12 rounded-full object-cover border"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 bg-gray-300 rounded-full border" />
//                         )}
//                       </td>
//                       <td className="px-6 py-4 font-mono text-sm text-gray-600">
//                         {admin.userId || admin._id}
//                       </td>
//                       <td className="px-6 py-4 font-medium">{admin.name}</td>
//                       <td className="px-6 py-4 text-gray-700">{admin.email}</td>
//                       <td className="px-6 py-4 text-center space-x-3">
//                         <button
//                           onClick={() => handleEditClick(admin)}
//                           className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//                           aria-label={`Edit ${admin.name}`}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteAdmin(admin._id)}
//                           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//                           aria-label={`Delete ${admin.name}`}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ADD & EDIT FORM */}
//       {(view === "add" || view === "edit") && (
//         <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl">
//           <h2 className="text-2xl font-bold text-gray-800 mb-8">
//             {view === "add" ? "Add New Principal" : "Edit Principal"}
//           </h2>

//           <form onSubmit={view === "add" ? handleAddAdmin : handleUpdateAdmin} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={view === "edit"}
//                 title={view === "edit" ? "Email cannot be changed" : ""}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block font-medium text-gray-700 mb-2">
//                 {view === "add" ? "Password" : "New Password"} {view === "add" && <span className="text-red-500">*</span>}
//                 {view === "edit" && <span className="text-gray-500 text-sm"> (leave blank to keep current)</span>}
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required={view === "add"}
//                 placeholder={view === "edit" ? "Enter new password only" : ""}
//               />
//             </div>

//             {/* Photo */}
//             <div>
//               <label className="block font-medium text-gray-700 mb-2">
//                 Principal Photo {view === "add" && <span className="text-red-500">*</span>}
//               </label>
//               <input
//                 type="file"
//                 name="picture"
//                 accept="image/*"
//                 onChange={handleInputChange}
//                 className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//               {formData.picturePreview && (
//                 <div className="mt-4">
//                   <img
//                     src={formData.picturePreview}
//                     alt="Photo preview"
//                     className="w-32 h-32 object-cover rounded-lg border shadow-md"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Signature */}
//             <div>
//               <label className="block font-medium text-gray-700 mb-2">
//                 Signature {view === "add" && <span className="text-red-500">*</span>}
//               </label>
//               <input
//                 type="file"
//                 name="signature"
//                 accept="image/*"
//                 onChange={handleInputChange}
//                 className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//               {formData.signaturePreview && (
//                 <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
//                   <img
//                     src={formData.signaturePreview}
//                     alt="Signature preview"
//                     className="max-w-full h-32 object-contain"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-4 pt-8 border-t">
//               <button
//                 type="button"
//                 onClick={cancelForm}
//                 disabled={loading}
//                 className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-8 py-3 text-white rounded-lg font-medium transition ${
//                   view === "add"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } disabled:opacity-70`}
//               >
//                 {loading ? "Saving..." : view === "add" ? "Add Principal" : "Update Principal"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminManagement;

// src/pages/admin/AdminManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [view, setView] = useState("list"); // list | add | edit
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    picture: null,
    signature: null,
    picturePreview: "",
    signaturePreview: "",
  });

  // Track all created blob URLs to prevent memory leaks
  const blobUrlsRef = useRef(new Set());

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current.clear();
    };
  }, []);

  // Fetch all principals on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/principals");
      setAdmins(res.data.principals || res.data || []);
    } catch (err) {
      alert("Failed to load principals: " + (err.response?.data?.message || err.message));
      console.error("Error fetching principals:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  // Safe blob URL creation and tracking
  const createBlobUrl = (file) => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.add(url);
    return url;
  };

  const revokeBlobUrl = (url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const previewKey = name + "Preview";

    if (files && files[0]) {
      const file = files[0];

      // Revoke previous blob if any
      revokeBlobUrl(formData[previewKey]);

      const newPreview = createBlobUrl(file);

      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [previewKey]: newPreview,
      }));
    } else if (files && files.length === 0) {
      // File cleared
      revokeBlobUrl(formData[previewKey]);
      setFormData((prev) => ({
        ...prev,
        [name]: null,
        [previewKey]: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Name is required.");
      return false;
    }
    if (view === "add") {
      if (!formData.email.trim()) {
        alert("Email is required.");
        return false;
      }
      if (!formData.password) {
        alert("Password is required for new principal.");
        return false;
      }
      if (!formData.picture || !formData.signature) {
        alert("Please upload both photo and signature.");
        return false;
      }
    }
    return true;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.picture) data.append("picture", formData.picture);
    if (formData.signature) data.append("signature", formData.signature);

    try {
      await api.post("/principals", data);
      alert("Principal added successfully!");
      resetForm();
      fetchAdmins();
      setView("list");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add principal");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);

    // Only send password if provided
    if (formData.password) data.append("password", formData.password);
    if (formData.picture) data.append("picture", formData.picture);
    if (formData.signature) data.append("signature", formData.signature);
    // Email intentionally NOT sent on update

    try {
      await api.put(`/principals/${editingId}`, data);
      alert("Principal updated successfully!");
      resetForm();
      fetchAdmins();
      setView("list");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update principal");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (admin) => {
    // Clean up any existing blob previews
    revokeBlobUrl(formData.picturePreview);
    revokeBlobUrl(formData.signaturePreview);

    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      picture: null,
      signature: null,
      picturePreview: admin.picture ? `${admin.picture}?t=${Date.now()}` : "",
      signaturePreview: admin.signature ? `${admin.signature}?t=${Date.now()}` : "",
    });
    setEditingId(admin._id);
    setView("edit");
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this principal?")) return;

    try {
      await api.delete(`/principals/${id}`);
      alert("Principal deleted successfully");
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete principal");
    }
  };

  const resetForm = () => {
    revokeBlobUrl(formData.picturePreview);
    revokeBlobUrl(formData.signaturePreview);

    setFormData({
      name: "",
      email: "",
      password: "",
      picture: null,
      signature: null,
      picturePreview: "",
      signaturePreview: "",
    });
    setEditingId(null);
  };

  const cancelForm = () => {
    resetForm();
    setView("list");
  };

  // Unique key to force file input reset
  const fileInputKey = `${view}-${editingId || "new"}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Principal Management</h1>

      {/* Navigation Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => { resetForm(); setView("list"); }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            view === "list"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          View Principals
        </button>
        <button
          onClick={() => { resetForm(); setView("add"); }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            view === "add"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          + Add New Principal
        </button>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Photo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fetchLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Loading principals...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      No principals found
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {admin.picture ? (
                          <img
                            src={admin.picture}
                            alt={admin.name}
                            className="w-12 h-12 rounded-full object-cover border"
                            onError={(e) => {
                              e.target.src = "/placeholder-avatar.jpg"; // optional fallback
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-full border" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {admin.userId || admin._id}
                      </td>
                      <td className="px-6 py-4 font-medium">{admin.name}</td>
                      <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                      <td className="px-6 py-4 text-center space-x-3">
                        <button
                          onClick={() => handleEditClick(admin)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD & EDIT FORM */}
      {(view === "add" || view === "edit") && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {view === "add" ? "Add New Principal" : "Edit Principal"}
          </h2>

          <form onSubmit={view === "add" ? handleAddAdmin : handleUpdateAdmin} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Email {view === "add" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={view === "edit"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required={view === "add"}
                title={view === "edit" ? "Email cannot be changed" : ""}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {view === "add" ? "Password" : "New Password"}{" "}
                {view === "add" && <span className="text-red-500">*</span>}
                {view === "edit" && <span className="text-gray-500 text-sm">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={view === "edit" ? "Leave blank to keep current password" : ""}
                required={view === "add"}
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Principal Photo {view === "add" && <span className="text-red-500">*</span>}
              </label>
              <input
                key={`picture-${fileInputKey}`}
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.picturePreview && (
                <div className="mt-4">
                  <img
                    src={formData.picturePreview}
                    alt="Photo preview"
                    className="w-32 h-32 object-cover rounded-lg border shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Signature */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Signature {view === "add" && <span className="text-red-500">*</span>}
              </label>
              <input
                key={`signature-${fileInputKey}`}
                type="file"
                name="signature"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.signaturePreview && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                  <img
                    src={formData.signaturePreview}
                    alt="Signature preview"
                    className="max-w-full h-32 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t">
              <button
                type="button"
                onClick={cancelForm}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white rounded-lg font-medium transition disabled:opacity-70 ${
                  view === "add"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : view === "add" ? (
                  "Add Principal"
                ) : (
                  "Update Principal"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;