// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// axios.defaults.withCredentials = true; // ✅ always send/receive cookies

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch user on mount (restore session from cookie)
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8000/api/auth/me");
//         setUser(data);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMe();
//   }, []);

//   // ✅ Logout function
//   const logout = async () => {
//     try {
//       await axios.post("http://localhost:8000/api/auth/logout"); // backend should clear cookie
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       setUser(null); // clear state anyway
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

// axios.defaults.withCredentials = true; // send cookies always

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'staff' or 'student'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try fetching staff first
        const staffRes = await api.get("/auth/me");
        if (staffRes.data) {
          setUser(staffRes.data);
          // console.log("Staff user data:", staffRes.data);
          setRole("staff");
          setLoading(false);
          return;
        }
      } catch (err) {
        // staff cookie not found → try student
      }

      try {
        const studentRes = await api.get("/students/me");
        if (studentRes.data) {
          setUser(studentRes.data);
          setRole("student");
          setLoading(false);
          return;
        }
      } catch (err) {
        // no student either
      }

      // no one logged in
      setUser(null);
      setRole(null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // ✅ Logout works for both types
  const logout = async () => {
    try {
      if (role === "student") {
        await api.post("/students/logout");
      } else {
        await api.post("/auth/logout");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
