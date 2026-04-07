import React, { useState } from 'react';
import { BookOpen, Calendar, Users, TrendingUp, Bell, Settings, FileText, CheckSquare, BarChart3, Upload, Search, MessageCircle, LogOut, Home, Menu, X } from 'lucide-react';

const StudyBuddy = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user] = useState({ name: 'Sandy', role: 'Student' });

  const [classes] = useState([
    { id: 1, name: 'Mathematics 101', attendance: 85, nextClass: 'Tomorrow 10:00 AM' },
    { id: 2, name: 'Physics Advanced', attendance: 92, nextClass: 'Today 2:00 PM' },
    { id: 3, name: 'Computer Science', attendance: 78, nextClass: 'Monday 9:00 AM' }
  ]);

  const [tasks] = useState([
    { id: 1, title: 'Complete Math Assignment', deadline: '2 days', priority: 'high', status: 'pending' },
    { id: 2, title: 'Physics Lab Report', deadline: '5 days', priority: 'medium', status: 'in-progress' },
    { id: 3, title: 'CS Project Phase 1', deadline: '1 week', priority: 'high', status: 'pending' }
  ]);

  const [grades] = useState([
    { subject: 'Math', score: 85, grade: 'A' },
    { subject: 'Physics', score: 92, grade: 'A+' },
    { subject: 'Computer Science', score: 88, grade: 'A' },
    { subject: 'English', score: 79, grade: 'B+' }
  ]);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'attendance', name: 'Attendance Tracker', icon: Calendar },
    { id: 'notes', name: 'Notes Organizer', icon: FileText },
    { id: 'tasks', name: 'To-Do List', icon: CheckSquare },
    { id: 'grades', name:'Grades&Performance', icon: TrendingUp },
    { id: 'study-planner', name: 'Study Planner', icon: BookOpen },
    { id: 'resources', name: 'Resource Library', icon: Upload },
    { id: 'discussion', name: 'Discussion Forum', icon: MessageCircle },
    { id: 'quiz', name: 'Quiz & Practice', icon: BarChart3 }
  ];

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">12</span>
          </div>
          <h3 className="text-gray-800 font-semibold">Total Classes</h3>
          <p className="text-sm text-blue-600 mt-1">View details</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">85%</span>
          </div>
          <h3 className="text-gray-800 font-semibold">Avg Attendance</h3>
          <p className="text-sm text-blue-600 mt-1">View details</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-red-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">8</span>
          </div>
          <h3 className="text-gray-800 font-semibold">Pending Tasks</h3>
          <p className="text-sm text-blue-600 mt-1">View details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">Academic Summary</h3>
                <p className="text-sm text-blue-100">Last updated: Today, 10:30 AM</p>
              </div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50">
                View Report
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-100 mb-1">Avg Attendance</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Avg Grade</p>
                <p className="text-2xl font-bold">A</p>
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Tasks Done</p>
                <p className="text-2xl font-bold">24/32</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Classes</h3>
              <button className="text-blue-600 text-sm font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{cls.name}</p>
                      <p className="text-sm text-gray-500">{cls.nextClass}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cls.attendance >= 85 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cls.attendance >= 85 ? 'Good' : 'Warning'}
                    </span>
                    <button className="text-blue-600">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all">
                <Upload className="text-gray-600 mb-2" size={24} />
                <span className="text-sm font-semibold text-gray-700">Upload</span>
                <span className="text-xs text-gray-500">New Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all">
                <Calendar className="text-gray-600 mb-2" size={24} />
                <span className="text-sm font-semibold text-gray-700">Schedule</span>
                <span className="text-xs text-gray-500">Book Test</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all">
                <MessageCircle className="text-gray-600 mb-2" size={24} />
                <span className="text-sm font-semibold text-gray-700">Support</span>
                <span className="text-xs text-gray-500">Get Help</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all">
                <BarChart3 className="text-gray-600 mb-2" size={24} />
                <span className="text-sm font-semibold text-gray-700">Quick</span>
                <span className="text-xs text-gray-500">Actions</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 py-3 bg-red-50">
                <p className="font-semibold text-red-800 text-sm">Urgent Task</p>
                <p className="text-xs text-gray-600 mt-1">Math assignment due in 2 days</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50">
                <p className="font-semibold text-blue-800 text-sm">Class Reminder</p>
                <p className="text-xs text-gray-600 mt-1">Physics class tomorrow at 10:00 AM</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50">
                <p className="font-semibold text-green-800 text-sm">Grade Updated</p>
                <p className="text-xs text-gray-600 mt-1">New grade posted for CS Project</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AttendanceView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Attendance Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                <th className="px-4 py-3 text-left text-white">Subject</th>
                <th className="px-4 py-3 text-left text-white">Attendance %</th>
                <th className="px-4 py-3 text-left text-white">Classes Missed</th>
                <th className="px-4 py-3 text-left text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map(cls => (
                <tr key={cls.id} className="hover:bg-cyan-50">
                  <td className="px-4 py-3 text-blue-900">{cls.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full" style={{width: `${cls.attendance}%`}}></div>
                      </div>
                      <span className="text-blue-900">{cls.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-blue-900">{Math.floor((100 - cls.attendance) / 5)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${cls.attendance >= 85 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {cls.attendance >= 85 ? 'Good' : 'Warning'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const NotesView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">My Notes</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg">
            + New Note
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="border-2 border-blue-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <FileText className="text-blue-600" size={24} />
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">{cls.name}</h4>
              <p className="text-sm text-gray-600 mb-3">Chapter notes and key concepts...</p>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 bg-cyan-100 text-blue-900 rounded-full">Edit</button>
                <button className="text-xs px-3 py-1 bg-purple-100 text-purple-900 rounded-full">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">To-Do List & Task Tracker</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg">
            + Add Task
          </button>
        </div>
        
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:shadow-md">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">{task.title}</p>
                <p className="text-sm text-gray-600">Due in {task.deadline}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                task.priority === 'high' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
              }`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                task.status === 'pending' ? 'bg-gray-200 text-gray-800' : 'bg-cyan-200 text-cyan-800'
              }`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GradesView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Grades & Performance Tracker</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Overall Performance</h4>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-900 mb-2">A</div>
              <p className="text-gray-600">Average Grade</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Score Distribution</h4>
            <div className="space-y-2">
              {grades.map((grade, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm text-blue-900 w-20">{grade.subject}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full" 
                      style={{width: `${grade.score}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-blue-900 w-12">{grade.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                <th className="px-4 py-3 text-left text-white">Subject</th>
                <th className="px-4 py-3 text-left text-white">Score</th>
                <th className="px-4 py-3 text-left text-white">Grade</th>
                <th className="px-4 py-3 text-left text-white">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {grades.map((grade, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="px-4 py-3 text-blue-900">{grade.subject}</td>
                  <td className="px-4 py-3 text-blue-900">{grade.score}%</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <TrendingUp className="text-green-600" size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const StudyPlannerView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Weekly Study Planner</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Current Week</h4>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center gap-3 p-3 bg-cyan-50 rounded">
                  <span className="font-medium text-blue-900 w-24">{day}</span>
                  <div className="flex-1 text-sm text-gray-600">
                    Math: 2hrs, Physics: 1.5hrs
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-2 border-purple-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Upcoming Deadlines</h4>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="p-3 bg-purple-50 rounded">
                  <p className="font-medium text-purple-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.deadline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ResourcesView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">Resource Library</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2">
            <Upload size={18} />
            Upload Resource
          </button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search resources by subject, module, or semester..." 
              className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['PDFs', 'Notes', 'Past Papers'].map((type, idx) => (
            <div key={idx} className="border-2 border-blue-200 p-6 rounded-lg hover:shadow-lg transition-shadow text-center">
              <FileText className="mx-auto text-blue-600 mb-3" size={48} />
              <h4 className="font-bold text-blue-900 mb-2">{type}</h4>
              <p className="text-sm text-gray-600 mb-4">{12 + idx * 5} files</p>
              <button className="px-4 py-2 bg-cyan-100 text-blue-900 rounded-lg hover:bg-cyan-200 w-full">
                Browse
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DiscussionView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Discussion Forum / Community</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-2 border-blue-200 p-4 rounded-lg hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-blue-900">Student {i}</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-blue-900 mb-2">How to solve quadratic equations efficiently?</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>👍 12</span>
                      <span>💬 5 replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-purple-200 p-4 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-blue-900 mb-3">Subject Rooms</h4>
              <div className="space-y-2">
                {classes.map(cls => (
                  <button key={cls.id} className="w-full text-left px-3 py-2 bg-white rounded hover:bg-cyan-50 text-blue-900">
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const QuizView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Quiz & Practice Section</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-blue-200 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Subject-specific Quizzes</h4>
            <div className="space-y-3">
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <span className="text-blue-900">{cls.name}</span>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg text-sm">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-2 border-purple-200 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Challenge Mode</h4>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Complete tests under timed conditions</p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:shadow-lg w-full">
                  Random Test
                </button>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Compete with peers on leaderboard</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:shadow-lg w-full">
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView />;
      case 'attendance': return <AttendanceView />;
      case 'notes': return <NotesView />;
      case 'tasks': return <TasksView />;
      case 'grades': return <GradesView />;
      case 'study-planner': return <StudyPlannerView />;
      case 'resources': return <ResourcesView />;
      case 'discussion': return <DiscussionView />;
      case 'quiz': return <QuizView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen size={28} />
                Study Buddy
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/20 rounded-lg">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-400 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"></div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs opacity-80">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 mt-16 lg:mt-0 overflow-y-auto`}>
          <nav className="p-4 space-y-2">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudyBuddy;