import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleBlock = async (id, isBlocked) => {
    try {
      if (isBlocked) {
        await api.put(`/students/unblock/${id}`);
      } else {
        await api.put(`/students/block/${id}`);
      }
      fetchStudents();
    } catch (err) {
      console.error("Error blocking/unblocking:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Admission No</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Arm</th>
            <th className="p-2 border">Session</th>
            <th className="p-2 border">Term</th>
            <th className="p-2 border">Blocked</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((en) => (
            <tr key={en._id} className="border-t">
              <td className="p-2 border">{en.studentId?.name}</td>
              <td className="p-2 border">{en.studentId?.admissionNumber}</td>
              <td className="p-2 border">{en.classId?.name}</td>
              <td className="p-2 border">{en.armId?.name}</td>
              <td className="p-2 border">{en.sessionId?.name}</td>
              <td className="p-2 border">{en.termId?.name}</td>
              <td className="p-2 border">{en.isBlocked ? "Yes" : "No"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleBlock(en._id, en.isBlocked)}
                  className={`px-3 py-1 rounded ${
                    en.isBlocked
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {en.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
