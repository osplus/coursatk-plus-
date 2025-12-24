
import React, { useState, useRef, useEffect } from 'react';
import { API } from '../services/api';

interface LoginProps {
  onLogin: (studentData: any) => void;
  externalError?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, externalError }) => {
  const [codeParts, setCodeParts] = useState<string[]>(new Array(7).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    if (externalError) setError(externalError);
  }, [externalError]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCodeParts = [...codeParts];
    newCodeParts[index] = value.substring(value.length - 1);
    setCodeParts(newCodeParts);
    if (value && index < 6) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeParts[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeParts.join('');
    if (fullCode.length < 7) {
      setError('يرجى إكمال الكود المكون من 7 أرقام');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.verifyCode(fullCode);
      if (response.success) onLogin(response.student);
      else setError(response.message);
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Tajawal']">
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Top Card: Animated Logo Section */}
        <div className="glass-card rounded-[3.5rem] p-12 flex flex-col items-center animate-card border-white/10" style={{ animationDelay: '0.1s' }}>
          <div className="relative group">
            {/* Logo Glow Ring */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
            
            {/* The Plus Icon */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-[2.2rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl animate-float neon-glow border border-white/20">
              <span className="drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)]">+</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-premium mt-8 mb-3 tracking-tight">
            كورسات بلس
          </h1>
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 via-white to-purple-500 rounded-full mb-4 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px] opacity-90">
            NEXT-GEN EDUCATION
          </p>
        </div>

        {/* Bottom Card: Login Form */}
        <div className="glass-card rounded-[3.5rem] p-12 animate-card border-white/5" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white mb-3">تفعيل المنصة</h2>
            <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[240px] mx-auto">
              أدخل كود الاشتراك المكون من 7 أرقام لتجربة تعليمية فريدة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Input Grid */}
            <div className="flex gap-2.5 justify-center" dir="ltr">
              {codeParts.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-16 bg-slate-900/50 border-2 rounded-2xl text-center text-2xl font-black transition-all duration-300 outline-none
                    ${digit 
                      ? 'text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                      : 'text-slate-600 border-white/10 focus:border-blue-500/50 focus:bg-slate-800'
                    }`}
                />
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center animate__animated animate__shakeX">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-18 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-full flex items-center justify-center gap-4 text-white font-black text-xl shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5)] active:scale-[0.96] hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="relative z-10">انطلق الآن</span>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <button className="text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors">
                طلب كود جديد؟ تواصل معنا
             </button>
             <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
                PREMIUM EDUCATIONAL PLATFORM
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
