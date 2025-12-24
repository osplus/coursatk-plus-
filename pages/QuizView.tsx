
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import { Question, Exam } from '../types';

const QuizView: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!examId) return;
      try {
        const [examData, questionsData] = await Promise.all([
          API.getExam(examId),
          API.getQuestions(examId)
        ]);
        setExam(examData);
        setQuestions(questionsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [examId]);

  const handleSelectOption = (optionIdx: number) => {
    setUserAnswers({ ...userAnswers, [currentIdx]: optionIdx });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    return { 
      correct, 
      total: questions.length, 
      percentage: Math.round((correct / questions.length) * 100) 
    };
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-blue-600"><div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>;

  if (isFinished) {
    const result = calculateScore();
    const isPassed = result.percentage >= (exam?.passingScore || 50);
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center" dir="rtl">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl ${isPassed ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
          {isPassed ? '🎉' : '⚠️'}
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">{isPassed ? 'مبروك النجاح!' : 'محاولة جيدة'}</h1>
        <p className="text-gray-400 font-bold mb-8 text-lg">لقد أجبت على {result.correct} من أصل {result.total} سؤال بشكل صحيح.</p>
        
        <div className="w-full bg-gray-50 rounded-[2.5rem] p-10 mb-10 border border-gray-100">
          <span className="text-gray-400 font-bold text-sm block mb-2">درجتك النهائية</span>
          <h2 className={`text-6xl font-black ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{result.percentage}%</h2>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          العودة للمحاضرة
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col" dir="rtl">
      {/* Header & Progress */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => navigate(-1)} className="text-gray-400 font-bold">خروج</button>
           <h2 className="text-gray-800 font-black">سؤال {currentIdx + 1} من {questions.length}</h2>
           <div className="w-8"></div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 mb-6">
          <h3 className="text-xl font-bold text-gray-800 leading-relaxed mb-6">
            {currentQuestion?.text}
          </h3>
          
          {currentQuestion?.image && (
            <div className="w-full rounded-2xl overflow-hidden border border-gray-100 mb-6">
              <img src={currentQuestion.image} alt="Question" className="w-full h-auto" />
            </div>
          )}

          <div className="space-y-4">
            {currentQuestion?.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-5 rounded-2xl text-right font-bold transition-all border-2 flex items-center justify-between ${userAnswers[currentIdx] === idx ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-gray-50 text-gray-700 active:bg-blue-50'}`}
              >
                <span>{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${userAnswers[currentIdx] === idx ? 'border-white bg-white/20' : 'border-gray-200'}`}>
                   {userAnswers[currentIdx] === idx && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white p-6 flex gap-4">
        <button 
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex-1 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl disabled:opacity-30"
        >
          السابق
        </button>
        <button 
          onClick={handleNext}
          disabled={userAnswers[currentIdx] === undefined}
          className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 disabled:bg-gray-300 transition-all active:scale-95"
        >
          {currentIdx === questions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
