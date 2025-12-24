
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import BottomNav from '../components/BottomNav';
import { Course } from '../types';

const Courses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await API.getCourses(id);
        setCourses(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchCourses();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#020617] pb-56 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

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
              محتوى حصري
            </span>
          </div>
        </div>

        <div className="animate__animated animate__fadeInLeft" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl font-black text-white leading-[1.2] mb-2">تصفح <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">أقوى الكورسات</span></h2>
            <p className="text-slate-500 text-xs font-bold tracking-wide">ابدأ رحلة التعلم الآن واصنع مستقبلك</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-5 grid grid-cols-2 gap-5 relative z-10">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-white/5 rounded-[3rem] animate-pulse border border-white/5"></div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course, idx) => (
            <Link 
              key={course.id} 
              to={`/course/${course.id}/lectures`}
              className="group glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl animate-card hover:border-blue-500/30 transition-all duration-500"
              style={{ animationDelay: `${0.4 + (idx * 0.15)}s` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/20"></div>
                
                {/* Lecture Count Badge */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-black text-white border border-white/20">
                   {course.lectureCount} محاضرات
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
                <h3 className="text-base font-black text-premium mb-4 group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                  {course.title}
                </h3>
                
                <div className="relative w-full py-3.5 bg-[#1e293b] rounded-2xl text-center overflow-hidden group/btn shadow-inner">
                  <span className="relative z-10 text-white font-black text-[11px] uppercase tracking-wider group-hover/btn:scale-105 transition-transform inline-block">
                    دخول الآن
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center animate__animated animate__fadeInUp">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold text-lg">لا توجد كورسات متاحة حالياً للمدرس</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Courses;
