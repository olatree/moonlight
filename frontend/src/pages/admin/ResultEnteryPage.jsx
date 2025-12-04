// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

// const ResultEntryPage = () => {
//   const { user } = useAuth();

//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [arms, setArms] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedArm, setSelectedArm] = useState(null);
//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const api = axios.create({
//     baseURL: "http://localhost:8000/api",
//     withCredentials: true,
//   });

//   // ------------------------------
//   // Fetch Active Session and Term
//   // ------------------------------
//   useEffect(() => {
//     const fetchActiveSessionTerm = async () => {
//       try {
//         const res = await api.get("/sessions/active");
//         setActiveSession(res.data.session);
//         setActiveTerm(res.data.term);
//       } catch (err) {
//         console.error("Error fetching active session/term:", err);
//         alert("Failed to fetch active session and term. Please set them first.");
//       }
//     };
//     fetchActiveSessionTerm();
//   }, []);

//   // ------------------------------
//   // Fetch Subjects
//   // ------------------------------
//   useEffect(() => {
//     if (!user) return;
//     const fetchSubjects = async () => {
//       try {
//         setLoading(true);
//         let res;
//         if (user.role === "admin" || user.role === "super_admin") {
//           res = await api.get("/subjects");
//         } else if (user.role === "teacher") {
//           res = await api.get(`/teacher-assignments/${user._id}/subjects`);
//         }
//         setSubjects(res?.data || []);
//       } catch (err) {
//         console.error("Error fetching subjects:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubjects();
//   }, [user]);

