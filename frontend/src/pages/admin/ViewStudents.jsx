// // src/pages/admin/ViewStudents.jsx
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function ViewStudents() {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");
//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // modal
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const printRef = useRef();

//   // ------------------ Fetch Active Session & Term ------------------
//   const fetchActiveSessionTerm = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         "http://localhost:8000/api/sessions/active",
//         { withCredentials: true }
//       );
//       setActiveSession(data.session || null);
//       setActiveTerm(data.term || null);
//     } catch (err) {
//       console.error("Failed to fetch active session/term:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveSessionTerm();
//   }, []);

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
//     if (!activeSession) return;
//     setLoading(true);
//     setError("");
//     try {
//       const params = { sessionId: activeSession._id };
//       if (selectedClass) params.classId = selectedClass;
//       if (selectedArm) params.armId = selectedArm;

//       const { data } = await axios.get("http://localhost:8000/api/students", {
//         params,
//         withCredentials: true,
//       });
//       setStudents(data || []);
//     } catch (err) {
//       console.error("Failed to fetch students:", err);
//       setError("Failed to fetch students");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, [activeSession, selectedClass, selectedArm]);

//   // ------------------ Arms for selected class ------------------
//   const armsForSelectedClass = () => {
//     if (!selectedClass) return [];
//     const cls = classes.find((c) => c._id === selectedClass);
//     return cls?.arms || [];
//   };

//   // ------------------ Modal controls ------------------
//   const openModal = (student) => setSelectedStudent(student);
//   const closeModal = () => setSelectedStudent(null);

//   // ------------------ Block/Unblock ------------------
//   const toggleBlock = async () => {
//     if (!selectedStudent) return;
//     try {
//       const studentId = selectedStudent.studentId._id;
//       const url = selectedStudent.studentId.blocked
//         ? `http://localhost:8000/api/students/${studentId}/unblock`
//         : `http://localhost:8000/api/students/${studentId}/block`;

//       const { data } = await axios.patch(url, {}, { withCredentials: true });

//       toast.success(data.message);
//       fetchStudents();
//       closeModal();
//     } catch (err) {
//       console.error("Failed to toggle block:", err);
//       toast.error("Failed to update student status");
//     }
//   };

//   // ------------------ Print Function ------------------
//   const handlePrint = () => {
//     if (!printRef.current) return;

//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "height=700,width=900");

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Student Profile</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
//             .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
//             .header img { height: 60px; margin-bottom: 5px; }
//             .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
//             .header p { margin: 2px 0; font-size: 12px; }
//             .profile { display: flex; justify-content: space-between; margin-bottom: 20px; }
//             .profile-info { flex: 1; }
//             .profile-photo img { width: 90px; height: 90px; object-fit: cover; border: 1px solid #000; border-radius: 6px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { text-align: left; padding: 8px; font-size: 14px; border-bottom: 1px solid #ddd; }
//             th { width: 35%; }
//             .section-title { margin-top: 20px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; }
//             .signature { margin-top: 50px; display: flex; justify-content: space-between; font-size: 14px; }
//             .signature div { text-align: center; }
//             .footer { margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #000; padding-top: 10px; }
//           </style>
//         </head>
//         <body>
//           ${printContents}
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.print();
//   };

//   // ------------------ Pagination logic ------------------
//   const totalPages = Math.ceil(students.length / pageSize);
//   const paginatedStudents = students.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   // ------------------ Render ------------------
//   return (
//     <div className="p-4 sm:p-6">
//       <div className="bg-white p-4 sm:p-6 rounded shadow max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
//           <h2 className="text-lg sm:text-xl font-semibold">
//             Students — Current Session
//           </h2>
//           <div className="text-sm text-gray-600">
//             {activeSession && activeTerm
//               ? `Active: ${activeSession.name} (${activeTerm.name})`
//               : "No active session/term"}
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">Class</label>
//             <select
//               value={selectedClass}
//               onChange={(e) => {
//                 setSelectedClass(e.target.value);
//                 setSelectedArm("");
//               }}
//               className="border rounded p-2 w-full"
//             >
//               <option value="">All Classes</option>
//               {classes.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">Arm</label>
//             <select
//               value={selectedArm}
//               onChange={(e) => setSelectedArm(e.target.value)}
//               className="border rounded p-2 w-full"
//               disabled={!selectedClass}
//             >
//               <option value="">All Arms</option>
//               {armsForSelectedClass().map((a) => (
//                 <option key={a._id} value={a._id}>
//                   {a.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border text-sm sm:text-base">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2 text-left">Name</th>
//                 <th className="border p-2 text-left">Admission No</th>
//                 <th className="border p-2 text-left">Class</th>
//                 <th className="border p-2 text-left">Arm</th>
//                 <th className="border p-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="p-4 text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan="5" className="p-4 text-center text-red-600">
//                     {error}
//                   </td>
//                 </tr>
//               ) : paginatedStudents.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-4 text-center text-gray-500">
//                     No students found
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedStudents.map((en) => (
//                   <tr
//                     key={en._id}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={() => openModal(en)}
//                   >
//                     <td className="border p-2">{en.studentId?.name || "—"}</td>
//                     <td className="border p-2">
//                       {en.studentId?.admissionNumber || "—"}
//                     </td>
//                     <td className="border p-2">{en.classId?.name || "—"}</td>
//                     <td className="border p-2">{en.armId?.name || "—"}</td>
//                     <td className="border p-2">
//                       {en.studentId?.blocked ? (
//                         <span className="text-red-600">Blocked</span>
//                       ) : (
//                         <span className="text-green-600">Active</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-4 space-x-2 flex-wrap">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setCurrentPage(p)}
//                 className={`px-3 py-1 rounded mb-2 ${
//                   currentPage === p
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Student Detail Modal */}
//       {selectedStudent && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Printable Section */}
//             <div ref={printRef}>
//               <div className="header text-center mb-4">
//                 <img
//                   src="/school-logo.png"
//                   alt="School Logo"
//                   className="mx-auto h-16"
//                 />
//                 <h1 className="text-xl font-bold">Moonlight Secondary School</h1>
//                 <p className="text-sm text-gray-600">Student Profile Report</p>
//               </div>

//               {/* Profile Section */}
//               <div className="profile flex justify-between items-start mb-4">
//                 <div className="profile-info">
//                   <h3 className="text-lg font-semibold mb-2">Student Profile</h3>
//                 </div>
//                 <div className="profile-photo">
//                   <img
//                     src={selectedStudent.studentId?.image || "/placeholder.png"}
//                     alt="Student"
//                     className="w-20 h-20 rounded border object-cover"
//                   />
//                 </div>
//               </div>

//               {/* Info Sections */}
//               <div>
//                 <div className="section-title">Biodata</div>
//                 <table>
//                   <tbody>
//                     <tr>
//                       <th>Name</th>
//                       <td>{selectedStudent.studentId?.name}</td>
//                     </tr>
//                     <tr>
//                       <th>Admission No</th>
//                       <td>{selectedStudent.studentId?.admissionNumber}</td>
//                     </tr>
//                     <tr>
//                       <th>Gender</th>
//                       <td>{selectedStudent.studentId?.gender}</td>
//                     </tr>
//                     <tr>
//                       <th>Date of Birth</th>
//                       <td>
//                         {selectedStudent.studentId?.dateOfBirth
//                           ? new Date(
//                               selectedStudent.studentId.dateOfBirth
//                             ).toLocaleDateString()
//                           : "—"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 <div className="section-title">Academic Placement</div>
//                 <table>
//                   <tbody>
//                     <tr>
//                       <th>Class</th>
//                       <td>{selectedStudent.classId?.name}</td>
//                     </tr>
//                     <tr>
//                       <th>Arm</th>
//                       <td>{selectedStudent.armId?.name}</td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>
//                         {selectedStudent.studentId?.blocked
//                           ? "Blocked"
//                           : "Active"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 <div className="section-title">Guardian Information</div>
//                 <table>
//                   <tbody>
//                     <tr>
//                       <th>Contact</th>
//                       <td>{selectedStudent.studentId?.parentContact}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Signature Section */}
//               <div className="signature mt-8">
//                 <div>
//                   __________________________ <br />
//                   Parent/Guardian Signature
//                 </div>
//                 <div>
//                   __________________________ <br />
//                   Principal’s Signature
//                 </div>
//               </div>

//               <div className="footer">
//                 Generated by Moonlight School Management System
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="mt-4 flex flex-col sm:flex-row gap-2">
//               <button
//                 onClick={toggleBlock}
//                 className={`px-4 py-2 rounded text-white ${
//                   selectedStudent.studentId?.blocked
//                     ? "bg-green-600"
//                     : "bg-red-600"
//                 }`}
//               >
//                 {selectedStudent.studentId?.blocked ? "Unblock" : "Block"}
//               </button>
//               <button
//                 onClick={handlePrint}
//                 className="px-4 py-2 rounded bg-blue-600 text-white"
//               >
//                 Print
//               </button>
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 rounded bg-gray-300"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// src/pages/admin/ViewStudents.jsx
import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const printRef = useRef();

  // list print ref
  const listPrintRef = useRef();

  // ------------------ Fetch Active Session & Term ------------------
  const fetchActiveSessionTerm = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        "/sessions/active",
        { withCredentials: true }
      );
      setActiveSession(data.session || null);
      setActiveTerm(data.term || null);
    } catch (err) {
      console.error("Failed to fetch active session/term:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessionTerm();
  }, []);

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
    if (!activeSession) return;
    setLoading(true);
    setError("");
    try {
      const params = { sessionId: activeSession._id };
      if (selectedClass) params.classId = selectedClass;
      if (selectedArm) params.armId = selectedArm;

      const { data } = await api.get("/students", {
        params,
        withCredentials: true,
      });
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [activeSession, selectedClass, selectedArm]);

  // ------------------ Arms for selected class ------------------
  const armsForSelectedClass = () => {
    if (!selectedClass) return [];
    const cls = classes.find((c) => c._id === selectedClass);
    return cls?.arms || [];
  };

  // ------------------ Modal controls ------------------
  const openModal = (student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  // ------------------ Block/Unblock ------------------
  const toggleBlock = async () => {
    if (!selectedStudent) return;
    try {
      const studentId = selectedStudent.studentId._id;
      const url = selectedStudent.studentId.blocked
        ? `students/${studentId}/unblock`
        : `students/${studentId}/block`;

      const { data } = await api.patch(url, {}, { withCredentials: true });

      toast.success(data.message);
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Failed to toggle block:", err);
      toast.error("Failed to update student status");
    }
  };

  // ------------------ Print Student Profile ------------------
  // ------------------ Print Function (Modal - Report Card) ------------------
const handlePrint = () => {
  if (!printRef.current) return;

  const printContents = printRef.current.innerHTML;
  const printWindow = window.open("", "", "height=700,width=900");

  printWindow.document.write(`
    <html>
      <head>
        <title>Student Report Card</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
          .report-card {
            border: 1px solid #000;
            padding: 20px;
            max-width: 700px;
            margin: auto;
          }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .header img { height: 50px; }
          .header h1 { margin: 5px 0; font-size: 18px; }
          .header p { margin: 0; font-size: 12px; }
          .profile { display: flex; align-items: center; margin-bottom: 15px; }
          .profile img { width: 80px; height: 80px; border-radius: 50%; border: 1px solid #333; object-fit: cover; margin-right: 20px; }
          .sections { margin-top: 10px; }
          .section { margin-bottom: 15px; }
          .section h3 { font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 3px; margin-bottom: 8px; }
          .section p { margin: 3px 0; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; border-top: 1px solid #000; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="report-card">
          ${printContents}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};


  // ------------------ Print Students List ------------------
  const handlePrintList = () => {
    if (!listPrintRef.current) return;

    // build rows for ALL students (ignore pagination)
    const rows = students
      .map(
        (en, idx) => `
        <tr>
          <td style="border:1px solid #ddd;padding:6px;text-align:center;">${
            idx + 1
          }</td>
          <td style="border:1px solid #ddd;padding:6px;">${
            en.studentId?.name || "—"
          }</td>
          <td style="border:1px solid #ddd;padding:6px;">${
            en.studentId?.admissionNumber || "—"
          }</td>
          <td style="border:1px solid #ddd;padding:6px;">${
            en.classId?.name || "—"
          }</td>
          <td style="border:1px solid #ddd;padding:6px;">${
            en.armId?.name || "—"
          }</td>
          <td style="border:1px solid #ddd;padding:6px;">${
            en.studentId?.blocked ? "Blocked" : "Active"
          }</td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "", "height=700,width=900");
    printWindow.document.write(`
      <html>
        <head>
          <title>Students List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .header img { height: 60px; margin-bottom: 5px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
            .header p { margin: 2px 0; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 13px; text-align: left; }
            th { background: #f5f5f5; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/school-logo.png" alt="School Logo" />
            <h1>Moonlight Secondary School</h1>
            <p>Students List — ${activeSession?.name || ""} ${
      activeTerm ? "(" + activeTerm.name + ")" : ""
    }</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Admission No</th>
                <th>Class</th>
                <th>Arm</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="footer">
            Generated on ${new Date().toLocaleString()} by Moonlight School Management System
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ------------------ Pagination logic ------------------
  const totalPages = Math.ceil(students.length / pageSize);
  const paginatedStudents = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ------------------ Render ------------------
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded shadow max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Students — Current Session
          </h2>
          <div className="text-sm text-gray-600">
            {activeSession && activeTerm
              ? `Active: ${activeSession.name} (${activeTerm.name})`
              : "No active session/term"}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedArm("");
              }}
              className="border rounded p-2 w-full"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Arm</label>
            <select
              value={selectedArm}
              onChange={(e) => setSelectedArm(e.target.value)}
              className="border rounded p-2 w-full"
              disabled={!selectedClass}
            >
              <option value="">All Arms</option>
              {armsForSelectedClass().map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={handlePrintList}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Print Students List
          </button>
        </div>

        {/* Table */}
        <div ref={listPrintRef} className="overflow-x-auto">
          <table className="min-w-full border-collapse border text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">SN</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Admission No</th>
                <th className="border p-2 text-left">Class</th>
                <th className="border p-2 text-left">Arm</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((en, idx) => (
                  <tr
                    key={en._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openModal(en)}
                  >
                    <td className="border p-2 text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="border p-2">{en.studentId?.name || "—"}</td>
                    <td className="border p-2">
                      {en.studentId?.admissionNumber || "—"}
                    </td>
                    <td className="border p-2">{en.classId?.name || "—"}</td>
                    <td className="border p-2">{en.armId?.name || "—"}</td>
                    <td className="border p-2">
                      {en.studentId?.blocked ? (
                        <span className="text-red-600">Blocked</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded mb-2 ${
                  currentPage === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Printable Section */}
            {/* Printable Section */}
<div ref={printRef} className="report-card">
  <div className="header">
    <img src="/school-logo.png" alt="School Logo" />
    <h1>Moonlight Secondary School</h1>
    <p>Student Report Card</p>
  </div>

  <div className="profile">
    <img
      src={selectedStudent.studentId?.image || "/placeholder.png"}
      alt="Student"
      className="w-28 h-28 rounded-full object-cover border-2 border-gray-400"
    />
    <div>
      <p><strong>Name:</strong> {selectedStudent.studentId?.name}</p>
      <p><strong>Admission No:</strong> {selectedStudent.studentId?.admissionNumber}</p>
      <p><strong>Gender:</strong> {selectedStudent.studentId?.gender}</p>
      <p>
        <strong>DOB:</strong>{" "}
        {selectedStudent.studentId?.dateOfBirth
          ? new Date(selectedStudent.studentId.dateOfBirth).toLocaleDateString()
          : "—"}
      </p>
    </div>
  </div>

  <div className="sections">
    <div className="section">
      <h3>Academic Placement</h3>
      <p><strong>Class:</strong> {selectedStudent.classId?.name}</p>
      <p><strong>Arm:</strong> {selectedStudent.armId?.name}</p>
      <p><strong>Status:</strong> {selectedStudent.studentId?.blocked ? "Blocked" : "Active"}</p>
    </div>

    <div className="section">
      <h3>Guardian Information</h3>
      <p><strong>Contact:</strong> {selectedStudent.studentId?.parentContact}</p>
    </div>
  </div>

  <div className="footer">
    Printed on {new Date().toLocaleDateString()}
  </div>
</div>


            {/* Modal Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={toggleBlock}
                className={`px-4 py-2 rounded text-white ${
                  selectedStudent.studentId?.blocked
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {selectedStudent.studentId?.blocked ? "Unblock" : "Block"}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Print
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
