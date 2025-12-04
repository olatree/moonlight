import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
// import UsersPage from "./pages/admin/Users";
import HomePage from "./pages/HomePage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import SessionsPage from "./pages/admin/SessionPage";
import ClassesPage from "./pages/admin/ClassesPage";
import AdminManagement from "./pages/admin/AdminManagement";
import PrincipalManagement from "./pages/admin/PrincipalManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import SubjectAssignment from "./pages/admin/SubjectAssignment";
import TeacherAssignment from "./pages/admin/TeacherAssignment";
import ClassTeacherAssignment from "./pages/admin/ClassTeacherAssignment";
import ViewClassTeachers from "./pages/admin/ViewClassTeachers";
import RegisterStudent from "./pages/admin/RegisterStudent";
import ViewStudents from "./pages/admin/ViewStudents";
import StudentManagement from "./pages/admin/StudentManagement";
import ResultEnteryPage from "./pages/admin/ResultEnteryPage";
import AttendanceManagement from "./pages/admin/ManageAttendance";
import ViewResultPage from "./pages/admin/ViewResultPage";
import ViewResultByClass from "./pages/admin/ViewResultByClass";
import StudentLogin from "./pages/StudentLogin";
import StudentLayout from "./layouts/StudentLayout";
import StudentViewResult from "./pages/students/StudentViewResult"
import PrincipalComments from "./pages/admin/PrincipalComments";
import TeacherComments from "./pages/admin/TeacherComments";

export default function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-login" element={<StudentLogin />} />

        {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard: accessible to all logged-in roles */}
          <Route index element={<Dashboard />} />

          {/* Users page: only admin + super_admin */}
          <Route
            element={<RoleProtectedRoute allowedRoles={['admin','super_admin', 'master_admin']} />}
          >
            {/* <Route path="users" element={<UsersPage />} /> */}
          </Route>

          {/* Example: Sessions page: only super_admin */}
          <Route
            element={<RoleProtectedRoute allowedRoles={['master_admin', 'super_admin', 'admin', 'principal', 'teacher']} />}
          >
            <Route path="sessions" element={ <SessionsPage /> }/>
            <Route path="classes" element={ <ClassesPage /> }/>
            <Route path="admins" element={ <AdminManagement /> }/>
            <Route path="principals" element={< PrincipalManagement />}/>
            <Route path="teachers" element={ <TeacherManagement /> }/>
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="assign-subject-class" element={<SubjectAssignment />} />
            <Route path="assign-teacher-subjects" element={<TeacherAssignment />} />
            <Route path="assign-class-teachers" element={<ClassTeacherAssignment />} />
            <Route path="view-class-teachers" element={<ViewClassTeachers />} />
            <Route path="add-student" element={<RegisterStudent />} />
            <Route path="view-students" element={<ViewStudents /> } />
            <Route path="manage-students" element={<StudentManagement /> } />
            <Route path="enter-results" element={<ResultEnteryPage /> } />
            <Route path="attendance" element={<AttendanceManagement /> } />
            <Route path="enter-comments" element={<PrincipalComments />} />
            <Route path="teacher-comments" element={<TeacherComments />} />
            <Route path="view-results" element={<ViewResultPage /> } />
            <Route path="view-results-by-class" element={<ViewResultByClass /> } />
          </Route>
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="result" element={<StudentViewResult />} />
        </Route>
      </Route>

    </Routes>
  );
}
