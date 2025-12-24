
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import BottomNav from '../components/BottomNav';
import { Lecture } from '../types';

const LecturesList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await API.getLectures(id);
        setLectures(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLectures();
  }, [id]);

  const toggleExpand = (lectureId: string) => {
    setExpandedLectureId(expandedLectureId === lectureId ? null : lectureId);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] pb-32" dir="rtl">
      <div className="px-6 pt-12 mb-8 flex items-center justify-between">
         <div className="w-10"></div>
         <h1 className="text-xl font-black text-gray-800">محتوى الكورس</h1>
         <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
         </button>
      </div>

      <div className="px-6 space-y-6">
        {isLoading ? (
          <div className="text-center py-20">جاري تحميل المحاضرات...</div>
        ) : lectures.length > 0 ? (
          lectures.map((lecture) => (
            <div key={lecture.id} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-blue-50">
              <div 
                onClick={() => navigate(`/lecture/${lecture.id}`)}
                className="relative aspect-video rounded-[2rem] overflow-hidden mb-4 cursor-pointer group"
              >
                <img src={lecture.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="text-lg font-black text-gray-800">{lecture.title}</h3>
                  <p className="text-gray-400 text-xs font-bold">{lecture.duration}</p>
                </div>
                <button 
                  onClick={() => navigate(`/lecture/${lecture.id}`)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black"
                >
                  مشاهدة
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-400">لا توجد محاضرات في هذا الكورس بعد.</div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default LecturesList;
