import React, { useState, useEffect } from 'react';
import QuizPortal from './quiz_portal';

export default function QuizPracticeSection({ username }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/fetch_quiz_subjects');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        } else {
          setError('Failed to load subjects');
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setModuleLoading(true);
    setModuleError('');
    setModules([]);
    
    try {
      const response = await fetch(`http://localhost:5000/api/fetch_quiz_subjects/${subject}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.modules)) {
        setModules(data.modules);
      } else {
        setModuleError('Failed to load modules');
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setModuleError('Failed to fetch modules');
    } finally {
      setModuleLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError('');
    try {
      const response = await fetch('http://localhost:5000/api/fetch_total_scores');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.leaderboard)) {
        setLeaderboardData(data.leaderboard);
        setShowLeaderboard(true);
      } else {
        setLeaderboardError('Failed to load leaderboard data');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboardError('Failed to fetch leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Quiz & Practice Section</h1>
      
      {/* If a module is selected, show the QuizPortal full-width and hide the two-column layout */}
      {selectedModule ? (
        <div className="">
          <div className="mb-4">
            <button
              onClick={() => setSelectedModule(null)}
              className="text-blue-600 flex items-center mb-4 hover:text-blue-800"
            >
              ← Back to Modules
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <QuizPortal subject={selectedSubject} module={selectedModule} username={username} onBack={() => setSelectedModule(null)} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Subject-specific Quizzes */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold mb-6">Subject-specific Quizzes</h2>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-600 p-4">Loading subjects...</div>
            ) : error ? (
              <div className="text-red-600 p-4">{error}</div>
            ) : subjects.length === 0 ? (
              <div className="text-gray-600 p-4">No subjects available</div>
            ) : (
              <>
                {selectedSubject && (
                  <div className="mb-4">
                    <button 
                      onClick={() => {
                        setSelectedSubject(null);
                        setModules([]);
                        setModuleError('');
                      }}
                      className="text-blue-600 flex items-center mb-4 hover:text-blue-800"
                    >
                      ← Back to Subjects
                    </button>
                    <h3 className="text-lg font-bold mb-4">{selectedSubject} Modules</h3>
                    {moduleLoading ? (
                      <div className="text-gray-600 p-4">Loading modules...</div>
                    ) : moduleError ? (
                      <div className="text-red-600 p-4">{moduleError}</div>
                    ) : modules.length === 0 ? (
                      <div className="text-gray-600 p-4">No modules available</div>
                    ) : (
                      <>
                        {selectedModule ? (
                          <div>
                            <button
                              onClick={() => setSelectedModule(null)}
                              className="text-blue-600 flex items-center mb-4 hover:text-blue-800"
                            >
                              ← Back to Modules
                            </button>
                            <div className="mt-2">
                              <QuizPortal subject={selectedSubject} module={selectedModule} username={username} onBack={() => setSelectedModule(null)} />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {modules.map((module, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setSelectedModule(module)}
                                className="w-full text-left bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition"
                              >
                                <span className="font-semibold text-gray-800">{module}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                {!selectedSubject && subjects.map((subject, index) => (
                  <button 
                    key={index}
                    onClick={() => handleSubjectClick(subject)}
                    className="w-full text-left bg-teal-50 p-4 rounded-lg hover:bg-teal-100 transition"
                  >
                    <span className="font-semibold text-gray-800">{subject}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
        
        {/* Right Side - Challenge Mode */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold mb-6">Challenge Mode</h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3 font-medium">Complete tasks under timed conditions</p>
              <button className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold text-sm hover:bg-purple-700 transition">
                Random Test
              </button>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3 font-medium">Compete with peers on leaderboard</p>
              <button 
                onClick={fetchLeaderboard}
                className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold text-sm hover:bg-teal-800 transition"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Leaderboard</h3>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {leaderboardLoading ? (
              <div className="text-center py-8">Loading leaderboard...</div>
            ) : leaderboardError ? (
              <div className="text-center py-8 text-red-600">{leaderboardError}</div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No scores available</div>
            ) : (
              <div className="space-y-3">
                {leaderboardData.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg text-blue-600">#{index + 1}</span>
                      <span className="font-medium">{entry.username}</span>
                    </div>
                    <span className="font-bold text-lg">{entry.totalScore}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}