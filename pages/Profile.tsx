
import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

interface ProfileProps {
  onLogout?: () => void;
  student?: any;
}

const Profile: React.FC<ProfileProps> = ({ onLogout, student }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    if (onLogout) onLogout();
  };

  const copyToClipboard = () => {
    if (student?.code) {
      navigator.clipboard.writeText(student.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'منصة كورسات بلس',
        text: 'سجل الآن في منصة كورسات بلس التعليمية وشاهد أقوى المحاضرات!',
        url: window.location.origin,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.origin);
      alert('تم نسخ رابط المنصة، يمكنك إرساله لزملائك الآن!');
    }
  };

  const formatExpiry = (dateStr: string) => {
    if (!dateStr) return 'غير محدد';
    const expiry = new Date(dateStr);
    const now = new Date();
    const isToday = expiry.toDateString() === now.toDateString();
    
    if (isToday) {
      return `اليوم الساعة ${expiry.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return expiry.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isExpiringSoon = () => {
    if (!student?.expiryDate) return false;
    const expiry = new Date(student.expiryDate).getTime();
    const now = new Date().getTime();
    const diffInHours = (expiry - now) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours < 24;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-32" dir="rtl">
      <div className="px-6 pt-10 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">ملف الطالب</h1>
        
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative mb-6">
            {/* استبدال الصورة الشخصية برمز تعليمي */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg mx-auto flex items-center justify-center border-4 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-1/2 translate-x-12 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{student?.name || 'طالب مجهول'}</h2>
          
          <div 
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl cursor-pointer active:scale-95 transition-all mb-8"
          >
            <span className="text-blue-600 font-black">كود الطالب: #{student?.code || '000000'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied && <span className="text-[10px] text-green-500 font-bold">تم النسخ!</span>}
          </div>

          <div className="space-y-4 text-right mb-8">
            <div className="bg-gray-50 p-5 rounded-3xl flex items-center justify-between">
              <span className="text-gray-400 font-medium">الشعبة</span>
              <span className="text-gray-800 font-bold">{student?.section || 'غير محدد'}</span>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-3xl flex items-center justify-between">
              <span className="text-gray-400 font-medium">حالة الكود</span>
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">نشط</span>
            </div>

            <div className={`p-6 rounded-3xl text-white shadow-lg transition-all ${isExpiringSoon() ? 'bg-orange-500 shadow-orange-100' : 'bg-blue-500 shadow-blue-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="opacity-80 text-sm">صلاحية الكود حتى</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-bold">{formatExpiry(student?.expiryDate)}</p>
            </div>
          </div>

          {/* زر مشاركة المنصة */}
          <button 
            onClick={handleShareApp}
            className="w-full mb-4 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            مشاركة المنصة مع زملائك
          </button>

          <button 
            onClick={handleLogoutClick}
            className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scaleUp">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 text-center mb-4">تنبيه هام!</h3>
            <p className="text-gray-600 text-center leading-relaxed font-bold mb-8">
              لو عملت تسجيل خروج لازم تتواصل مع الادمن علشان يفتحلك كود التفعيل مرة تانية. هل أنت متأكد؟
            </p>

            <div className="space-y-3">
              <button 
                onClick={confirmLogout}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95"
              >
                تأكيد تسجيل الخروج
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
};

export default Profile;
