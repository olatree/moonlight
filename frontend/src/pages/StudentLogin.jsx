import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/students/login", {
        admissionNumber,
        password,
      });

      // The backend should set the cookie automatically here.
      // Example: res.cookie("studentToken", token, { httpOnly: true })

      // Optionally, store minimal data (not token) in memory or context
      sessionStorage.setItem("studentName", res.data.student.firstName);

      navigate("/student");
      console.log("Student logged in:", res.data.student);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Student Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Admission Number
            </label>
            <input
              type="text"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your admission number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Password (First Name)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your first name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Forgot your password? Contact your school administrator.
        </p>
      </div>
    </div>
  );
}
