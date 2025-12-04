import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function PromoteRepeatStudent() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [targetArm, setTargetArm] = useState("");
  const [targetSession, setTargetSession] = useState("");
  const [targetTerm, setTargetTerm] = useState("");
  const [isPromote, setIsPromote] = useState(true);

  // const api = axios.create({
  //   baseURL: "http://localhost:8000/api",
  //   withCredentials: true,
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, classRes, sessionRes, termRes] = await Promise.all([
          api.get("/students"),
          api.get("/classes"),
          api.get("/sessions"),
          api.get("/terms"),
        ]);
        setStudents(studentRes.data);
        setClasses(classRes.data);
        setSessions(sessionRes.data);
        setTerms(termRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        enrollmentId: selectedEnrollment,
        newClassId: targetClass,
        newArmId: targetArm,
        newSessionId: targetSession,
        newTermId: targetTerm,
      };

      if (isPromote) {
        await api.post("/students/promote", payload);
        alert("Student promoted!");
      } else {
        await api.post("/students/repeat", payload);
        alert("Student set to repeat!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed action");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Promote/Repeat Student</h2>

      <select
        value={selectedEnrollment}
        onChange={(e) => setSelectedEnrollment(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="">-- Select Student --</option>
        {students.map((en) => (
          <option key={en._id} value={en._id}>
            {en.studentId?.name} ({en.classId?.name} - {en.armId?.name})
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <select
          value={targetClass}
          onChange={(e) => setTargetClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Class --</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {targetClass && (
          <select
            value={targetArm}
            onChange={(e) => setTargetArm(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Select Arm --</option>
            {classes.find((c) => c._id === targetClass)?.arms.map((arm) => (
              <option key={arm._id} value={arm._id}>
                {arm.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={targetSession}
          onChange={(e) => setTargetSession(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Session --</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={targetTerm}
          onChange={(e) => setTargetTerm(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Term --</option>
          {terms.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => {
            setIsPromote(true);
            handleSubmit();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Promote
        </button>
        <button
          onClick={() => {
            setIsPromote(false);
            handleSubmit();
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Repeat
        </button>
      </div>
    </div>
  );
}
