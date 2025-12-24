
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../services/api';
import BottomNav from '../components/BottomNav';
import { Subject } from '../types';

interface SubjectsProps {
  student?: any;
}

const Subjects: React.FC<SubjectsProps> = ({ student }) => {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await API.getSubjects();
        setAllSubjects(data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] pb-56 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="px-6 pt-16 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-10 animate__animated animate__fadeInDown">
          <Link to="/profile" className="flex items-center gap-4 group">
             <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-[#0f172a] flex items-center justify-center text-white border border-white/10 shadow-2xl transition-transform group-hover:rotate-6">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
             </div>
             <div>
                <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">مرحباً بك</p>
                <h1 className="text-lg font-black text-premium leading-none">{student?.name || 'طالب متميز'}</h1>
             </div>
          </Link>
          
          <Link to="/notifications" className="relative group">
             <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center relative border border-white/10 shadow-2xl active:scale-90 transition-all">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
             </div>
          </Link>
        </div>

        <div className="animate__animated animate__fadeInLeft" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl font-black text-white leading-[1.2] mb-2">استكشف <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">موادك الدراسية</span></h2>
            <p className="text-slate-500 text-xs font-bold tracking-wide">اختر المادة لتبدأ رحلة التعلم الذكي</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="px-5 grid grid-cols-2 gap-5 relative z-10">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-72 bg-white/5 rounded-[3rem] animate-pulse border border-white/5"></div>
          ))
        ) : (
          allSubjects.map((subject, idx) => (
            <Link 
              key={subject.id} 
              to={`/subject/${subject.id}/teachers`}
              className="group glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl animate-card hover:border-blue-500/30 transition-all duration-500"
              style={{ animationDelay: `${0.4 + (idx * 0.15)}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                 <img 
                    src={subject.image} 
                    alt={subject.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/20"></div>
                 
                 {/* Floating Badge */}
                 <div className="absolute top-5 left-5 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-black text-white shadow-xl border border-white/20 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                    {subject.lessonsCount || 0} محاضرة
                 </div>

                 {/* Play Button Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 scale-50 group-hover:scale-100 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white fill-current" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                    </div>
                 </div>
              </div>

              <div className="p-6 text-right">
                <h3 className="text-lg font-black text-premium mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">{subject.name}</h3>
                
                <div className="relative w-full py-3.5 bg-[#1e293b] rounded-2xl text-center overflow-hidden group/btn">
                  <span className="relative z-10 text-white font-black text-[11px] uppercase tracking-wider group-hover/btn:scale-110 transition-transform inline-block">ابدأ الآن</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && allSubjects.length === 0 && (
        <div className="py-20 text-center animate__animated animate__fadeInUp">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
          <p className="text-slate-500 font-bold text-lg">لا توجد مواد دراسية متاحة حالياً</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Subjects;
