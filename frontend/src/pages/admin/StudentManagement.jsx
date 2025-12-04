// // src/pages/admin/ManageStudents.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageStudents = () => {
//   const [classes, setClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [filters, setFilters] = useState({ classId: "", armId: "" });
//   const [loading, setLoading] = useState(false);

//   const [editingStudent, setEditingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     dateOfBirth: "",
//     gender: "Male",
//     parentContact: "",
//     classId: "",
//     armId: "",
//     sessionId: "",
//     termId: "",
//     image: null,
//   });
//   const [imagePreview, setImagePreview] = useState(null);

//   // ------------------ Fetch Classes ------------------
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8000/api/classes", {
//           withCredentials: true,
//         });
//         setClasses(data || []);
//       } catch (err) {
//         console.error("Failed to fetch classes:", err);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // ------------------ Fetch Students ------------------
//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const query = new URLSearchParams();
//       if (filters.classId) query.append("classId", filters.classId);
//       if (filters.armId) query.append("armId", filters.armId);

//       const res = await axios.get(`http://localhost:8000/api/students?${query.toString()}`, {
//         withCredentials: true,
//       });
//       setStudents(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [filters]);

//   // ------------------ Handle Filters ------------------
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "classId" ? { armId: "" } : {}), // reset arm if class changes
//     }));
//   };

//   // ------------------ Edit Student ------------------
//   const openEdit = (student, enrollment) => {
//     setEditingStudent({ student, enrollment });
//     setFormData({
//       name: student.name,
//       dateOfBirth: student.dateOfBirth?.slice(0, 10) || "",
//       gender: student.gender,
//       parentContact: student.parentContact || "",
//       classId: enrollment.classId._id,
//       armId: enrollment.armId._id,
//       sessionId: enrollment.sessionId._id,
//       termId: enrollment.termId._id,
//       image: null,
//     });
//     setImagePreview(student.image);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       setImagePreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingStudent) return;

//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== "") data.append(key, formData[key]);
//       });

//       await axios.put(
//         `http://localhost:8000/api/students/${editingStudent.student._id}`,
//         data,
//         { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//       );

//       alert("Student updated successfully!");
//       setEditingStudent(null);
//       setImagePreview(null);
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update student");
//     }
//   };

//   // ------------------ Delete Student ------------------
//   const handleDelete = async (studentId) => {
//     if (!window.confirm("Are you sure you want to delete this student?")) return;

//     try {
//       await axios.delete(`http://localhost:8000/api/students/${studentId}`, {
//         withCredentials: true,
//       });
//       alert("Student deleted successfully!");
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete student");
//     }
//   };

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-4">
//         <select
//           name="classId"
//           value={filters.classId}
//           onChange={handleFilterChange}
//           className="p-2 border rounded"
//         >
//           <option value="">Select Class</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>
//               {cls.name}
//             </option>
//           ))}
//         </select>

//         <select
//           name="armId"
//           value={filters.armId}
//           onChange={handleFilterChange}
//           disabled={!filters.classId}
//           className="p-2 border rounded"
//         >
//           <option value="">Select Arm</option>
//           {filters.classId &&
//             classes
//               .find((cls) => cls._id === filters.classId)
//               ?.arms.map((arm) => (
//                 <option key={arm._id} value={arm._id}>
//                   {arm.name}
//                 </option>
//               ))}
//         </select>
//       </div>

