import React, { useEffect, useState } from "react";
import api from "../../api/axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });

export default function ViewResultsBySubject() {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, []);

  // 🔹 Fetch classes (with arms)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // 🔹 Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // 🔹 Fetch results
  const fetchResults = async () => {
    if (!selectedSession || !selectedTerm || !selectedClass || !selectedArm || !selectedSubject) return;

    setLoading(true);
    try {
      const res = await api.get("/results/by-subject", {
        params: {
          classId: selectedClass._id,
          armId: selectedArm._id,
          subjectId: selectedSubject._id,
          termId: selectedTerm._id,
          sessionId: selectedSession._id,
        },
      });
      setResults(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-4 text-center">
        📊 View Results by Subject
      </h2>

      {/* 🔹 Compact Horizontal Filter Bar */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 bg-white shadow-sm p-3 rounded-lg mb-5">
        {/* Session */}
        <select
          onChange={(e) => {
            const session = sessions.find((s) => s._id === e.target.value);
            setSelectedSession(session);
            setSelectedTerm(null);
          }}
          value={selectedSession?._id || ""}
          className="border rounded px-2 py-2 text-sm min-w-[130px]"
        >
          <option value="">Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Term */}
        <select
          onChange={(e) => {
            const term = selectedSession?.terms.find((t) => t._id === e.target.value);
            setSelectedTerm(term);
          }}
          value={selectedTerm?._id || ""}
          disabled={!selectedSession}
          className="border rounded px-2 py-2 text-sm min-w-[110px]"
        >
          <option value="">Term</option>
          {selectedSession?.terms.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Class */}
        <select
          onChange={(e) => {
            const cls = classes.find((c) => c._id === e.target.value);
            setSelectedClass(cls);
            setSelectedArm(null);
          }}
          value={selectedClass?._id || ""}
          disabled={!selectedTerm}
          className="border rounded px-2 py-2 text-sm min-w-[120px]"
        >
          <option value="">Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Arm */}
        <select
          onChange={(e) => {
            const arm = selectedClass?.arms.find((a) => a._id === e.target.value);
            setSelectedArm(arm);
          }}
          value={selectedArm?._id || ""}
          disabled={!selectedClass}
          className="border rounded px-2 py-2 text-sm min-w-[120px]"
        >
          <option value="">Arm</option>
          {selectedClass?.arms.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          onChange={(e) => {
            const subj = subjects.find((s) => s._id === e.target.value);
            setSelectedSubject(subj);
          }}
          value={selectedSubject?._id || ""}
          disabled={!selectedArm}
          className="border rounded px-2 py-2 text-sm min-w-[150px]"
        >
          <option value="">Subject</option>
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.name}
            </option>
          ))}
        </select>

        {/* View Button */}
        <button
          onClick={fetchResults}
          disabled={loading || !selectedSubject}
          className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
            loading || !selectedSubject
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-purple-700 text-white hover:bg-purple-800"
          }`}
        >
          {loading ? "Loading..." : "View"}
        </button>
      </div>

      {/* 🔹 Results Table */}
      <div className="mt-4">
        {loading ? (
          <p className="text-center text-gray-500">Fetching results...</p>
        ) : results.length > 0 ? (
          <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">
                {selectedClass?.name} ({selectedArm?.name}) - {selectedSubject?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Term: {selectedTerm?.name} | Session: {selectedSession?.name}
              </p>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow-sm">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">CA1</th>
                    <th className="border p-2">CA2</th>
                    <th className="border p-2">CA3</th>
                    <th className="border p-2">CA4</th>
                    <th className="border p-2">Exam</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r._id || i} className="odd:bg-white even:bg-gray-50">
                      <td className="border p-2 text-center">{i + 1}</td>
                      <td className="border p-2">{r.student?.name || "Unknown"}</td>
                      <td className="border p-2 text-center">{r.ca1}</td>
                      <td className="border p-2 text-center">{r.ca2}</td>
                      <td className="border p-2 text-center">{r.ca3}</td>
                      <td className="border p-2 text-center">{r.ca4}</td>
                      <td className="border p-2 text-center">{r.exam}</td>
                      <td className="border p-2 text-center font-semibold">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 italic mt-4">
            No results available for this selection.
          </p>
        )}
      </div>
    </div>
  );
}
