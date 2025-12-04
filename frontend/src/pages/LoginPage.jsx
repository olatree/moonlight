import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// axios.defaults.withCredentials = true;

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();   // ✅ redirect hook
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login
      await api.post("/auth/login", {
        userId: formData.email,
        password: formData.password,
      });

      // 2️⃣ Fetch user
      const { data } = await api.get("/auth/me");
      setUser(data);
      console.log("Logged in user:", data);

      // 3️⃣ Redirect based on user role with specific routes
    const redirectPaths = {
      admin: "/admin",
      super_admin: "/admin",
      master_admin: "/admin",
      teacher: "/admin",
      principal: "/admin",
    };

    const redirectPath = redirectPaths[data.role] || "/dashboard";
    navigate(redirectPath);

      // 3️⃣ Redirect to admin layout
      // navigate("/admin");   // <-- change path to your admin layout route
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          School Login
        </h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter User ID or Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter Password"
          />
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
