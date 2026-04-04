import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, ArrowLeft, ArrowRight } from 'lucide-react';

const FSDModuleQuiz = ({ subject = 'FSD', module = 'MODULE 1', onBack, username } = {}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  // Fetch questions when subject/module change
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!subject || !module) return;
      setQuestionsLoading(true);
      setQuestionsError('');
      setQuestions([]);
      try {
        const url = `/api/fetch_quiz_subjects/${encodeURIComponent(subject)}/${encodeURIComponent(module)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.questions)) {
          // normalize questions: use _id as id and convert correct_answer to 0-based
          const normalized = data.questions.map(q => ({
            id: q._id,
            question_number: q.question_number,
            question: q.question,
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correct_answer === 'number' ? (q.correct_answer - 1) : q.correct_answer
          }));
          setQuestions(normalized);
          setQuestionCount(data.questionCount ?? normalized.length);
          setCurrentQuestion(0);
          setSelectedAnswers({});
          setIsQuizStarted(false);
          setIsQuizCompleted(false);
          setShowReview(false);
        } else {
          setQuestionsError('No questions returned');
        }
      } catch (err) {
        console.error('Failed to fetch quiz questions:', err);
        setQuestionsError('Failed to fetch questions');
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [subject, module]);

  useEffect(() => {
    let interval;
    if (isQuizStarted && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, isQuizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setTimeElapsed(0);
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setIsQuizCompleted(false);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const score = calculateScore();
    const percentage = parseFloat(((score / questions.length) * 100).toFixed(1));
    const grade = getGradeForScore(percentage);

    try {
      const response = await fetch('/api/quiz_scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          subject: subject,
          module: module,
          total_questions: questions.length,
          correct_answers: score,
          score: score,
          grade: grade,
          time_taken: timeElapsed
        })
      });

      if (!response.ok) {
        console.error('Failed to submit quiz score');
      }
    } catch (error) {
      console.error('Error submitting quiz score:', error);
    }

    setIsQuizCompleted(true);
  };

  const getGradeForScore = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getPercentage = () => {
    return ((calculateScore() / questions.length) * 100).toFixed(1);
  };

  const getGrade = () => {
    const percentage = parseFloat(getPercentage());
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => (onBack ? onBack() : window.history.back())}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Modules</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Award size={48} className="text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">FSD Module 1 Quiz</h1>
              <p className="text-gray-600 text-lg">HTML & CSS Fundamentals</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{questionsLoading ? '...' : (questionCount || questions.length)}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
                <div className="text-gray-600">Options Each</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
                <div className="text-gray-600">No Time Limit</div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Answer all 50 multiple choice questions</li>
                <li>• You can navigate between questions freely</li>
                <li>• Your time will be tracked for performance analysis</li>
                <li>• Review your answers before submitting</li>
              </ul>
            </div>

            <button
              onClick={() => { if (!questionsLoading && questions.length) handleStartQuiz(); }}
              disabled={questionsLoading || questions.length === 0}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl ${questionsLoading || questions.length === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
            >
              {questionsLoading ? 'Loading...' : questions.length === 0 ? 'No questions' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizCompleted && !showReview) {
    const score = calculateScore();
    const percentage = getPercentage();
    const grade = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className={`inline-block p-4 rounded-full mb-4 ${
                percentage >= 60 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {percentage >= 60 ? (
                  <CheckCircle size={64} className="text-green-600" />
                ) : (
                  <XCircle size={64} className="text-red-600" />
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {percentage >= 60 ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-600">You have completed the FSD Module 1 Quiz</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Your Score</div>
                <div className="text-4xl font-bold mb-1">{score}/{questions.length}</div>
                <div className="text-lg">{percentage}%</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Grade</div>
                <div className="text-6xl font-bold">{grade}</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Correct Answers</div>
                <div className="text-4xl font-bold">{score}</div>
                <div className="text-sm opacity-90">questions</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Time Taken</div>
                <div className="text-4xl font-bold">{formatTime(timeElapsed)}</div>
                <div className="text-sm opacity-90">minutes</div>
              </div>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setShowReview(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Review Answers
              </button>
              <button
                onClick={handleStartQuiz}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => (onBack ? onBack() : window.history.back())}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Back to Modules
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowReview(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Results</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Answer Review</h2>
            
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                const wasAnswered = selectedAnswers[q.id] !== undefined;
                
                return (
                  <div
                    key={q.id}
                    className={`border-2 rounded-xl p-6 ${
                      !wasAnswered
                        ? 'border-gray-300 bg-gray-50'
                        : isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        !wasAnswered
                          ? 'bg-gray-300 text-gray-600'
                          : isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-4">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            const isCorrectOption = optIdx === q.correctAnswer;
                            
                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectOption
                                    ? 'border-green-500 bg-green-100'
                                    : isSelected
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectOption && (
                                    <CheckCircle size={20} className="text-green-600" />
                                  )}
                                  {isSelected && !isCorrectOption && (
                                    <XCircle size={20} className="text-red-600" />
                                  )}
                                  <span className={`${
                                    isCorrectOption ? 'font-semibold text-green-800' :
                                    isSelected ? 'font-semibold text-red-800' :
                                    'text-gray-700'
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {!wasAnswered && (
                          <p className="text-gray-600 mt-3 text-sm">Not answered</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">FSD Module 1 Quiz</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
              <Clock size={20} className="text-blue-600" />
              <span className="font-mono font-semibold text-blue-600">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Answered: {answeredCount}/{questions.length}</span>
            <span>Remaining: {questions.length - answeredCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Question {currentQuestion + 1}
            </span>
            <h3 className="text-2xl font-semibold text-gray-800">{currentQ.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(currentQ.id, idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswers[currentQ.id] === idx
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQ.id] === idx
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQ.id] === idx && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-lg text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Next
              <ArrowRight size={20} />
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                  idx === currentQuestion
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : selectedAnswers[q.id] !== undefined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSDModuleQuiz;