
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { API } from '../services/api';
import { Lecture } from '../types';

interface NotificationsProps {
  student?: any;
}

const Notifications: React.FC<NotificationsProps> = ({ student }) => {
  const navigate = useNavigate();
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  // تحديث العداد التنازلي كل ثانية
  useEffect(() => {
    if (!student?.expiryDate) return;

    const timer = setInterval(() => {
      const diff = new Date(student.expiryDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [student?.expiryDate]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const lectures = await API.getRecentLectures(5);
        setRecentLectures(lectures);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const handleNoticeClick = (notice: any) => {
    if (notice.type === 'lecture' && notice.targetId) {
      navigate(`/lecture/${notice.targetId}`);
    } else if (notice.type === 'expiry') {
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-32" dir="rtl">
      <div className="px-6 pt-10">
        <h1 className="text-2xl font-black text-gray-800 mb-2">التنبيهات الحية</h1>
        <p className="text-xs text-gray-400 font-bold mb-8">نظام المزامنة التلقائي للمنصة</p>

        <div className="space-y-4">
          {/* إشعار العداد التنازلي الحي */}
          {student?.expiryDate && (
            <div className={`p-6 rounded-[2.5rem] shadow-sm border transition-all ${timeLeft ? 'bg-orange-50/30 border-orange-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${timeLeft ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                  {timeLeft ? '⏳' : '🚫'}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 mb-1">{timeLeft ? 'الوقت المتبقي لاشتراكك' : 'انتهى الاشتراك'}</h3>
                  {timeLeft ? (
                    <div className="flex gap-2 mt-3" dir="ltr">
                      {[
                        { label: 'يوم', val: timeLeft.d },
                        { label: 'ساعة', val: timeLeft.h },
                        { label: 'دقيقة', val: timeLeft.m },
                        { label: 'ثانية', val: timeLeft.s }
                      ].map((t, i) => (
                        <div key={i} className="flex-1 bg-white rounded-xl p-2 text-center border border-orange-50 shadow-sm">
                          <div className="text-sm font-black text-orange-600">{t.val}</div>
                          <div className="text-[8px] text-gray-400 font-bold">{t.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500 text-xs font-bold mt-2">يرجى التواصل مع الإدارة لتجديد الكود الخاص بك.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* إشعارات المحاضرات المجلوبة من السيرفر */}
          {isLoading ? (
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 animate-pulse text-center text-gray-300 font-bold">جاري مزامنة المحاضرات...</div>
          ) : (
            recentLectures.map((lecture, idx) => (
              <div 
                key={lecture.id}
                onClick={() => handleNoticeClick({ type: 'lecture', targetId: lecture.id })}
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex gap-4 active:scale-95 transition-all animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">🎬</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-black text-gray-800 text-sm">محاضرة جديدة!</h3>
                    <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">الآن</span>
                  </div>
                  <p className="text-gray-400 text-[11px] font-bold leading-relaxed line-clamp-2">تم رفع محاضرة "{lecture.title}" بنجاح، يمكنك مشاهدتها الآن.</p>
                </div>
              </div>
            ))
          )}

          {!isLoading && recentLectures.length === 0 && (
            <div className="py-20 text-center opacity-40">
              <div className="text-4xl mb-4">📭</div>
              <p className="font-bold text-sm">لا توجد تحديثات جديدة اليوم</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Notifications;
