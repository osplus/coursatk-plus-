
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import BottomNav from '../components/BottomNav';
import { Teacher } from '../types';

const Teachers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await API.getTeachers(id);
        setTeachers(data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, [id]);

  const getTeacherImage = (teacher: any) => {
    return teacher.avatar || teacher.image || teacher.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=2563eb&color=fff&size=512`;
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-56 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="px-6 pt-16 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-10 animate__animated animate__fadeInDown">
          <button 
            onClick={() => navigate(-1)} 
            className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl active:scale-90 transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white/70 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20"></div>
            <span className="relative bg-[#0f172a] text-blue-400 font-black tracking-widest text-[9px] uppercase px-4 py-2 rounded-lg border border-blue-500/30">
              المرحلة الثانية
            </span>
          </div>
        </div>

        <div className="animate__animated animate__fadeInLeft" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl font-black text-white leading-[1.2] mb-2">اختر <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">مدرسك المفضل</span></h2>
            <p className="text-slate-500 text-xs font-bold tracking-wide">نخبة من أفضل المعلمين في انتظارك</p>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="px-5 grid grid-cols-2 gap-5 relative z-10">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-white/5 rounded-[3rem] animate-pulse border border-white/5"></div>
          ))
        ) : teachers.length > 0 ? (
          teachers.map((teacher, idx) => (
            <Link 
              key={teacher.id} 
              to={`/teacher/${teacher.id}/courses`}
              className="group glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl animate-card hover:border-purple-500/30 transition-all duration-500"
              style={{ animationDelay: `${0.4 + (idx * 0.15)}s` }}
            >
              <div className="relative aspect-[1/1] overflow-hidden">
                 <img 
                    src={getTeacherImage(teacher)} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/10"></div>
                 
                 {/* Rating Badge */}
                 <div className="absolute top-4 left-4 bg-yellow-500/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white shadow-xl border border-white/20">
                    ⭐ {teacher.rating}
                 </div>

                 {/* Specialty Badge */}
                 <div className="absolute bottom-4 right-4 left-4">
                    <span className="block text-[8px] font-black text-purple-400 uppercase tracking-tighter bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 w-fit">
                       {teacher.specialty}
                    </span>
                 </div>
              </div>

              <div className="p-6 text-right">
                <h3 className="text-base font-black text-premium mb-4 group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug">
                  {teacher.name}
                </h3>
                
                <div className="relative w-full py-3.5 bg-[#1e293b] rounded-2xl text-center overflow-hidden group/btn shadow-inner">
                  <span className="relative z-10 text-white font-black text-[11px] uppercase tracking-wider group-hover/btn:scale-105 transition-transform inline-block">
                    عرض الكورسات
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]"></div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center animate__animated animate__fadeInUp">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold text-lg">لا يوجد مدرسين حالياً لهذه المادة</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Teachers;