//       {/* Students Table */}
//       <div className="overflow-x-auto border rounded shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">#</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Admission No</th>
//               <th className="px-4 py-2">DOB</th>
//               <th className="px-4 py-2">Gender</th>
//               <th className="px-4 py-2">Blocked</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : students.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No students found
//                 </td>
//               </tr>
//             ) : (
//               students.map((enrollment, index) => {
//                 const student = enrollment.studentId;
//                 return (
//                   <tr key={student._id}>
//                     <td className="px-4 py-2">{index + 1}</td>
//                     <td className="px-4 py-2">{student.name}</td>
//                     <td className="px-4 py-2">{student.admissionNumber}</td>
//                     <td className="px-4 py-2">
//                       {new Date(student.dateOfBirth).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2">{student.gender}</td>
//                     <td className="px-4 py-2">{student.blocked ? "Yes" : "No"}</td>
//                     <td className="px-4 py-2 flex gap-2">
//                       <button
//                         onClick={() => openEdit(student, enrollment)}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(student._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {editingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
//             <form onSubmit={handleUpdate} className="space-y-3">
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               <input
//                 type="text"
//                 name="parentContact"
//                 value={formData.parentContact}
//                 onChange={handleChange}
//                 placeholder="Parent Contact"
//                 className="w-full p-2 border rounded"
//               />

//               {/* Class & Arm */}
//               <select
//                 name="classId"
//                 value={formData.classId}
//                 onChange={(e) => {
//                   const classId = e.target.value;
//                   setFormData({ ...formData, classId, armId: "" });
//                 }}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select Class</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="armId"
//                 value={formData.armId}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 disabled={!formData.classId}
//               >
//                 <option value="">Select Arm</option>
//                 {formData.classId &&
//                   classes
//                     .find((cls) => cls._id === formData.classId)
//                     ?.arms.map((arm) => (
//                       <option key={arm._id} value={arm._id}>
//                         {arm.name}
//                       </option>
//                     ))}
//               </select>

//               {/* Image Preview & Upload */}
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-32 h-32 object-cover rounded border mt-2"
//                 />
//               )}
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleChange}
//                 accept="image/*"
//                 className="w-full p-2 border rounded"
//               />

//               <div className="flex justify-end gap-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditingStudent(null);
//                     setImagePreview(null);
//                   }}
//                   className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageStudents;


// // src/pages/admin/ManageStudents.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageStudents = () => {
//   const [classes, setClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [filters, setFilters] = useState({ classId: "", armId: "" });
//   const [loading, setLoading] = useState(false);

//   const [editingStudent, setEditingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     dateOfBirth: "",
//     gender: "Male",
//     parentContact: "",
//     classId: "",
//     armId: "",
//     sessionId: "",
//     termId: "",
//     image: null,
//   });
//   const [imagePreview, setImagePreview] = useState(null);

//   // ------------------ Fetch Classes ------------------
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8000/api/classes", {
//           withCredentials: true,
//         });
//         setClasses(data || []);
//       } catch (err) {
//         console.error("Failed to fetch classes:", err);
//       }
//     };
//     fetchClasses();
//   }, []);

//   // ------------------ Fetch Students ------------------
//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const query = new URLSearchParams();
//       if (filters.classId) query.append("classId", filters.classId);
//       if (filters.armId) query.append("armId", filters.armId);

//       const res = await axios.get(`http://localhost:8000/api/students?${query.toString()}`, {
//         withCredentials: true,
//       });
//       setStudents(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [filters]);

//   // ------------------ Handle Filters ------------------
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "classId" ? { armId: "" } : {}), // reset arm if class changes
//     }));
//   };

//   // ------------------ Edit Student ------------------
//   const openEdit = (student, enrollment) => {
//     setEditingStudent({ student, enrollment });
//     setFormData({
//       name: student.name,
//       dateOfBirth: student.dateOfBirth?.slice(0, 10) || "",
//       gender: student.gender,
//       parentContact: student.parentContact || "",
//       classId: enrollment.classId._id,
//       armId: enrollment.armId._id,
//       sessionId: enrollment.sessionId._id,
//       termId: enrollment.termId._id,
//       image: null,
//     });
//     setImagePreview(student.image);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       setImagePreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingStudent) return;

//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== "") data.append(key, formData[key]);
//       });

//       await axios.put(
//         `http://localhost:8000/api/students/${editingStudent.student._id}`,
//         data,
//         { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//       );

//       alert("Student updated successfully!");
//       setEditingStudent(null);
//       setImagePreview(null);
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update student");
//     }
//   };

//   // ------------------ Delete Student ------------------
//   const handleDelete = async (studentId) => {
//     if (!window.confirm("Are you sure you want to delete this student?")) return;

//     try {
//       await axios.delete(`http://localhost:8000/api/students/${studentId}`, {
//         withCredentials: true,
//       });
//       alert("Student deleted successfully!");
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete student");
//     }
//   };

//   return (
//     <div className="p-2 sm:p-4 max-w-full sm:max-w-6xl mx-auto">
//       <h1 className="text-xl sm:text-2xl font-bold mb-4">Manage Students</h1>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4">
//         <select
//           name="classId"
//           value={filters.classId}
//           onChange={handleFilterChange}
//           className="p-2 border rounded w-full sm:w-auto"
//         >
//           <option value="">Select Class</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>
//               {cls.name}
//             </option>
//           ))}
//         </select>

//         <select
//           name="armId"
//           value={filters.armId}
//           onChange={handleFilterChange}
//           disabled={!filters.classId}
//           className="p-2 border rounded w-full sm:w-auto"
//         >
//           <option value="">Select Arm</option>
//           {filters.classId &&
//             classes
//               .find((cls) => cls._id === filters.classId)
//               ?.arms.map((arm) => (
//                 <option key={arm._id} value={arm._id}>
//                   {arm.name}
//                 </option>
//               ))}
//         </select>
//       </div>

//       {/* Students Table */}
//       <div className="overflow-x-auto border rounded shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-2 sm:px-4 py-2">#</th>
//               <th className="px-2 sm:px-4 py-2">Name</th>
//               <th className="px-2 sm:px-4 py-2">Admission No</th>
//               <th className="px-2 sm:px-4 py-2">DOB</th>
//               <th className="px-2 sm:px-4 py-2">Gender</th>
//               <th className="px-2 sm:px-4 py-2">Blocked</th>
//               <th className="px-2 sm:px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : students.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No students found
//                 </td>
//               </tr>
//             ) : (
//               students.map((enrollment, index) => {
//                 const student = enrollment.studentId;
//                 return (
//                   <tr key={student._id}>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">{index + 1}</td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">{student.name}</td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">{student.admissionNumber}</td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">
//                       {new Date(student.dateOfBirth).toLocaleDateString()}
//                     </td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">{student.gender}</td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2">{student.blocked ? "Yes" : "No"}</td>
//                     <td className="px-2 sm:px-4 py-1 sm:py-2 flex flex-wrap gap-1 sm:gap-2">
//                       <button
//                         onClick={() => openEdit(student, enrollment)}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(student._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {editingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
//           <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Student</h2>
//             <form onSubmit={handleUpdate} className="space-y-2 sm:space-y-3">
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//                 required
//               />
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//               />
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//               >
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               <input
//                 type="text"
//                 name="parentContact"
//                 value={formData.parentContact}
//                 onChange={handleChange}
//                 placeholder="Parent Contact"
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//               />

//               {/* Class & Arm */}
//               <select
//                 name="classId"
//                 value={formData.classId}
//                 onChange={(e) => {
//                   const classId = e.target.value;
//                   setFormData({ ...formData, classId, armId: "" });
//                 }}
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//               >
//                 <option value="">Select Class</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="armId"
//                 value={formData.armId}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//                 disabled={!formData.classId}
//               >
//                 <option value="">Select Arm</option>
//                 {formData.classId &&
//                   classes
//                     .find((cls) => cls._id === formData.classId)
//                     ?.arms.map((arm) => (
//                       <option key={arm._id} value={arm._id}>
//                         {arm.name}
//                       </option>
//                     ))}
//               </select>

//               {/* Image Preview & Upload */}
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border mt-2"
//                 />
//               )}
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleChange}
//                 accept="image/*"
//                 className="w-full p-2 border rounded text-sm sm:text-base"
//               />

