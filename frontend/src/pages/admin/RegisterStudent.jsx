// import { useState, useEffect } from "react";
// import api from "../../api/axios";

// export default function AddStudent() {
//   const [classes, setClasses] = useState([]);
//   const [activeSessionTerm, setActiveSessionTerm] = useState(null);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     dateOfBirth: "",
//     gender: "",
//     parentContact: "",
//     image: null,
//   });

//   // Load classes (with arms) and active session/term
//   useEffect(() => {
//     api.get("/classes").then((res) => setClasses(res.data));
//     api.get("/sessions/active").then((res) => setActiveSessionTerm(res.data));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setForm((prev) => ({ ...prev, image: files[0] }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!activeSessionTerm) {
//       alert("No active session/term set. Please activate one.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("dateOfBirth", form.dateOfBirth);
//     formData.append("gender", form.gender);
//     formData.append("parentContact", form.parentContact);
//     if (form.image) formData.append("image", form.image);

//     formData.append("classId", selectedClass);
//     formData.append("armId", selectedArm);
//     formData.append("sessionId", activeSessionTerm.session._id);
//     // formData.append("termId", activeSessionTerm.term._id);

//     try {
//       await api.post("/students", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Student registered successfully!");
//       setForm({
//         name: "",
//         dateOfBirth: "",
//         gender: "",
//         parentContact: "",
//         image: null,
//       });
//       setSelectedClass("");
//       setSelectedArm("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to register student");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4">Add New Student</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />

//         {/* Date of Birth */}
//         <input
//           type="date"
//           name="dateOfBirth"
//           value={form.dateOfBirth}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />

//         {/* Gender */}
//         <select
//           name="gender"
//           value={form.gender}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         >
//           <option value="">-- Select Gender --</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>

//         {/* Parent Contact */}
//         <input
//           type="text"
//           name="parentContact"
//           placeholder="Parent Contact"
//           value={form.parentContact}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />

//         {/* Student Image */}
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full"
//         />

//         {/* Class */}
//         <select
//           value={selectedClass}
//           onChange={(e) => {
//             setSelectedClass(e.target.value);
//             setSelectedArm("");
//           }}
//           className="w-full border p-2 rounded"
//           required
//         >
//           <option value="">-- Select Class --</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>
//               {cls.name}
//             </option>
//           ))}
//         </select>

//         {/* Arm */}
//         {selectedClass && (
//           <select
//             value={selectedArm}
//             onChange={(e) => setSelectedArm(e.target.value)}
//             className="w-full border p-2 rounded"
//             required
//           >
//             <option value="">-- Select Arm --</option>
//             {classes
//               .find((cls) => cls._id === selectedClass)
//               ?.arms.map((arm) => (
//                 <option key={arm._id} value={arm._id}>
//                   {arm.name}
//                 </option>
//               ))}
//           </select>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Register Student
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AddStudent() {
  const [classes, setClasses] = useState([]);
  const [activeSessionTerm, setActiveSessionTerm] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    parentContact: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // Bonus UX

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, sessionRes] = await Promise.all([
          api.get("/classes"),
          api.get("/sessions/active"),
        ]);
        setClasses(classesRes.data);
        setActiveSessionTerm(sessionRes.data);
      } catch (err) {
        alert("Failed to load required data. Please refresh.");
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeSessionTerm) {
      alert("No active session found. Please set one in admin panel.");
      return;
    }

    if (!selectedClass || !selectedArm) {
      alert("Please select both Class and Arm.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("dateOfBirth", form.dateOfBirth);
    formData.append("gender", form.gender);
    formData.append("parentContact", form.parentContact.trim());
    formData.append("classId", selectedClass);
    formData.append("armId", selectedArm);
    formData.append("sessionId", activeSessionTerm.session._id);

    if (form.image) {
      formData.append("picture", form.image); // Match backend field name!
    }

    try {
      const res = await api.post("/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`Student registered successfully!\nAdmission No: ${res.data.loginCredentials.admissionNumber}\nPassword: ${res.data.loginCredentials.password}`);

      // Reset everything
      setForm({
        name: "",
        dateOfBirth: "",
        gender: "",
        parentContact: "",
        image: null,
      });
      setSelectedClass("");
      setSelectedArm("");
      setImagePreview(null);

      // Reset file input visually
      if (e.target.image) e.target.image.value = "";

    } catch (err) {
      console.error("Registration error:", err);
      const msg = err.response?.data?.message || "Failed to register student";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedClassObj = classes.find((c) => c._id === selectedClass);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Student</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Parent Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone/Email</label>
          <input
            type="text"
            name="parentContact"
            value={form.parentContact}
            onChange={handleChange}
            placeholder="e.g. 08012345678 or parent@email.com"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo (Optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg border shadow"
              />
            </div>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedArm("");
            }}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Arm */}
        {selectedClass && selectedClassObj?.arms?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arm *</label>
            <select
              value={selectedArm}
              onChange={(e) => setSelectedArm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">-- Select Arm --</option>
              {selectedClassObj.arms.map((arm) => (
                <option key={arm._id} value={arm._id}>
                  {arm.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !activeSessionTerm}
          className={`w-full py-3 rounded-lg text-white font-medium transition ${
            loading || !activeSessionTerm
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering Student..." : "Register Student"}
        </button>
      </form>

      {!activeSessionTerm && (
        <p className="mt-6 text-center text-red-600 text-sm">
          No active session/term. Contact admin.
        </p>
      )}
    </div>
  );
}