//   // ------------------------------
//   // Handlers
//   // ------------------------------
//   const handleSubjectSelect = async (subject) => {
//     setSelectedSubject(subject);
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setClasses([]);
//     setArms([]);
//     setStudents([]);
//     setScores({});
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/subjects/${subject._id ?? subject.id ?? subject.subjectId}/classes`
//       );
//       setClasses(res.data || []);
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClassSelect = (cls) => {
//     setSelectedClass(cls);
//     setSelectedArm(null);
//     setStudents([]);
//     setScores({});
//     setArms(cls.arms || cls.armsList || []);
//   };

//   const handleArmSelect = async (arm) => {
//     setSelectedArm(arm);
//     setStudents([]);
//     setScores({});
//     try {
//       setLoading(true);
//       const classId =
//         selectedClass?._id ?? selectedClass?.classId ?? selectedClass?.id;
//       const armId = arm?._id ?? arm?.armId ?? arm?.id;
//       const res = await api.get(`/students?classId=${classId}&armId=${armId}`);
//       setStudents(res.data || []);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleScoreChange = (enrollmentId, field, value) => {
//     let num = value === "" ? "" : Number(value);
//     if (field.startsWith("ca")) {
//       if (num > 10) num = 10;
//       if (num < 0) num = 0;
//     }
//     if (field === "exam") {
//       if (num > 60) num = 60;
//       if (num < 0) num = 0;
//     }
//     setScores((prev) => ({
//       ...prev,
//       [enrollmentId]: {
//         ...prev[enrollmentId],
//         [field]: num,
//       },
//     }));
//   };

//   // ------------------------------
//   // Submit Results (current session/term)
//   // ------------------------------
//   const handleSubmit = async () => {
//     if (!activeSession || !activeTerm) {
//       alert("No active session or term found. Please activate them first.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const subjectId =
//         selectedSubject?._id ??
//         selectedSubject?.id ??
//         selectedSubject?.subjectId;
//       const classId =
//         selectedClass?._id ?? selectedClass?.classId ?? selectedClass?.id;
//       const armId = selectedArm?._id ?? selectedArm?.armId ?? selectedArm?.id;

//       const resultsArray = Object.entries(scores).map(([enrollmentId, sc]) => {
//         const result = { enrollmentId };
//         ["ca1", "ca2", "ca3", "ca4", "exam"].forEach((field) => {
//           if (sc[field] !== undefined && sc[field] !== "") {
//             result[field] = Number(sc[field]);
//           }
//         });
//         return result;
//       });

//       await api.post("/results/add-or-update", {
//         subjectId,
//         classId,
//         armId,
//         sessionId: activeSession._id,
//         termId: activeTerm._id,
//         results: resultsArray,
//       });

//       alert("Results saved successfully!");
//     } catch (err) {
//       console.error("Error saving results:", err);
//       alert("Failed to save results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------------------
//   // Render UI
//   // ------------------------------
//   return (
//     <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-xl font-bold mb-4 text-center text-green-700">
//         Result Entry
//       </h2>

//       {activeSession && activeTerm && (
//         <p className="text-center mb-4 text-sm text-gray-600">
//           Active Session: <b>{activeSession.name}</b> | Term:{" "}
//           <b>{activeTerm.name}</b>
//         </p>
//       )}

//       {loading && (
//         <p className="text-blue-600 font-medium mb-4 text-center">Loading...</p>
//       )}

//       {/* SUBJECTS */}
//       <div className="mb-4">
//         <h3 className="font-semibold mb-2 text-green-700">Select Subject</h3>
//         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
//           {subjects.map((subj) => (
//             <button
//               key={subj._id ?? subj.id ?? subj.subjectId}
//               disabled={loading}
//               onClick={() => handleSubjectSelect(subj)}
//               className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                 (selectedSubject?._id ?? selectedSubject?.id) ===
//                 (subj._id ?? subj.id)
//                   ? "bg-green-600 text-white"
//                   : "bg-white border border-gray-300 text-gray-700"
//               }`}
//             >
//               {subj.name ?? subj.title}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* CLASSES */}
//       {selectedSubject && (
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2 text-purple-700">Select Class</h3>
//           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
//             {classes.map((cls) => (
//               <button
//                 key={cls._id ?? cls.id ?? cls.classId}
//                 disabled={loading}
//                 onClick={() => handleClassSelect(cls)}
//                 className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                   (selectedClass?._id ?? selectedClass?.id) ===
//                   (cls._id ?? cls.id)
//                     ? "bg-purple-600 text-white"
//                     : "bg-white border border-gray-300 text-gray-700"
//                 }`}
//               >
//                 {cls.name ?? cls.className}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ARMS */}
//       {selectedClass && (
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2 text-blue-700">Select Arm</h3>
//           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
//             {arms.map((arm) => (
//               <button
//                 key={arm._id ?? arm.id ?? arm.armId}
//                 disabled={loading}
//                 onClick={() => handleArmSelect(arm)}
//                 className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                   (selectedArm?._id ?? selectedArm?.id) === (arm._id ?? arm.id)
//                     ? "bg-blue-600 text-white"
//                     : "bg-white border border-gray-300 text-gray-700"
//                 }`}
//               >
//                 {arm.name ?? arm.armName}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* STUDENTS */}
//       {selectedArm && (
//         <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
//           <h3 className="font-semibold mb-3 text-green-700 p-2">Enter Scores</h3>
//           <table className="w-full border text-xs sm:text-sm">
//             <thead>
//               <tr className="bg-green-600 text-white">
//                 <th className="border p-2">Student</th>
//                 <th className="border p-2">CA1</th>
//                 <th className="border p-2">CA2</th>
//                 <th className="border p-2">CA3</th>
//                 <th className="border p-2">CA4</th>
//                 <th className="border p-2">Exam</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((enr) => {
//                 const enrId = enr._id;
//                 const student = enr.studentId;
//                 return (
//                   <tr key={enrId} className="odd:bg-gray-50 text-center">
//                     <td className="border p-2 text-left">{student?.name}</td>
//                     {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => {
//                       const value = scores[enrId]?.[field] ?? "";
//                       return (
//                         <td key={`${enrId}-${field}`} className="border p-1">
//                           <input
//                             type="number"
//                             value={value}
//                             onChange={(e) =>
//                               handleScoreChange(enrId, field, e.target.value)
//                             }
//                             className="w-14 sm:w-20 border p-1 rounded text-center focus:outline-none focus:ring-1 focus:ring-green-400"
//                           />
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           <div className="flex justify-center mt-4 pb-4">
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm sm:text-base disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Save Results"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultEntryPage;


import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ResultEntryPage = () => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [loading, setLoading] = useState(false);

  // const api = axios.create({
  //   baseURL: "http://localhost:8000/api",
  //   withCredentials: true,
  // });

  // ------------------------------
  // Fetch Active Session and Term
  // ------------------------------
  useEffect(() => {
    const fetchActiveSessionTerm = async () => {
      try {
        const res = await api.get("/sessions/active");
        setActiveSession(res.data.session);
        setActiveTerm(res.data.term);
      } catch (err) {
        console.error("Error fetching active session/term:", err);
        alert("Failed to fetch active session and term. Please set them first.");
      }
    };
    fetchActiveSessionTerm();
  }, []);

  // ------------------------------
  // Fetch Subjects
  // ------------------------------
  useEffect(() => {
    if (!user) return;
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        let res;
        if (user.role === "admin" || user.role === "super_admin" || user.role === "principal" || user.role === "teacher") {
          res = await api.get("/subjects");
        } else if (user.role === "teacher") {
          res = await api.get(`/teacher-assignments/${user._id}/subjects`);
        }
        setSubjects(res?.data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [user]);

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setSelectedClass(null);
    setSelectedArm(null);
    setClasses([]);
    setArms([]);
    setStudents([]);
    setScores({});
    try {
      setLoading(true);
      const res = await api.get(
        `/subjects/${subject._id ?? subject.id ?? subject.subjectId}/classes`
      );
      setClasses(res.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedArm(null);
    setStudents([]);
    setScores({});
    setArms(cls.arms || cls.armsList || []);
  };

  // 🟩 UPDATED — Load existing scores when selecting Arm
  const handleArmSelect = async (arm) => {
    setSelectedArm(arm);
    setStudents([]);
    setScores({});

    try {
      setLoading(true);

      const classId =
        selectedClass?._id ?? selectedClass?.classId ?? selectedClass?.id;
      const armId = arm?._id ?? arm?.armId ?? arm?.id;
      const subjectId =
        selectedSubject?._id ??
        selectedSubject?.id ??
        selectedSubject?.subjectId;

      // 1️⃣ Fetch enrolled students for that class/arm/session
      const stuRes = await api.get(
        `/students?classId=${classId}&armId=${armId}&sessionId=${activeSession?._id}`
      );
      const studentList = stuRes.data || [];

      // 2️⃣ Fetch previously entered results for this subject/class/arm/session/term
      const resultRes = await api.get("/results/by-subject", {
        params: {
          subjectId,
          classId,
          armId,
          sessionId: activeSession?._id,
          termId: activeTerm?._id,
        },
      });

      const existingResults = resultRes.data || [];

      // 3️⃣ Merge students + existing scores
      const newScores = {};
      existingResults.forEach((r) => {
        const enrId = r.enrollmentId?._id ?? r.enrollmentId ?? r._id;
        newScores[enrId] = {
          ca1: r.ca1 ?? "",
          ca2: r.ca2 ?? "",
          ca3: r.ca3 ?? "",
          ca4: r.ca4 ?? "",
          exam: r.exam ?? "",
        };
      });

      setStudents(studentList);
      setScores(newScores);
    } catch (err) {
      console.error("Error fetching arm data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (enrollmentId, field, value) => {
    let num = value === "" ? "" : Number(value);
    if (field.startsWith("ca")) {
      if (num > 10) num = 10;
      if (num < 0) num = 0;
    }
    if (field === "exam") {
      if (num > 60) num = 60;
      if (num < 0) num = 0;
    }
    setScores((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        [field]: num,
      },
    }));
  };

  // ------------------------------
  // Submit Results (current session/term)
  // ------------------------------
  const handleSubmit = async () => {
    if (!activeSession || !activeTerm) {
      alert("No active session or term found. Please activate them first.");
      return;
    }

    try {
      setLoading(true);
      const subjectId =
        selectedSubject?._id ??
        selectedSubject?.id ??
        selectedSubject?.subjectId;
      const classId =
        selectedClass?._id ?? selectedClass?.classId ?? selectedClass?.id;
      const armId = selectedArm?._id ?? selectedArm?.armId ?? selectedArm?.id;

      const resultsArray = Object.entries(scores).map(([enrollmentId, sc]) => {
        const result = { enrollmentId };
        ["ca1", "ca2", "ca3", "ca4", "exam"].forEach((field) => {
          if (sc[field] !== undefined && sc[field] !== "") {
            result[field] = Number(sc[field]);
          }
        });
        return result;
      });

      await api.post("/results/add-or-update", {
        subjectId,
        classId,
        armId,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        results: resultsArray,
      });

      alert("Results saved successfully!");
    } catch (err) {
      console.error("Error saving results:", err);
      alert("Failed to save results.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-center text-green-700">
        Result Entry
      </h2>

      {activeSession && activeTerm && (
        <p className="text-center mb-4 text-sm text-gray-600">
          Active Session: <b>{activeSession.name}</b> | Term:{" "}
          <b>{activeTerm.name}</b>
        </p>
      )}

      {loading && (
        <p className="text-blue-600 font-medium mb-4 text-center">Loading...</p>
      )}

      {/* SUBJECTS */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-green-700">Select Subject</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {subjects.map((subj) => (
            <button
              key={subj._id ?? subj.id ?? subj.subjectId}
              disabled={loading}
              onClick={() => handleSubjectSelect(subj)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                (selectedSubject?._id ?? selectedSubject?.id) ===
                (subj._id ?? subj.id)
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              {subj.name ?? subj.title}
            </button>
          ))}
        </div>
      </div>

      {/* CLASSES */}
      {selectedSubject && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-purple-700">Select Class</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {classes.map((cls) => (
              <button
                key={cls._id ?? cls.id ?? cls.classId}
                disabled={loading}
                onClick={() => handleClassSelect(cls)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  (selectedClass?._id ?? selectedClass?.id) ===
                  (cls._id ?? cls.id)
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                {cls.name ?? cls.className}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ARMS */}
      {selectedClass && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-blue-700">Select Arm</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {arms.map((arm) => (
              <button
                key={arm._id ?? arm.id ?? arm.armId}
                disabled={loading}
                onClick={() => handleArmSelect(arm)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  (selectedArm?._id ?? selectedArm?.id) === (arm._id ?? arm.id)
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                {arm.name ?? arm.armName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {selectedArm && students.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
          <h3 className="font-semibold mb-3 text-green-700 p-2">Enter Scores</h3>
          <table className="w-full border text-xs sm:text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border p-2">Student</th>
                <th className="border p-2">CA1</th>
                <th className="border p-2">CA2</th>
                <th className="border p-2">CA3</th>
                <th className="border p-2">CA4</th>
                <th className="border p-2">Exam</th>
              </tr>
            </thead>
            <tbody>
              {students.map((enr) => {
                const enrId = enr._id;
                const student = enr.studentId;
                const currentScores = scores[enrId] || {};
                return (
                  <tr key={enrId} className="odd:bg-gray-50 text-center">
                    <td className="border p-2 text-left">{student?.name}</td>
                    {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
                      <td key={`${enrId}-${field}`} className="border p-1">
                        <input
                          type="number"
                          value={currentScores[field] ?? ""}
                          onChange={(e) =>
                            handleScoreChange(enrId, field, e.target.value)
                          }
                          className="w-14 sm:w-20 border p-1 rounded text-center focus:outline-none focus:ring-1 focus:ring-green-400"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 pb-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultEntryPage;
