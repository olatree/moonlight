
// src/pages/admin/ManageAttendance.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const ManageAttendance = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [arms, setArms] = useState([]);

  const [attendance, setAttendance] = useState([]);
  const [timesOpened, setTimesOpened] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ------------------ Fetch Active Session & Term ------------------
  const fetchActiveSessionTerm = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/sessions/active");
      setActiveSession(data.session || null);
      setActiveTerm(data.term || null);
    } catch (err) {
      console.error("Failed to fetch active session/term:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Fetch Classes (with Arms) ------------------
  const fetchClasses = async () => {
    try {
      const { data } = await api.get("/classes");
      setClasses(data || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  // ------------------ When Class Selected ------------------
  useEffect(() => {
    if (selectedClass) {
      const classObj = classes.find((c) => c._id === selectedClass);
      setArms(classObj?.arms || []);
    } else {
      setArms([]);
    }
    setSelectedArm("");
  }, [selectedClass, classes]);

  // ------------------ Fetch Attendance Summary ------------------
  const fetchAttendance = async () => {
    if (!selectedClass || !selectedArm || !activeSession || !activeTerm) return;

    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.get("/attendance/summary", {
        params: {
          classId: selectedClass,
          armId: selectedArm,
          sessionId: activeSession._id,
          termId: activeTerm._id,
        },
      });

      // Initialize table
      setAttendance(data.records || []);
      setTimesOpened(
        data.timesOpened === "N/A" ? 0 : Number(data.timesOpened)
      );
    } catch (err) {
      console.error("Failed to fetch attendance summary:", err);
      setMessage("Error fetching attendance summary.");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Save Attendance Summary ------------------
  const saveAttendance = async () => {
    if (!selectedClass || !selectedArm) return;
    try {
      setLoading(true);
      await api.post("/attendance/summary", {
        classId: selectedClass,
        armId: selectedArm,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        timesOpened,
        records: attendance.map((r) => ({
          studentId: r.studentId,
          timesPresent: r.timesPresent,
        })),
      });
      setMessage("✅ Attendance saved successfully!");
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setMessage("❌ Error saving attendance.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Load Session/Term + Classes on Mount ------------------
  useEffect(() => {
    fetchActiveSessionTerm();
    fetchClasses();
  }, []);

  // ------------------ Render ------------------
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Attendance Recording</h2>

      {/* Session / Term Display */}
      {activeSession && activeTerm && (
        <div className="mb-4 text-gray-700">
          <p>
            <strong>Session:</strong> {activeSession.name}
          </p>
          <p>
            <strong>Term:</strong> {activeTerm.name}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          value={selectedArm}
          onChange={(e) => setSelectedArm(e.target.value)}
          className="p-2 border rounded"
          disabled={!selectedClass}
        >
          <option value="">Select Arm</option>
          {arms.map((arm) => (
            <option key={arm._id} value={arm._id}>
              {arm.name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={!selectedClass || !selectedArm || loading}
        >
          {loading ? "Loading..." : "Load Attendance"}
        </button>
      </div>

      {/* Table */}
      {attendance.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Admission No.</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Times Present</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec, idx) => (
                <tr key={rec.studentId} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border text-center">
                    {rec.admissionNumber}
                  </td>
                  <td className="p-2 border">{rec.name}</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      min="0"
                      value={rec.timesPresent}
                      onChange={(e) =>
                        setAttendance((prev) =>
                          prev.map((r) =>
                            r.studentId === rec.studentId
                              ? { ...r, timesPresent: Number(e.target.value) }
                              : r
                          )
                        )
                      }
                      className="w-20 border rounded p-1 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Times Opened */}
          <div className="mt-4 flex items-center gap-4">
            <label className="font-medium">Times School Opened:</label>
            <input
              type="number"
              min="0"
              value={timesOpened}
              onChange={(e) => setTimesOpened(Number(e.target.value))}
              className="border rounded p-2 w-24"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={saveAttendance}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>

          {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
      ) : (
        <p className="text-gray-600 mt-6 italic">
          {loading ? "Loading attendance..." : "No records found yet."}
        </p>
      )}
    </div>
  );
};

export default ManageAttendance;
