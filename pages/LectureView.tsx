
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API } from '../services/api';
import { Lecture, LecturePart } from '../types';

const LectureView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [activePartTitle, setActivePartTitle] = useState<string>('');

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await API.getLectureById(id);
        if (data) {
          setLecture(data);
          // إذا كان هناك أجزاء، ابدأ بأول جزء، وإلا ابدأ بالفيديو الرئيسي
          if (data.parts && data.parts.length > 0) {
            setActiveVideoUrl(data.parts[0].videoUrl);
            setActivePartTitle(data.parts[0].title);
          } else {
            setActiveVideoUrl(data.videoUrl);
            setActivePartTitle(data.title);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLecture();
  }, [id]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return url;
  };

  const handleDownloadPdf = () => {
    if (lecture?.pdfUrl) {
      window.open(lecture.pdfUrl, '_blank');
    } else {
      alert('المذكرة غير متوفرة لهذه المحاضرة حالياً.');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f8faff]"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!lecture) return <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center"><p className="mb-4">المحاضرة غير موجودة</p><button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl">عودة</button></div>;

  return (
    <div className="min-h-screen bg-[#f8faff] pb-10" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center justify-between">
        <div className="bg-blue-50 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black">مشاهدة الآن</div>
        <h1 className="text-base font-black text-gray-800 truncate px-4">{lecture.title}</h1>
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
      </div>

      {/* Player Section */}
      <div className="px-4 mb-4">
        <div className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
          <iframe 
            src={`${getEmbedUrl(activeVideoUrl)}`} 
            className="w-full h-full" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-4 px-2">
            <p className="text-xs text-blue-600 font-black mb-1">يتم تشغيل الآن:</p>
            <h2 className="text-lg font-black text-gray-800">{activePartTitle}</h2>
        </div>
      </div>

      <div className="px-6 space-y-6">
        
        {/* Lecture Parts List (New Feature) */}
        {lecture.parts && lecture.parts.length > 0 && (
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-blue-50">
                <h3 className="text-sm font-black text-gray-400 mb-4 px-2">فهرس المحاضرة ({lecture.parts.length} أجزاء)</h3>
                <div className="space-y-2">
                    {lecture.parts.map((part, idx) => (
                        <button 
                            key={idx}
                            onClick={() => {
                                setActiveVideoUrl(part.videoUrl);
                                setActivePartTitle(part.title);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeVideoUrl === part.videoUrl ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${activeVideoUrl === part.videoUrl ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
                                {idx + 1}
                            </div>
                            <span className="flex-1 text-right font-bold text-sm">{part.title}</span>
                            {activeVideoUrl === part.videoUrl && (
                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Info & Actions */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={handleDownloadPdf}
            className="bg-blue-600 text-white p-5 rounded-[2rem] flex items-center justify-between shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <div className="text-right">
              <h3 className="font-black text-lg">تحميل المذكرة (PDF)</h3>
              <span className="text-[10px] opacity-80">اضغط لفتح ملف الشرح</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </button>

          {lecture.examId && (
            <Link 
              to={`/quiz/${lecture.examId}`}
              className="bg-white border-2 border-orange-400 text-orange-500 p-5 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all"
            >
              <div className="text-right">
                <h3 className="font-black text-lg">اختبر نفسك</h3>
                <span className="text-[10px] text-orange-400 font-bold">ابدأ الاختبار التقييمي للمحاضرة</span>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
            </Link>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
          <h4 className="font-black text-gray-800 mb-2">وصف المحاضرة</h4>
          <p className="text-gray-400 text-xs font-bold leading-relaxed">
            {lecture.description || 'لا يوجد وصف متاح لهذه المحاضرة حالياً.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LectureView;