//               <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditingStudent(null);
//                     setImagePreview(null);
//                   }}
//                   className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm sm:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageStudents;

// src/pages/admin/ManageStudents.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageStudents = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ classId: "", armId: "" });
  const [loading, setLoading] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "Male",
    parentContact: "",
    classId: "",
    armId: "",
    sessionId: "",
    termId: "",
    picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // ------------------ Fetch Classes ------------------
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/classes", {
          withCredentials: true,
        });
        setClasses(data || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // ------------------ Fetch Students ------------------
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.classId) query.append("classId", filters.classId);
      if (filters.armId) query.append("armId", filters.armId);

      const res = await api.get(`/students?${query.toString()}`, {
        withCredentials: true,
      });
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  // ------------------ Handle Filters ------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { armId: "" } : {}),
    }));
  };

  // ------------------ FIXED Edit Student ------------------
  const openEdit = (student, enrollment) => {
    // console.log("Student data:", student);
    
    // FIXED: Normalize ALL values to avoid undefined/empty string issues
    const normalizeValue = (val) => {
      if (val === null || val === undefined) return "";
      return String(val).trim();
    };

    const studentData = {
      name: normalizeValue(student.name),
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().slice(0, 10) : "",
      gender: normalizeValue(student.gender),
      parentContact: normalizeValue(student.parentContact),
      image: null,
    };

    const enrollmentData = {
      classId: normalizeValue(enrollment.classId?._id),
      armId: normalizeValue(enrollment.armId?._id),
      sessionId: normalizeValue(enrollment.sessionId?._id),
      termId: normalizeValue(enrollment.termId?._id),
    };

    const fullFormData = { ...studentData, ...enrollmentData };

    // console.log("Full form data:", fullFormData);

    // Store ORIGINAL data for comparison
    setOriginalFormData({ ...fullFormData });

    // Set current form data
    setFormData(fullFormData);
    setEditingStudent({ student, enrollment });
    setImagePreview(student.image || null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "picture" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ------------------ FIXED Get only CHANGED fields ------------------
  const getChangedFields = () => {
    if (!originalFormData) return {};

    const changes = {};
    
    Object.keys(originalFormData).forEach(key => {
      const originalVal = originalFormData[key];
      const currentVal = formData[key];
      
      // FIXED: Proper comparison for all field types
      let isChanged = false;
      
      if (key === "dateOfBirth") {
        // Date comparison
        isChanged = originalVal !== currentVal;
      } else if (key === "picture") {
        // Image always handled separately
        isChanged = false;
      } else {
        // String comparison - normalize both values
        const normalizedOriginal = String(originalVal || "").trim();
        const normalizedCurrent = String(currentVal || "").trim();
        isChanged = normalizedOriginal !== normalizedCurrent;
      }
      
      if (isChanged) {
        changes[key] = currentVal;
      }
    });

    // Always include image if new file selected
    if (formData.picture instanceof File) {
      changes.picture = formData.picture;
    }

    // console.log("Detected changes:", changes); // DEBUG
    return changes;
  };

  // ------------------ FIXED Handle Update ------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    const changedFields = getChangedFields();
    
    // console.log("Fields to update:", changedFields); // DEBUG
    
    if (Object.keys(changedFields).length === 0) {
      alert("No changes detected!");
      return;
    }

    try {
      const data = new FormData();
      
      // Only append CHANGED fields - FIXED!
      Object.keys(changedFields).forEach((key) => {
        const value = changedFields[key];
        if (value !== "" && value !== null && value !== undefined) {
          if (key === "picture" && value instanceof File) {
            data.append(key, value);
          } else {
            data.append(key, String(value));
          }
        }
      });

      console.log("FormData contents:"); // DEBUG
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await api.put(
        `/students/${editingStudent.student._id}`,
        data,
        { 
          headers: { "Content-Type": "multipart/form-data" }, 
          withCredentials: true 
        }
      );

      console.log("Update response:", response.data); // DEBUG

      alert(`Student updated successfully! ${Object.keys(changedFields).length} field(s) updated.`);
      closeModal();
      fetchStudents();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(`Failed to update student: ${err.response?.data?.message || err.message}`);
    }
  };

  // ------------------ Close Modal ------------------
  const closeModal = () => {
    setEditingStudent(null);
    setOriginalFormData(null);
    setImagePreview(null);
  };

  // ------------------ Delete Student ------------------
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/students/${studentId}`, {
        withCredentials: true,
      });
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  // Get changed fields for UI
  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <div className="p-2 sm:p-4 max-w-full sm:max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Manage Students</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4">
        <select
          name="classId"
          value={filters.classId}
          onChange={handleFilterChange}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          name="armId"
          value={filters.armId}
          onChange={handleFilterChange}
          disabled={!filters.classId}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">Select Arm</option>
          {filters.classId &&
            classes
              .find((cls) => cls._id === filters.classId)
              ?.arms.map((arm) => (
                <option key={arm._id} value={arm._id}>
                  {arm.name}
                </option>
              ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 sm:px-4 py-2">#</th>
              <th className="px-2 sm:px-4 py-2">Name</th>
              <th className="px-2 sm:px-4 py-2">Admission No</th>
              <th className="px-2 sm:px-4 py-2">DOB</th>
              <th className="px-2 sm:px-4 py-2">Gender</th>
              <th className="px-2 sm:px-4 py-2">Parent Contact</th>
              <th className="px-2 sm:px-4 py-2">Blocked</th>
              <th className="px-2 sm:px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((enrollment, index) => {
                const student = enrollment.studentId;
                return (
                  <tr key={student._id}>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{student.name}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{student.admissionNumber}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{student.gender}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{student.parentContact || "N/A"}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2">{student.blocked ? "Yes" : "No"}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-2 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        onClick={() => openEdit(student, enrollment)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Edit Student</h2>
              {hasChanges && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  {Object.keys(changedFields).length} field(s) changed
                </span>
              )}
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-2 sm:space-y-3">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.name ? 'border-green-500' : 'border-gray-300'
                  }`}
                  required
                />
                {changedFields.name && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* DOB */}
              <div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.dateOfBirth ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
                {changedFields.dateOfBirth && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* Gender - NOW FIXED */}
              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.gender ? 'border-green-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {changedFields.gender && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* Parent Contact - NOW FIXED */}
              <div>
                <input
                  type="text"
                  name="parentContact"
                  value={formData.parentContact}
                  onChange={handleChange}
                  placeholder="Parent Contact"
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.parentContact ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
                {changedFields.parentContact && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* Class */}
              <div>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={(e) => {
                    const classId = e.target.value;
                    setFormData({ ...formData, classId, armId: "" });
                  }}
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.classId ? 'border-green-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {changedFields.classId && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* Arm */}
              <div>
                <select
                  name="armId"
                  value={formData.armId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded text-sm sm:text-base ${
                    changedFields.armId ? 'border-green-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.classId}
                >
                  <option value="">Select Arm</option>
                  {formData.classId &&
                    classes
                      .find((cls) => cls._id === formData.classId)
                      ?.arms.map((arm) => (
                        <option key={arm._id} value={arm._id}>
                          {arm.name}
                        </option>
                      ))}
                </select>
                {changedFields.armId && (
                  <span className="text-green-600 text-xs">Changed</span>
                )}
              </div>

              {/* Image */}
              <div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border mt-2"
                  />
                )}
                <input
                  type="file"
                  name="picture"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full p-2 border rounded text-sm sm:text-base mt-1"
                />
                {changedFields.picture && (
                  <span className="text-green-600 text-xs">New picture selected</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges}
                  className={`px-4 py-2 rounded text-sm sm:text-base ${
                    hasChanges
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Update {hasChanges ? `(${Object.keys(changedFields).length})` : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;