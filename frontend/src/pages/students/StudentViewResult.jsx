import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";


const StudentViewResult = () => {
  const { user } = useAuth();
  const [studentInfo, setStudentInfo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingResult, setFetchingResult] = useState(false);
  const [classSize, setClassSize] = useState(0);
  const [attendance, setAttendance] = useState(null);
  const [classTeacher, setClassTeacher] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [allTermResults, setAllTermResults] = useState({});

  // Fetch student enrollment details
  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!user?._id) return;

      try {
        setError("");
        const res = await api.get(`/students?studentId=${user._id}`);
        if (res.data && res.data.length > 0) {
          setStudentInfo(res.data[0]);
        } else {
          setError("Student enrollment record not found.");
        }
      } catch (err) {
        console.error("Error fetching student info:", err);
        setError("Could not load student information. Please contact admin.");
      }
    };

    fetchStudentInfo();
  }, [user]);

  // Fetch class teacher dynamically
  useEffect(() => {
    const fetchClassTeacher = async () => {
      if (!studentInfo?.classId?._id || !studentInfo?.armId?._id) return;

      try {
        const res = await api.get(`/class-teachers/${studentInfo.classId._id}/${studentInfo.armId._id}`);
        setClassTeacher(res.data.teacher);
        
      } catch (err) {
        console.error("Error fetching class teacher:", err);
        setClassTeacher({ name: "N/A" });
      }
    };

    fetchClassTeacher();
  }, [studentInfo]);

  // Fetch principal dynamically
  useEffect(() => {
    const fetchPrincipal = async () => {

      try {
        const res = await api.get('/principals');

        const principalData = Array.isArray(res.data) 
          ? res.data[0] 
          : res.data;

        setPrincipal(principalData || { name: "N/A" });
        // console.log("Principal data:", principalData);
      } catch (err) {
        console.error("Error fetching principal:", err);
        setPrincipal({ name: "N/A" });
      }
    };

    fetchPrincipal();
  }, []);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Could not load academic sessions.");
      }
    };
    fetchSessions();
  }, []);

  // Fetch class size
  useEffect(() => {
    const fetchClassSize = async () => {
      if (studentInfo?.classId?._id && studentInfo?.armId?._id && sessionId && termId) {
        try {
          const res = await api.get('/students', {
            params: {
              classId: studentInfo.classId._id,
              armId: studentInfo.armId._id,
              sessionId,
              termId,
            },
          });
          setClassSize(res.data.length || 0);
        } catch (err) {
          console.error("Error fetching class size:", err);
          setError("Could not load class size information.");
          setClassSize(0);
        }
      }
    };
    fetchClassSize();
  }, [studentInfo, sessionId, termId]);

  const handleSessionChange = (e) => {
    const selected = sessions.find((s) => s._id === e.target.value);
    setSelectedSession(selected || null);
    setSelectedTerm(null);
    setSessionId(selected?._id || "");
    setTermId("");
    setError("");
    setAttendance(null);
    setAllTermResults({});
  };

  const handleTermChange = (e) => {
    const selected = selectedSession?.terms.find((t) => t._id === e.target.value);
    setSelectedTerm(selected || null);
    setTermId(selected?._id || "");
    setError("");
    setAttendance(null);
  };

  // Fetch results for all terms when 3rd term is selected
  const fetchAllTermResults = async (sessionId, studentId) => {
    try {
      const terms = selectedSession?.terms || [];
      const resultsByTerm = {};
      
      for (const term of terms) {
        const resultResponse = await api.get("/results/student-term", {
          params: {
            userId: studentId,
            sessionId: sessionId,
            termId: term._id,
          },
        });

        if (resultResponse.data.success) {
          resultsByTerm[term._id] = {
            termName: term.name,
            results: resultResponse.data.results || [],
            termAverage: resultResponse.data.termAverage || 0,
            comments: resultResponse.data.comments || {}
          };
        }
      }
      
      return resultsByTerm;
    } catch (err) {
      console.error("Error fetching all term results:", err);
      return {};
    }
  };

  // Function to calculate grade based on score
  const calculateGrade = (score) => {
    if (score >= 75) return "A1";
    if (score >= 70) return "B2";
    if (score >= 65) return "B3";
    if (score >= 60) return "C4";
    if (score >= 55) return "C5";
    if (score >= 50) return "C6";
    if (score >= 45) return "D7";
    if (score >= 40) return "E8";
    return "F9";
  };

  // Helper function to calculate cumulative data
  const calculateCumulativeData = (allTermResults) => {
    const terms = Object.values(allTermResults);
    if (terms.length === 0) return { 
      subjectTotals: {}, 
      cumulativeAverages: {}, 
      termScores: {}, 
      overallCumulativeAverage: 0, 
      cumulativeGrades: {},
      cumulativeMarkObtained: 0,
      cumulativeMaxMarkObtainable: 0
    };

    // Get all unique subjects across all terms
    const allSubjects = new Set();
    terms.forEach(term => {
      term.results.forEach(result => {
        if (result.subject) {
          allSubjects.add(result.subject);
        }
      });
    });

    const subjectTotals = {};
    const subjectCounts = {};
    const cumulativeAverages = {};
    const cumulativeGrades = {};
    const termScores = {
      'First Term': {},
      'Second Term': {},
      'Third Term': {},
      '1st Term': {},
      '2nd Term': {}, 
      '3rd Term': {}
    };

    // Initialize subject totals and counts
    Array.from(allSubjects).forEach(subject => {
      subjectTotals[subject] = 0;
      subjectCounts[subject] = 0;
    });

    // Calculate totals and counts for each subject, and store term scores
    let cumulativeMarkObtained = 0;
    let cumulativeMaxMarkObtainable = 0;

    terms.forEach(term => {
      const termName = term.termName;
      term.results.forEach(result => {
        if (result.subject && result.total !== undefined) {
          subjectTotals[result.subject] += result.total;
          subjectCounts[result.subject]++;
          termScores[termName][result.subject] = result.total;
          
          // Add to cumulative marks
          cumulativeMarkObtained += result.total;
          cumulativeMaxMarkObtainable += 100; // Each subject has max 100 marks per term
        }
      });
    });

    // Calculate cumulative averages and grades for each subject
    let totalCumulativeAverage = 0;
    let subjectCount = 0;
    
    Array.from(allSubjects).forEach(subject => {
      if (subjectCounts[subject] > 0) {
        const average = subjectTotals[subject] / subjectCounts[subject];
        cumulativeAverages[subject] = average.toFixed(1);
        cumulativeGrades[subject] = calculateGrade(average);
        totalCumulativeAverage += average;
        subjectCount++;
      }
    });

    // Calculate overall cumulative average
    const overallCumulativeAverage = subjectCount > 0 ? (totalCumulativeAverage / subjectCount) : 0;

    return { 
      subjectTotals, 
      cumulativeAverages, 
      termScores, 
      overallCumulativeAverage, 
      cumulativeGrades,
      cumulativeMarkObtained,
      cumulativeMaxMarkObtainable
    };
  };

  const fetchResult = async () => {
    if (!sessionId || !termId) {
      setError("Please select both Session and Term.");
      return;
    }
    if (!studentInfo) {
      setError("Student information not loaded.");
      return;
    }

    setError("");
    setFetchingResult(true);

    try {
      let allTermData = {};
      
      // If 3rd term is selected, fetch results for all terms
      if (selectedTerm?.name?.toLowerCase().includes('third') || selectedTerm?.name?.toLowerCase().includes('3')) {
        allTermData = await fetchAllTermResults(sessionId, user._id);
        setAllTermResults(allTermData);
      }

      // Fetch current term results
      const resultResponse = await api.get("/results/student-term", {
        params: {
          userId: user._id,
          sessionId,
          termId,
        },
      });

      // Fetch attendance
      const attendanceResponse = await api.get("/attendance/student", {
        params: {
          studentId: user._id,
          sessionId,
          termId,
        },
      });

      if (resultResponse.data.success) {
        const resultData = {
          student: studentInfo,
          results: resultResponse.data.results || [],
          termAverage: resultResponse.data.termAverage || 0,
          session: selectedSession?.name || "",
          term: selectedTerm?.name || "",
          comments: {
            classTeacher: resultResponse.data.comments?.classTeacher || "N/A",
            principal: resultResponse.data.comments?.principal || "N/A",
          },
          attendance: attendanceResponse.data.records || [],
          classTeacher: classTeacher || { name: "N/A" },
          allTermResults: allTermData,
          isThirdTerm: selectedTerm?.name?.toLowerCase().includes('third') || selectedTerm?.name?.toLowerCase().includes('3')
        };

        const newWindow = window.open("", "_blank", "width=1200,height=800");
        if (newWindow) {
          newWindow.document.write(generateReportHTML(resultData));
          newWindow.document.close();
        } else {
          setError("Please allow popups to view your result.");
        }
      } else {
        setError(resultResponse.data.message || "No results found for selected session and term.");
      }

      setAttendance(attendanceResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      const errorMsg = err.response?.data?.error || "Failed to fetch data. Please try again.";
      setError(errorMsg);
    } finally {
      setFetchingResult(false);
    }
  };

  const generateReportHTML = (data) => {
    const { 
      student, 
      results, 
      termAverage, 
      session, 
      term, 
      comments, 
      attendance, 
      classTeacher,
      allTermResults,
      isThirdTerm
    } = data;
    
    const today = new Date().toLocaleDateString("en-GB");
    const schoolLogo = "/blog.jpg";
    const studentImage = student?.studentId?.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    // Calculate current term marks
    const currentMarkObtained = results.reduce((sum, r) => sum + (r.total || 0), 0);
    const currentMaxMark = results.length * 100;
    
    // Calculate cumulative data if it's third term
    const { 
      subjectTotals, 
      cumulativeAverages, 
      termScores, 
      overallCumulativeAverage, 
      cumulativeGrades,
      cumulativeMarkObtained,
      cumulativeMaxMarkObtainable
    } = isThirdTerm ? calculateCumulativeData(allTermResults) : { 
      subjectTotals: {}, 
      cumulativeAverages: {}, 
      termScores: {}, 
      overallCumulativeAverage: 0, 
      cumulativeGrades: {},
      cumulativeMarkObtained: 0,
      cumulativeMaxMarkObtainable: 0
    };

    // For 3rd term, use cumulative average; for other terms, use term average
    const displayAverage = isThirdTerm ? overallCumulativeAverage : termAverage;
    const gpa = (displayAverage / 100 * 5).toFixed(1);
    const overallGrade = calculateGrade(displayAverage);
    
    // For 3rd term, use cumulative marks; for other terms, use current term marks
    const displayMarkObtained = isThirdTerm ? cumulativeMarkObtained : currentMarkObtained;
    const displayMaxMark = isThirdTerm ? cumulativeMaxMarkObtainable : currentMaxMark;
    
    const portalId = student?.studentId?.admissionNumber || "6261";
    const noInClass = classSize;

    // Extract attendance data
    const attendanceRecord = attendance.length > 0 ? attendance[0] : null;
    const timesPresent = attendanceRecord ? attendanceRecord.timesPresent || 0 : 0;
    const timesOpened = attendanceRecord ? attendanceRecord.timesOpened || 0 : 0;
    const timeAbsent = timesOpened - timesPresent;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${student?.studentId?.name || "Student"} - ${term} Result ${session}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Arial', sans-serif;
              background: #e6f0fa;
              color: #333;
              line-height: 1.5;
              font-size: ${isThirdTerm ? '7pt' : '10pt'};
            }
            .container {
              width: ${isThirdTerm ? '290mm' : '210mm'};
              min-height: 297mm;
              margin: 10mm auto;
              padding: 12mm 15mm;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              position: relative;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 8mm;
              padding: 5mm;
              background: linear-gradient(to bottom, #4a90e2, #357abd);
              color: white;
              border-radius: 10px 10px 0 0;
            }
            .logo-container {
              flex: 0 0 auto;
              margin-right: 5mm;
            }
            .logo { 
              width: 25mm; 
              height: 25mm; 
              border-radius: 50%; 
              border: 2px solid white; 
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .header-text {
              flex: 1;
              text-align: left;
            }
            .school-name {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 1mm;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            .school-address, .school-contact { 
              font-size: 8pt; 
              color: #e6f0fa; 
              margin: 1mm 0;
            }
            .report-title { 
              font-size: 12pt; 
              font-weight: bold;
              margin-top: 2mm;
            }
            .student-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8mm;
              font-size: 9pt;
              background: #e6f0fa;
              padding: 5mm;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .info-left, .info-right {
              width: 38%;
              padding: 0 5mm;
            }
            .student-photo-container {
              text-align: center;
              width: 24%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .student-photo {
              width: 35mm; 
              height: 40mm;
              border-radius: 50%;
              border: 3px solid #4a90e2;
              object-fit: cover;
              box-shadow: 0 4px 15px rgba(74, 144, 226, 0.2);
            }
            .info p { 
              margin: 2mm 0; 
              padding: 1mm;
              border-bottom: 1px dotted #ccc;
            }
            .info strong { 
              color: #4a90e2; 
            }
            .cumulative-indicator {
              background: #f0fff0;
              padding: 2mm;
              border-radius: 4px;
              border-left: 3px solid #28a745;
              font-weight: bold;
              color: #28a745;
              font-size: 7pt;
              margin-left: 2mm;
            }
            .marks-indicator {
              color: #28a745;
              font-size: 7pt;
              font-weight: bold;
              margin-left: 2mm;
            }
            .grading-key {
              margin-bottom: 8mm;
              padding: 5mm;
              background: #e6f0fa;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .key-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 7pt;
            }
            .key-table th, .key-table td {
              border: 1px solid #4a90e2;
              padding: 2mm;
              text-align: center;
            }
            .key-table th {
              background: #4a90e2;
              color: white;
            }
            .key-table tbody tr:nth-child(even) {
              background: #f0f8ff;
            }
            table.results {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8mm;
              font-size: ${isThirdTerm ? '7pt' : '8pt'};
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
              border-radius: 8px;
              overflow: hidden;
            }
            table.results th, table.results td {
              border: 1px solid #ccc;
              padding: ${isThirdTerm ? '2mm 1mm' : '3mm 2mm'};
              text-align: center;
            }
            table.results th {
              background: linear-gradient(to bottom, #4a90e2, #357abd);
              color: white;
              font-weight: bold;
            }
            table.results td.subject {
              text-align: left;
              padding-left: 4mm;
            }
            table.results tbody tr:nth-child(even) {
              background: #f0f8ff;
            }
            table.results tbody tr:hover {
              background: #e6f0fa;
            }
            .fail td {
              color: red !important;
            }
            .cumulative-column {
              background: #f0fff0 !important;
              font-weight: bold;
            }
            .cumulative-grade {
              background: #f0fff0 !important;
              font-weight: bold;
              color: #28a745;
            }
            .comments {
              margin-bottom: 8mm;
              font-size: 9pt;
              padding: 5mm;
              background: #e6f0fa;
              border-radius: 8px;
              border-left: 5px solid #4a90e2;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .comment-box {
              margin-bottom: 3mm;
            }
            .comment-title { 
              font-weight: bold; 
              color: #4a90e2; 
              margin-bottom: 2mm;
              border-bottom: 1px solid #4a90e2;
            }
            .comments p {
              font-style: italic;
            }
            .signature {
              text-align: right;
              font-size: 9pt;
              margin-top: 10mm;
            }
            .signature-line {
              width: 50mm;
              border-top: 2px solid #4a90e2;
              margin: 3mm 0;
            }
            .print-btn {
              display: block;
              margin: 10mm auto;
              padding: 3mm 8mm;
              background: linear-gradient(to bottom, #4a90e2, #357abd);
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 10pt;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .print-btn:hover {
              background: #357abd;
            }
            @media print {
              body { background: white; }
              .container { 
                margin: 0;
                padding: 10mm;
                box-shadow: none;
              }
              .print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="${schoolLogo}" class="logo" alt="School Logo" />
              </div>
              <div class="header-text">
                <div class="school-name">MOONLIGHT COLLEGE</div>
                <div class="school-address">7, WOWO STREET, OFF TOLU ROAD, OLODI APAPA LAGOS.</div>
                <div class="school-contact">Phone: 08175967507, 08062961916 | Email: moonlightschools02@gmail.com</div>
                <div class="report-title">TERM REPORT SHEET ${isThirdTerm ? '- CUMULATIVE RESULTS' : ''}</div>
              </div>
            </div>

            <div class="student-info">
              <div class="info-left">
                <p><strong>Portal ID:</strong> ${portalId}</p>
                <p><strong>Name:</strong> ${student?.studentId?.name || "N/A"}</p>
                <p><strong>Class:</strong> ${student?.classId?.name || "N/A"} - ${student?.armId?.name || ""}</p>
                <p><strong>Gender / DOB:</strong> ${student?.studentId?.gender || "N/A"} / ${student?.studentId?.dateOfBirth ? new Date(student.studentId.dateOfBirth).toLocaleDateString("en-GB") : "N/A"}</p>
                <p><strong>Term:</strong> ${term}</p>
                <p><strong>Year:</strong> ${session}</p>
              </div>
              <div class="student-photo-container">
                <img src="${studentImage}" alt="Student Photo" class="student-photo" />
              </div>
              <div class="info-right">
                <p><strong>No. in class:</strong> ${noInClass}</p>
                <p><strong>Attendance:</strong> Present ${timesPresent}/Absent ${timeAbsent}</p>
                <p>
                  <strong>Cumulative | GPA:</strong> 
                  ${displayAverage.toFixed(1)}% 
                  <strong> | ${gpa} </strong>
                </p>
                <p>
                  <strong>Grade:</strong> ${overallGrade}
                </p>
                <p>
                  <strong>Max Mark Obtainable:</strong> ${displayMaxMark}
                </p>
                <p>
                  <strong>Mark Obtained:</strong> ${displayMarkObtained}
                </p>
              </div>
            </div>

            <div class="grading-key">
              <table class="key-table">
                <thead>
                  <tr>
                    <th>KEY</th>
                    <th>A1</th>
                    <th>B2</th>
                    <th>B3</th>
                    <th>C4</th>
                    <th>C5</th>
                    <th>C6</th>
                    <th>D7</th>
                    <th>E8</th>
                    <th>E8</th>
                    <th>F9</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>75 - 100</td>
                    <td>71 - 74</td>
                    <td>65 - 70</td>
                    <td>61 - 64</td>
                    <td>55 - 60</td>
                    <td>50 - 54</td>
                    <td>45 - 49</td>
                    <td>41 - 44</td>
                    <td>40 - 44</td>
                    <td>0 - 39</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table class="results">
              <thead>
                <tr>
                  <th>SUBJECT LIST</th>
                  <th>CA1(10)</th>
                  <th>CA2(10)</th>
                  <th>NOTE(10)</th>
                  <th>CA3(10)</th>
                  <th>EXAM(60)</th>
                  <th>TOTAL</th>
                  <th>SUBJECT <br> AVERAGE</th>
                  ${isThirdTerm ? `
                    <th>1ST TERM</th>
                    <th>2ND TERM</th>
                    <th>3RD TERM</th>
                    <th>CUMULATIVE <br> TOTAL</th>
                    <th>CUMULATIVE <br> AVERAGE</th>
                    ` : ''}
                    <th>GRADE</th>
                </tr>
              </thead>
              <tbody>
                ${results.length > 0 
                  ? results
                      .map((r) => {
                        const subject = r.subject;
                        const firstTermScore = isThirdTerm ? (termScores['First Term']?.[subject] || termScores['1st Term']?.[subject] || '-') : '';
                        const secondTermScore = isThirdTerm ? (termScores['Second Term']?.[subject] || termScores['2nd Term']?.[subject] || '-') : '';
                        const thirdTermScore = isThirdTerm ? (termScores['Third Term']?.[subject] || termScores['3rd Term']?.[subject] || '-') : '';
                        const cumulativeTotal = isThirdTerm ? (subjectTotals[subject] || 0) : '';
                        const cumulativeAverage = isThirdTerm ? (cumulativeAverages[subject] || 0) : '';
                        
                        // GRADE CALCULATION LOGIC:
                        // For 1st/2nd term: Show grade from current term only
                        // For 3rd term: Show grade calculated from cumulative average of all three terms
                        const displayGrade = isThirdTerm 
                          ? (cumulativeGrades[subject] || calculateGrade(r.total || 0)) 
                          : (r.grade || calculateGrade(r.total || 0));
                        
                        const isFail = displayGrade === 'F9';
                        
                        return `
                          <tr class="${isFail ? 'fail' : ''}">
                            <td class="subject">${subject}</td>
                            <td>${r.ca1 || 0}</td>
                            <td>${r.ca2 || 0}</td>
                            <td>${r.ca3 || 0}</td>
                            <td>${r.ca4 || 0}</td>
                            <td>${r.exam || 0}</td>
                            <td><strong>${r.total || 0}</strong></td>
                            <td>${((r.total || 0) / 100 * 100).toFixed(1)}%</td>
                            ${isThirdTerm ? `
                              <td>${firstTermScore}</td>
                              <td>${secondTermScore}</td>
                              <td>${thirdTermScore}</td>
                              <td class="cumulative-column">${cumulativeTotal}</td>
                              <td class="cumulative-column">${cumulativeAverage}%</td>
                            ` : ''}
                            <td class="${isThirdTerm ? 'cumulative-grade' : ''}">
                              <strong>${displayGrade}</strong>
                            </td>
                          </tr>
                        `;
                      })
                      .join("")
                  : `<tr><td colspan="${isThirdTerm ? '14' : '9'}" style="text-align: center; color: #666;">No results available</td></tr>`
                }
              </tbody>
            </table>

            <div class="comments">
              <div class="comment-box">
                <div class="comment-title">Class Teacher's Comment</div>
                <p>${comments.classTeacher}</p>
              </div>
              <div class="comment-box">
                <div class="comment-title">Principal's Remark</div>
                <p>${comments.principal}</p>
              </div>
            </div>

            <div class="signatures" style="display: flex; justify-content: space-between; margin-top: 10mm; font-size: 9pt;">
              <div class="class-teacher" style="text-align: left;">
                <img src="${classTeacher?.signature}" alt="Class Teacher Signature" 
                    style="width: 40mm; height: 15mm; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.2); margin-bottom: 2mm;" 
                />
                <div class="signature-line" style="width: 60mm; border-top: 2px solid #4a90e2; margin-bottom: 2mm;"></div>
                <p><strong>${classTeacher?.name}<br>Class Teacher</strong></p>
              </div>
              <div class="principal" style="text-align: right;">
                <img src="${principal?.signature}" alt="Principal Signature" 
                    style="width: 40mm; height: 15mm; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.2); margin-bottom: 2mm;" 
                />
                <div class="signature-line" style="width: 60mm; border-top: 2px solid #4a90e2; margin-bottom: 2mm;"></div>
                <p><strong>${principal?.name} (Mr)<br>Principal</Strong></p>
              </div>
            </div>

            <button class="print-btn" onclick="window.print()">Print Report</button>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          View Term Result
        </h2>

        {studentInfo ? (
          <>
            <div className="text-sm text-gray-700 mb-4">
              <p><strong>Name:</strong> {studentInfo.studentId?.name}</p>
              <p><strong>Class:</strong> {studentInfo.classId?.name} - {studentInfo.armId?.name}</p>
              {classTeacher && <p><strong>Class Teacher:</strong> {classTeacher.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session</label>
                <select
                  onChange={handleSessionChange}
                  value={sessionId}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Term</label>
                <select
                  onChange={handleTermChange}
                  value={termId}
                  disabled={!selectedSession}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Term</option>
                  {(selectedSession?.terms || []).map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={fetchResult}
              disabled={fetchingResult || !sessionId || !termId}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 
                        disabled:bg-green-300 cursor-not-allowed"
            >
              {fetchingResult ? "Loading..." : "Fetch Result"}
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center">Loading student info...</p>
        )}

        {error && (
          <p className="text-red-500 text-center mt-4 bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentViewResult;