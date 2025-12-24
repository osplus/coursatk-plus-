
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Subjects from './pages/Subjects';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import LecturesList from './pages/LecturesList';
import LectureView from './pages/LectureView';
import QuizView from './pages/QuizView';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import { API } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [student, setStudent] = useState<any>(null);
  const [expiryMessage, setExpiryMessage] = useState<string | null>(null);
  const [criticalError, setCriticalError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setStudent(null);
    setCriticalError(null);
  }, []);

  const handleLogin = (studentData: any) => {
    if (studentData) {
      setStudent(studentData);
      setIsAuthenticated(true);
      setExpiryMessage(null);
      setCriticalError(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !student?.code) return;

    const performCheck = async () => {
      const expiryTime = new Date(student.expiryDate).getTime();
      const currentTime = new Date().getTime();

      if (currentTime >= expiryTime) {
        setCriticalError("انتهت صلاحية اشتراكك، يرجى تجديد الكود للمتابعة.");
        return;
      }

      try {
        const status = await API.getStudentStatus(student.code);
        if (!status.exists) {
          setCriticalError("تم إلغاء تفعيل هذا الكود من الإدارة، يرجى مراجعة الدعم.");
        } else if (status.expiryDate !== student.expiryDate) {
          setStudent((prev: any) => ({ ...prev, expiryDate: status.expiryDate }));
        }
      } catch (e) {
        console.warn("Silent background check failed");
      }
    };

    performCheck();
    const interval = setInterval(performCheck, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, student, handleLogout]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 text-right font-['Tajawal']" dir="rtl">
        
        {/* واجهة الأخطاء الحرجة (تمنع التصفح) */}
        {criticalError && (
          <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">⚠️</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">عفواً، انتهت الجلسة</h2>
            <p className="text-gray-500 font-bold mb-10 leading-relaxed">{criticalError}</p>
            <button 
              onClick={handleLogout}
              className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100"
            >
              تسجيل خروج والعودة
            </button>
          </div>
        )}

        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} externalError={expiryMessage} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Subjects student={student} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile onLogout={handleLogout} student={student} /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications student={student} /> : <Navigate to="/login" />} />
          <Route path="/subject/:id/teachers" element={isAuthenticated ? <Teachers /> : <Navigate to="/login" />} />
          <Route path="/teacher/:id/courses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
          <Route path="/course/:id/lectures" element={isAuthenticated ? <LecturesList /> : <Navigate to="/login" />} />
          <Route path="/lecture/:id" element={isAuthenticated ? <LectureView /> : <Navigate to="/login" />} />
          <Route path="/quiz/:examId" element={isAuthenticated ? <QuizView /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </HashRouter>
  );
};

export default App;
