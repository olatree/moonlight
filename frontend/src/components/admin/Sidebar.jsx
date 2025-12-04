// import { NavLink } from "react-router-dom";
// import { Home, Users, BookOpen, ClipboardList, Calendar, Settings, Users2 } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { FaBookOpen } from "react-icons/fa";

// export default function Sidebar({ isOpen, onClose }) {
//   const { user } = useAuth();

//   const menuByRole = {
//     teacher: [
//       { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
//       { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
//       { to: "/admin/subjects", label: "My Subjects", icon: <ClipboardList size={18} /> },
//     ],
//     "class_teacher": [
//       { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
//       { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
//       { to: "/admin/attendance", label: "Attendance", icon: <Calendar size={18} /> },
//     ],
//     principal: [
//       { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
//       { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
//       { to: "/admin/attendance", label: "Attendance", icon: <Calendar size={18} /> },
//       { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
//       { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={18} /> },
//     ],
//     admin: [
//       { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
//       { to: "/admin/classes", label: "Manage Classes", icon: <ClipboardList size={18} /> },
//       { to: "/admin/subjects", label: "Manage Subjects", icon: <BookOpen size={18} /> },
//       { to: "/admin/assign-subject-class", label: "Assign Subject To Class", icon: <FaBookOpen size={18} /> },
//       { to: "/admin/assign-teacher-subjects", label: "Assign Subject To Teachers", icon: <FaBookOpen size={18} /> },
//       { to: "/admin/students", label: "Manage Students", icon: <Users size={18} /> },
//       { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={18} /> },
//       { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
//     ],
//     "super_admin": [
//       { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
//       { to: "/admin/sessions", label: "Manage Sessions", icon: <Settings size={18} /> },
//       { to: "/admin/classes", label: "Manage Classes", icon: <ClipboardList size={18} /> },
//       { to: "/admin/subjects", label: "Manage Subjects", icon: <BookOpen size={18} /> },
//       { to: "/admin/assign-subject-class", label: "Assign Subject To Class", icon: <FaBookOpen size={18} /> },
//       { to: "/admin/assign-teacher-subjects", label: "Assign Subject To Teachers", icon: <FaBookOpen size={18} /> },
//       { to: "/admin/assign-class-teachers", label: "Assign Class Teacher", icon: <Users2 size={18} /> },            
//       { to: "/admin/students", label: "Manage Students", icon: <Users size={18} /> },
//       { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={18} /> },
//       { to: "/admin/admins", label: "Manage Admins", icon: <Users size={18} /> },
//       { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
//       { to: "/admin/block-students", label: "Block Students", icon: <Settings size={18} /> },
//     ],
//   };

//   const navItems = menuByRole[user?.role] || [];

//   return (
//     <>
//       {/* Overlay for mobile */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={onClose}
//       ></div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col z-50 transform transition-transform
//           ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
//       >
//         <div className="p-4 border-b flex items-center justify-between md:justify-center">
//           <h1 className="text-xl font-bold text-green-600">School Admin</h1>
//           {/* Close button for mobile */}
//           <button className="md:hidden text-gray-600" onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end
//               onClick={onClose} // close sidebar on mobile when clicking a link
//               className={({ isActive }) =>
//                 `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-green-100 text-green-700 font-medium"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`
//               }
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }


import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  Settings,
  ChevronDown,
  Settings2,
  HomeIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { FaBookOpen } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [teacherOpen, setTeacherOpen] = useState(false); // collapse state
  const [studentOpen, setStudentOpen] = useState(false); // collapse state
  const [resultOpen, setResultOpen] = useState(false); // collapse state

  const menuByRole = {
    teacher: [
      // { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
      // { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
      // { to: "/admin/subjects", label: "My Subjects", icon: <ClipboardList size={18} /> },
    ],
    class_teacher: [
      { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
      { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
      { to: "/admin/attendance", label: "Attendance", icon: <Calendar size={18} /> },
    ],
    principal: [
      // { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
      // { to: "/admin/scores", label: "Record Scores", icon: <BookOpen size={18} /> },
      // { to: "/admin/attendance", label: "Attendance", icon: <Calendar size={18} /> },
      // { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
      // { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={18} /> },
    ],
    admin: [
      { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
      { to: "/admin/classes", label: "Manage Classes", icon: <ClipboardList size={18} /> },
      { to: "/admin/subjects", label: "Manage Subjects", icon: <BookOpen size={18} /> },
      { to: "/admin/assign-subject-class", label: "Assign Subject To Class", icon: <FaBookOpen size={18} /> },
      { to: "/admin/students", label: "Manage Students", icon: <Users size={18} /> },
      { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
    ],
    super_admin: [
      // { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
      // { to: "/admin/sessions", label: "Manage Sessions", icon: <Settings size={18} /> },
      // { to: "/admin/classes", label: "Manage Classes", icon: <ClipboardList size={18} /> },
      // { to: "/admin/subjects", label: "Manage Subjects", icon: <BookOpen size={18} /> },
      // { to: "/admin/assign-subject-class", label: "Assign Subject To Class", icon: <FaBookOpen size={18} /> },
      // { to: "/admin/students", label: "Manage Students", icon: <Users size={18} /> },
      // { to: "/admin/admins", label: "Manage Admins", icon: <Users size={18} /> },
      // { to: "/admin/results", label: "Publish Results", icon: <ClipboardList size={18} /> },
      // { to: "/admin/block-students", label: "Block Students", icon: <Settings size={18} /> },
      // { to: "/admin/teachers", label: "Manage Teachers", icon: <Users size={18} /> },
    ],
  };

  const navItems = menuByRole[user?.role] || [];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col z-50 transform transition-transform
    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
>
  {/* Header */}
  <div className="p-4 border-b flex items-center justify-between md:justify-center flex-shrink-0">
    <h1 className="text-xl font-bold text-green-600">School Admin</h1>
    <button className="md:hidden text-gray-600" onClick={onClose}>
      ✕
    </button>
  </div>

  {/* Nav container with scroll */}
  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isActive
              ? "bg-green-100 text-green-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {item.icon}
        <span>{item.label}</span>
      </NavLink>
    ))}

    {/* TEACHERS COLLAPSIBLE */}
    {(user?.role === "admin" || user?.role === "super_admin" || user?.role === "master_admin") && (
      <div>
        <NavLink
              to="/admin/"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-white text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <HomeIcon size={18} />
                Dashboard
              </span>
        </NavLink>

        <NavLink
              to="/admin/sessions"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Settings size={18} />
                Manage Session
              </span>
        </NavLink>

        <NavLink
              to="/admin/classes"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <ClipboardList size={18} />
                Manage Classes
              </span>
        </NavLink>

        <NavLink
              to="/admin/subjects"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <BookOpen size={18} />
                Manage Subjects
              </span>
        </NavLink>

        <NavLink
              to="/admin/assign-subject-class"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <FaBookOpen size={18} />
                Assign Subject To Class
              </span>
        </NavLink>

        <NavLink
              to="/admin/students"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Users size={18} />
                Manage Students
              </span>
        </NavLink>

        <NavLink
              to="/admin/admins"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Users size={18} />
                Manage Admins
              </span>
        </NavLink>

        <NavLink
              to="/admin/principals"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <ClipboardList size={18} />
                Manage Principals
              </span>
        </NavLink>

        <button
          onClick={() => setStudentOpen(!studentOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Student Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              studentOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {studentOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            <NavLink
              to="/admin/add-student"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Register New Student
            </NavLink>

            <NavLink
              to="/admin/view-students"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Students
            </NavLink>

            <NavLink
              to="/admin/manage-students"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Manage Students
            </NavLink>
          </div>
        )}

        <button
          onClick={() => setTeacherOpen(!teacherOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Teacher Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              teacherOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {teacherOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            <NavLink
              to="/admin/teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Manage Teachers
            </NavLink>

            <NavLink
              to="/admin/assign-teacher-subjects"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Assign Subjects
            </NavLink>

            <NavLink
              to="/admin/assign-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Assign Class Teachers
            </NavLink>

            <NavLink
              to="/admin/view-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Class Teachers
            </NavLink>
          </div>
        )}

        <button
          onClick={() => setResultOpen(!resultOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Result Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              resultOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {resultOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            <NavLink
              to="/admin/enter-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Enter Result
            </NavLink>

            <NavLink
              to="/admin/attendance"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Attendance Management
            </NavLink>

            <NavLink
              to="/admin/enter-comments"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Principal Comments
            </NavLink>

            <NavLink
              to="/admin/teacher-comments"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Teacher Comments
            </NavLink>

            <NavLink
              to="/admin/view-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Results By Subject
            </NavLink>

            <NavLink
              to="/admin/view-results-by-class"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Result By Class
            </NavLink>

            {/* <NavLink
              to="/admin/view-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Class Teachers
            </NavLink> */}
          </div>
        )}
      </div>
    )}

    {/* PRINCIPAL COLLAPSIBLE */}
    {(user?.role === "principal") && (
      <div>
        <NavLink
              to="/admin/"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-white text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <HomeIcon size={18} />
                Dashboard
              </span>
        </NavLink>

        <NavLink
              to="/admin/subjects"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <BookOpen size={18} />
                Manage Subjects
              </span>
        </NavLink>

        <NavLink
              to="/admin/assign-subject-class"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <FaBookOpen size={18} />
                Assign Subject To Class
              </span>
        </NavLink>

        <button
          onClick={() => setTeacherOpen(!teacherOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Teacher Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              teacherOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {teacherOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            

            <NavLink
              to="/admin/assign-teacher-subjects"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Assign Subjects
            </NavLink>

            <NavLink
              to="/admin/assign-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Assign Class Teachers
            </NavLink>

            <NavLink
              to="/admin/view-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Class Teachers
            </NavLink>
          </div>
        )}

        <button
          onClick={() => setResultOpen(!resultOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Result Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              resultOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {resultOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            <NavLink
              to="/admin/enter-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Enter Result
            </NavLink>

            <NavLink
              to="/admin/attendance"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Attendance Management
            </NavLink>

            <NavLink
              to="/admin/enter-comments"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Principal Comments
            </NavLink>

            <NavLink
              to="/admin/teacher-comments"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Teacher Comments
            </NavLink>

            <NavLink
              to="/admin/view-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Results By Subject
            </NavLink>

            <NavLink
              to="/admin/view-results-by-class"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Result By Class
            </NavLink>

            {/* <NavLink
              to="/admin/view-class-teachers"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Class Teachers
            </NavLink> */}
          </div>
        )}
      </div>
    )}

    {/* TEACHER COLLAPSIBLE */}
    {(user?.role === "teacher") && (
      <div>
        <NavLink
              to="/admin/"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-white text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <HomeIcon size={18} />
                Dashboard
              </span>
        </NavLink>

        <button
          onClick={() => setResultOpen(!resultOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Result Management
          </span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              resultOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {resultOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {/* submenu links */}
            <NavLink
              to="/admin/enter-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Enter Result
            </NavLink>

          {/* Attendance Management: Only for Class Teachers */}
          {user?.isClassTeacher && (
            <NavLink
              to="/admin/attendance"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Attendance Management
            </NavLink>
          )}

        {/* Teacher Comments: Only for Class Teachers */}
        {user?.isClassTeacher && (
            <NavLink
              to="/admin/teacher-comments"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Teacher Comments
            </NavLink>
        )}

            <NavLink
              to="/admin/view-results"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Results By Subject
            </NavLink>

            <NavLink
              to="/admin/view-results-by-class"
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              View Result By Class
            </NavLink>
          </div>
        )}
      </div>
    )}
    
  </nav>
</aside>

    </>
  );
}


