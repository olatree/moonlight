import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const PrincipalReportEntry = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // Fetch Active Session and Term
  // ------------------------------
  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await api.get("/sessions/active");
        setActiveSession(res.data.session);
        setActiveTerm(res.data.term);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch active session/term. Please set them first.");
      }
    };
    fetchActive();
  }, []);

  // ------------------------------
  // Fetch Classes
  // ------------------------------
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // ------------------------------
  // Handle Class Select
  // ------------------------------
  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedArm(null);
    setStudents([]);
    setComments({});
    setArms(cls.arms || cls.armsList || []);
  };

  // ------------------------------
  // Handle Arm Select
  // ------------------------------
  const handleArmSelect = async (arm) => {
    setSelectedArm(arm);
    setStudents([]);
    setComments({});

    try {
      setLoading(true);
      const classId = selectedClass?._id ?? selectedClass?.id;
      const armId = arm?._id ?? arm?.id;

      // 1️⃣ Fetch enrolled students
      const stuRes = await api.get(
        `/students?classId=${classId}&armId=${armId}&sessionId=${activeSession?._id}`
      );
      const studentList = stuRes.data || [];

      // 2️⃣ Fetch existing term reports (to prefill principal comments)
      const reportRes = await api.get("/term-reports", {
        params: {
          classId,
          armId,
          sessionId: activeSession?._id,
          termId: activeTerm?._id,
        },
      });

      const reports = reportRes.data?.reports || [];
      console.log("Reports:", reportRes);

      const existingComments = {};
      reports.forEach((r) => {
        const sid = r.enrollmentId?.studentId?._id;
        if (sid) existingComments[sid] = r.principalComment || "";
      });

      setStudents(studentList);
      setComments(existingComments);
    } catch (err) {
      console.error("Error fetching students/reports:", err);
      alert("Failed to load students or reports.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Handle Comment Change
  // ------------------------------
  const handleCommentChange = (studentId, value) => {
    setComments((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // ------------------------------
  // Save Comments
  // ------------------------------
  const handleSave = async () => {
    if (!activeSession || !activeTerm) {
      alert("Active session and term not found.");
      return;
    }

    try {
      setLoading(true);
      const classId = selectedClass?._id ?? selectedClass?.id;
      const armId = selectedArm?._id ?? selectedArm?.id;

      const payload = Object.entries(comments).map(([studentId, comment]) => ({
        studentId,
        classId,
        armId,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        principalComment: comment,
      }));

      await api.post("/term-reports/principal", { reports: payload });

      alert("✅ Principal comments saved successfully!");
    } catch (err) {
      console.error("Error saving comments:", err);
      alert("❌ Failed to save comments.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-scroll p-4 md:overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-green-700 mb-4">
          Principal’s Report Entry
        </h2>

        {activeSession && activeTerm && (
          <p className="text-center mb-4 text-sm text-gray-600">
            Session: <b>{activeSession.name}</b> | Term: <b>{activeTerm.name}</b>
          </p>
        )}

        {/* Select Class */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-green-700">Select Class</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {classes.map((cls) => (
              <button
                key={cls._id}
                className={`px-3 py-1 rounded text-sm ${
                  selectedClass?._id === cls._id
                    ? "bg-green-600 text-white"
                    : "bg-white border"
                }`}
                onClick={() => handleClassSelect(cls)}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        {/* Select Arm */}
        {selectedClass && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-purple-700">Select Arm</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {arms.map((arm) => (
                <button
                  key={arm._id}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedArm?._id === arm._id
                      ? "bg-purple-600 text-white"
                      : "bg-white border"
                  }`}
                  onClick={() => handleArmSelect(arm)}
                >
                  {arm.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Students */}
        {selectedArm && students.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold text-green-700 mb-3">
              Enter Principal’s Comments
            </h3>

            {loading && (
              <p className="text-center text-gray-500">Loading...</p>
            )}

            <div className="space-y-3">
              {students.map((enr) => {
                const student = enr.studentId;
                const sid = student?._id ?? enr._id;
                return (
                  <div
                    key={sid}
                    className="border p-2 rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center gap-2"
                  >
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {student?.name ||
                        `${student?.firstName} ${student?.lastName}`}
                    </span>
                    <textarea
                      className="w-full sm:w-2/3 border rounded p-2 text-sm"
                      placeholder="Enter comment..."
                      value={comments[sid] || ""}
                      onChange={(e) =>
                        handleCommentChange(sid, e.target.value)
                      }
                    ></textarea>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Comments"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalReportEntry;
