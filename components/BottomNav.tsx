
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'home', 
      label: 'الرئيسية', 
      path: '/',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-all duration-500 drop-shadow-lg ${active ? 'text-white scale-125' : 'text-gray-500'}`} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'notifications', 
      label: 'التنبيهات', 
      path: '/notifications',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-all duration-500 drop-shadow-lg ${active ? 'text-white scale-125' : 'text-gray-500'}`} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'حسابي', 
      path: '/profile',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-all duration-500 drop-shadow-lg ${active ? 'text-white scale-125' : 'text-gray-500'}`} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-12 left-8 right-8 z-50 animate__animated animate__fadeInUpBig">
      {/* Container شفاف مع برواز نيون خفيف جداً */}
      <div className="bg-transparent backdrop-blur-md h-28 rounded-[3.5rem] shadow-2xl border border-white/5 px-10 flex justify-between items-center relative overflow-hidden">
        
        {/* التوهج الخلفي للعنصر النشط - تأثير نيون */}
        <div className="absolute inset-x-10 inset-y-0 pointer-events-none flex justify-between items-center">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div key={item.id} className={`w-20 h-20 rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-purple-600 blur-[45px] ${isActive ? 'opacity-40 scale-150' : 'opacity-0 scale-50'}`}></div>
                );
            })}
        </div>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 group relative z-10"
            >
              <div className={`p-4 rounded-[2rem] transition-all duration-500 ${isActive ? 'btn-super-glow -translate-y-6 shadow-2xl scale-110' : 'hover:bg-white/10'}`}>
                {item.icon(isActive)}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 drop-shadow-lg ${isActive ? 'text-white opacity-100' : 'text-gray-500 opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
