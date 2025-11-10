import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Users, TrendingUp, Bell, Settings, FileText, CheckSquare, BarChart3, Upload, Search, MessageCircle, LogOut, Home, Menu, X, Edit } from 'lucide-react';
import FileUploadUI from './Upload';
import ResourceLibUpload from './resourcelib_upload';
import AddTaskForm from './todos';
import Quiz from './Quiz';

// Error boundary to catch rendering errors and show fallback UI
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Unhandled render error in StudyBuddy:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred. Please refresh the page or contact support.</p>
            <pre className="text-xs text-red-600 max-h-48 overflow-auto p-2 bg-red-50 rounded">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudyBuddy = ({ username }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user] = useState({ name: username, role: 'Student' });
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [showPendingTasks, setShowPendingTasks] = useState(false);
  const [pendingTasksLoading, setPendingTasksLoading] = useState(true);
  const [pendingTasksError, setPendingTasksError] = useState('');

  // Fetch pending tasks
  const fetchPendingTasks = async () => {
    setPendingTasksLoading(true);
    try {
      console.log('Fetching pending tasks for username:', username); // Debug log
      const response = await fetch(`http://localhost:5000/api/todos/pending?username=${username}`);
      const text = await response.text();
      console.log('Raw response:', text); // Debug log

      const data = JSON.parse(text);
      console.log('Parsed pending tasks data:', data); // Debug log

      if (data.success) {
        setPendingTasksCount(data.count);
        setPendingTasks(data.pending_tasks);
      } else {
        console.error('Failed to fetch pending tasks:', data);
        setPendingTasksError(data.message || 'Failed to fetch pending tasks');
      }
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      setPendingTasksError('Error fetching pending tasks');
    } finally {
      setPendingTasksLoading(false);
    }
  };

  // Fetch pending tasks when component mounts or username changes
  useEffect(() => {
    if (username) {
      fetchPendingTasks();
      
      // Fetch attendance summary
      const fetchAttendanceSummary = async () => {
        try {
          setAttendanceSummaryLoading(true);
          const response = await fetch(`http://localhost:5000/api/attendance_summary/average/${username}`);
          const data = await response.json();
          console.log('Attendance summary response:', data); // Debug log
          if (data.success) {
            setAttendanceSummary(data);
          }
        } catch (error) {
          console.error('Error fetching attendance summary:', error);
        } finally {
          setAttendanceSummaryLoading(false);
        }
      };

      fetchAttendanceSummary();
      // Fetch todo summary (completed/total)
      const fetchTodoSummary = async () => {
        try {
          setTodoSummaryLoading(true);
          const res = await fetch(`http://localhost:5000/api/todo_summary/${username}`);
          const result = await res.json();
          console.log('Todo summary response:', result);
          if (result && result.success) {
            setTodoSummary(result);
          }
        } catch (err) {
          console.error('Error fetching todo summary:', err);
        } finally {
          setTodoSummaryLoading(false);
        }
      };

      fetchTodoSummary();
    }
  }, [username]);




  // New state for attendance fetched from API
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');
  // Attendance summary state
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceSummaryLoading, setAttendanceSummaryLoading] = useState(true);
  const [showAttendanceSummary, setShowAttendanceSummary] = useState(false);
  // Notes state (fetched from backend)
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');
  // fetched todos (replaces hard-coded tasks)
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [todosError, setTodosError] = useState('');
  // Todo summary (completed / total)
  const [todoSummary, setTodoSummary] = useState(null);
  const [todoSummaryLoading, setTodoSummaryLoading] = useState(true);
  // resource library counts
  const [resourceCounts, setResourceCounts] = useState({});
  const [resourceCountsLoading, setResourceCountsLoading] = useState(true);
  const [resourceCountsError, setResourceCountsError] = useState('');
  // resources by selected type
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [resourcesByType, setResourcesByType] = useState([]);
  const [resourcesByTypeLoading, setResourcesByTypeLoading] = useState(false);
  const [resourcesByTypeError, setResourcesByTypeError] = useState('');

  // Fetch total classes summary
  useEffect(() => {
    if (username) {
      const fetchTotalClasses = async () => {
        try {
          setTotalClassesLoading(true);
          const response = await fetch(`http://localhost:5000/api/attendance_summary/total_classes/${username}`);
          const data = await response.json();
          if (data.success) {
            setTotalClassesSummary(data);
          }
        } catch (error) {
          console.error('Error fetching total classes:', error);
        } finally {
          setTotalClassesLoading(false);
        }
      };

      fetchTotalClasses();
    }
  }, [username]);

  // Fetch upcoming classes
  useEffect(() => {
    const fetchUpcomingClasses = async () => {
      try {
        setClassesLoading(true);
        const response = await fetch('http://localhost:5000/api/upcoming_classes');
        const data = await response.json();
        if (data.success) {
          setUpcomingClasses(data.classes);
        } else {
          setClassesError('Failed to fetch classes');
        }
      } catch (error) {
        setClassesError('Error fetching classes: ' + error.message);
      } finally {
        setClassesLoading(false);
      }
    };

    fetchUpcomingClasses();
  }, []);

  // Discussion forum state (fetched from backend)
  const [discussions, setDiscussions] = useState([]);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [discussionsError, setDiscussionsError] = useState('');
  const [expandedDiscussions, setExpandedDiscussions] = useState({});
  const [answerInputs, setAnswerInputs] = useState({});
  const [submittingAnswers, setSubmittingAnswers] = useState({});
  // Add question UI state
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  // liked questions (persist per-browser so a user can like a question only once)
  const [likedQuestions, setLikedQuestions] = useState({});
  const [likingIds, setLikingIds] = useState({});
  // liked answers (persist per-browser so a user can like an answer only once)
  const [likedAnswers, setLikedAnswers] = useState({});
  const [likingAnswerIds, setLikingAnswerIds] = useState({});
  // Chat support states
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;
    
    setIsChatLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ask_cohere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: chatMessage
        })
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success && data.answer) {
        setChatResponse(data.answer);
      } else if (data.error) {
        setChatResponse(data.error);
      } else {
        setChatResponse('Sorry, I could not process your request.');
      }

      // Keep the previous message visible
      // setChatMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      setChatResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      setAttendanceError('');
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/${username}`);
        const text = await res.text().catch(() => '');
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch { json = null; }
        if (!res.ok) {
          const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
          console.error('Attendance fetch failed:', res.status, text, json);
          setAttendanceError(serverMsg);
          setAttendanceData([]);
          return;
        }
        // normalize successful payloads
        if (Array.isArray(json)) setAttendanceData(json);
        else if (json && Array.isArray(json.data)) setAttendanceData(json.data);
        else if (json && json.success && Array.isArray(json.data)) setAttendanceData(json.data);
        else if (json && typeof json === 'object' && !Array.isArray(json)) {
          // if server returned a single object, attempt to extract array fields
          if (Array.isArray(json.data)) setAttendanceData(json.data);
          else {
            // fallback: no records
            setAttendanceData([]);
            if (json.message) setAttendanceError(json.message);
          }
        } else {
          setAttendanceData([]);
        }
      } catch (err) {
        console.error('Attendance fetch error:', err);
        setAttendanceError('API error');
      } finally {
        setAttendanceLoading(false);
      }
    };

    if (username) fetchAttendance();
  }, [username]);

  useEffect(() => {
    const fetchNotes = async () => {
      setNotesLoading(true);
      setNotesError('');
      try {
        const res = await fetch(`http://localhost:5000/api/fetch_notes/${username}`);
        const text = await res.text().catch(() => '');
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch { json = null; }

        if (!res.ok) {
          const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
          console.error('Notes fetch failed:', res.status, text, json);
          setNotesError(serverMsg);
          setNotes([]);
          return;
        }

        // expected shape: { success: true, count: N, notes: [...] }
        if (json && Array.isArray(json.notes)) {
          setNotes(json.notes);
        } else if (Array.isArray(json)) {
          setNotes(json);
        } else {
          setNotes([]);
          if (json && json.message) setNotesError(json.message);
        }
      } catch (err) {
        console.error('Notes fetch error:', err);
        setNotesError('API error');
        setNotes([]);
      } finally {
        setNotesLoading(false);
      }
    };

    if (username) fetchNotes();
  }, [username]);

  useEffect(() => {
    const fetchTodos = async () => {
      setTodosLoading(true);
      setTodosError('');
      try {
        const res = await fetch(`http://localhost:5000/api/fetch_todos/${username}`);
        const text = await res.text().catch(() => '');
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch { json = null; }

        if (!res.ok) {
          const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
          console.error('Todos fetch failed:', res.status, text, json);
          setTodosError(serverMsg);
          setTodos([]);
          return;
        }

        // expected shapes: { success: true, count, todos: [...] } or array of todos
        if (json && Array.isArray(json.todos)) setTodos(json.todos);
        else if (Array.isArray(json)) setTodos(json);
        else if (json && json.success && Array.isArray(json.data)) setTodos(json.data);
        else {
          // attempt to extract likely array fields
          const arr = json && (json.todos || json.data) && Array.isArray(json.todos || json.data) ? (json.todos || json.data) : [];
          setTodos(arr);
          if (!arr.length && json && json.message) setTodosError(json.message);
        }
      } catch (err) {
        console.error('Todos fetch error:', err);
        setTodosError('API error');
        setTodos([]);
      } finally {
        setTodosLoading(false);
      }
    };

    if (username) fetchTodos();
  }, [username]);

  useEffect(() => {
    const fetchResourceCounts = async () => {
      setResourceCountsLoading(true);
      setResourceCountsError('');
      try {
        const res = await fetch('http://localhost:5000/api/fetch_resource_library/type_count');
        const text = await res.text().catch(() => '');
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch { json = null; }

        if (!res.ok) {
          const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
          console.error('Resource counts fetch failed:', res.status, text, json);
          setResourceCountsError(serverMsg);
          setResourceCounts({});
          return;
        }

        if (json && typeof json.type_counts === 'object') {
          setResourceCounts(json.type_counts);
        } else {
          setResourceCounts({});
          if (json && json.message) setResourceCountsError(json.message);
        }
      } catch (err) {
        console.error('Resource counts fetch error:', err);
        setResourceCountsError('API error');
        setResourceCounts({});
      } finally {
        setResourceCountsLoading(false);
      }
    };

    fetchResourceCounts();
  }, []);
  // fetch resources for a given type when user clicks a card
  const fetchResourcesByType = async (type) => {
    setSelectedResourceType(type);
    setResourcesByType([]);
    setResourcesByTypeError('');
    setResourcesByTypeLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/fetch_resource_library/type/${encodeURIComponent(type)}`);
      const text = await res.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!res.ok) {
        const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
        console.error('Resources by type fetch failed:', res.status, text, json);
        setResourcesByTypeError(serverMsg);
        setResourcesByType([]);
        return;
      }

      // expected: { success: true, count: N, resources: [...] }
      if (json && Array.isArray(json.resources)) setResourcesByType(json.resources);
      else if (Array.isArray(json)) setResourcesByType(json);
      else setResourcesByType([]);
    } catch (err) {
      console.error('Resources by type fetch error:', err);
      setResourcesByTypeError('API error');
      setResourcesByType([]);
    } finally {
      setResourcesByTypeLoading(false);
    }
  };

  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState('');
  const [totalClassesSummary, setTotalClassesSummary] = useState(null);
  const [totalClassesLoading, setTotalClassesLoading] = useState(true);
  const [showTotalClassesDetails, setShowTotalClassesDetails] = useState(false);
  const [cgpaData, setCgpaData] = useState(null);
  const [cgpaLoading, setCgpaLoading] = useState(true);
  const [showCgpaModal, setShowCgpaModal] = useState(false);
  const [showAddCgpaModal, setShowAddCgpaModal] = useState(false);
  const [semester, setSemester] = useState('');
  const [sgpa, setSgpa] = useState('');
  const [updateCgpaLoading, setUpdateCgpaLoading] = useState(false);
  const [sgpaValues, setSgpaValues] = useState({
    sem1: '',
    sem2: '',
    sem3: '',
    sem4: '',
    sem5: '',
    sem6: '',
    sem7: '',
    sem8: ''
  });
  const [addCgpaLoading, setAddCgpaLoading] = useState(false);

  const handleAddCgpa = async () => {
    try {
      setAddCgpaLoading(true);
      const cleanedSgpa = Object.fromEntries(
        Object.entries(sgpaValues)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => [key, parseFloat(value)])
      );

      const response = await fetch('http://localhost:5000/api/cgpa_distribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          sgpa: cleanedSgpa
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCgpaData(updatedData);
        setShowAddCgpaModal(false);
        setSgpaValues({
          sem1: '',
          sem2: '',
          sem3: '',
          sem4: '',
          sem5: '',
          sem6: '',
          sem7: '',
          sem8: ''
        });
      } else {
        console.error('Failed to add CGPA');
      }
    } catch (error) {
      console.error('Error adding CGPA:', error);
    } finally {
      setAddCgpaLoading(false);
    }
  };

  const handleCgpaUpdate = async () => {
    try {
      setUpdateCgpaLoading(true);
      const response = await fetch(`http://localhost:5000/api/cgpa_distribution/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semester: semester,
          sgpa: parseFloat(sgpa)
        })
      });

      if (response.ok) {
        // Refresh CGPA data after update
        const updatedData = await response.json();
        setCgpaData(updatedData);
        setShowCgpaModal(false);
        setSemester('');
        setSgpa('');
      } else {
        console.error('Failed to update CGPA');
      }
    } catch (error) {
      console.error('Error updating CGPA:', error);
    } finally {
      setUpdateCgpaLoading(false);
    }
  };

  // Fetch CGPA data from grades API
  useEffect(() => {
    const fetchCGPA = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/grades/cgpa');
        const data = await response.json();
        setCgpaData(data);
      } catch (error) {
        console.error('Error fetching CGPA:', error);
      } finally {
        setCgpaLoading(false);
      }
    };
    
    fetchCGPA();
  }, []);

  // Fetch CGPA data from distribution API
  useEffect(() => {
    const fetchCGPADistribution = async () => {
      if (!username) return;
      try {
        const response = await fetch(`http://localhost:5000/api/cgpa_distribution/${username}`);
        const data = await response.json();
        if (data.success && data.data) {
          setCgpaData(data.data);
        }
      } catch (error) {
        console.error('Error fetching CGPA distribution:', error);
      } finally {
        setCgpaLoading(false);
      }
    };
    
    fetchCGPADistribution();
  }, [username]);

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
            <span className="text-2xl font-bold text-gray-800">
              {totalClassesLoading ? '...' : totalClassesSummary?.total_classes_conducted || 0}
            </span>
          </div>
          <h3 className="text-gray-800 font-semibold">Total Classes</h3>
          <button 
            onClick={() => setShowTotalClassesDetails(true)} 
            className="text-sm text-blue-600 mt-1 hover:text-blue-800"
          >
            View details
          </button>

          {showTotalClassesDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Classes Summary</h3>
                    <button 
                      onClick={() => setShowTotalClassesDetails(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-900 font-medium">Total Classes Conducted</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalClassesSummary?.total_classes_conducted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-green-900 font-medium">Classes Attended</span>
                    <span className="text-2xl font-bold text-green-900">
                      {totalClassesSummary?.total_classes_attended || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-red-900 font-medium">Classes Missed</span>
                    <span className="text-2xl font-bold text-red-900">
                      {totalClassesSummary?.total_classes_missed || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {attendanceSummaryLoading ? '...' : 
               attendanceSummary ? `${Number(attendanceSummary.average_attendance_percentage).toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <h3 className="text-gray-800 font-semibold">Avg Attendance</h3>
          <button 
            onClick={() => setShowAttendanceSummary(true)} 
            className="text-sm text-blue-600 mt-1 hover:text-blue-800"
          >
            View details
          </button>

          {showAttendanceSummary && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Attendance Summary</h3>
                    <button 
                      onClick={() => setShowAttendanceSummary(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-900 font-medium">Average Attendance</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {attendanceSummary ? `${Number(attendanceSummary.average_attendance_percentage).toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-purple-900 font-medium">Total Subjects</span>
                    <span className="text-2xl font-bold text-purple-900">
                      {attendanceSummary ? attendanceSummary.total_subjects : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-red-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {pendingTasksLoading ? '...' : pendingTasksCount}
            </span>
          </div>
          <h3 className="text-gray-800 font-semibold">Pending Tasks</h3>
          <button 
            onClick={() => setShowPendingTasks(true)} 
            className="text-sm text-blue-600 mt-1 hover:text-blue-800"
          >
            View details
          </button>

          {/* Pending Tasks Modal */}
          {showPendingTasks && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Pending Tasks</h3>
                    <button 
                      onClick={() => setShowPendingTasks(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto">
                  {pendingTasksLoading ? (
                    <div className="text-center py-4">Loading tasks...</div>
                  ) : pendingTasksError ? (
                    <div className="text-center py-4 text-red-600">{pendingTasksError}</div>
                  ) : pendingTasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">No pending tasks found</div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTasks.map(task => (
                        <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{task.task}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Due: {task.due_date}</p>
                            <p>Category: {task.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                <p className="text-2xl font-bold">
                  {attendanceSummaryLoading ? '...' : attendanceSummary ? `${Number(attendanceSummary.average_attendance_percentage).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Tasks Done</p>
                <p className="text-2xl font-bold">
                  {todoSummary ? `${todoSummary.completed_tasks}/${todoSummary.total_tasks}` : '0/0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Overall Performance</p>
                <p className="text-2xl font-bold">
                  {cgpaLoading ? '...' : cgpaData ? `${cgpaData.cgpa.toFixed(2)}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Upcoming Classes</h3>
              <button 
                className="text-blue-600 text-sm font-semibold hover:text-blue-800"
                onClick={() => setShowAllClasses(!showAllClasses)}
              >
                {showAllClasses ? 'Show Less' : 'View All'}
              </button>
            </div>
            <div className="space-y-3">
              {classesLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : classesError ? (
                <div className="text-center py-4 text-red-600">{classesError}</div>
              ) : (
                (showAllClasses ? upcomingClasses : upcomingClasses.slice(0, 3)).map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${cls.type === 'lab' ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                        <FileText className={`${cls.type === 'lab' ? 'text-purple-600' : 'text-blue-600'}`} size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{cls.subject}</p>
                        <p className="text-sm text-gray-500">{`${cls.day}, ${cls.time}`}</p>
                        <p className="text-xs text-gray-400">{cls.faculty_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cls.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {cls.type === 'lab' ? 'Lab' : 'Theory'}
                      </span>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative p-5 rounded-2xl bg-purple-50 hover:shadow-lg cursor-pointer"
                onClick={() => setCurrentView('upload')}
                role="button"
              >
                <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Edit size={12} className="text-gray-500" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center text-white">
                    <Upload size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-purple-900">Upload</div>
                    <div className="text-xs text-gray-600">New Report</div>
                  </div>
                </div>
              </div>

              <div
                className="relative p-5 rounded-2xl bg-green-50 hover:shadow-lg cursor-pointer"
                onClick={() => setCurrentView('resource-upload')}
                role="button"
              >
                <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Edit size={12} className="text-gray-500" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center text-white">
                    <Upload size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-900">Upload Resource</div>
                    <div className="text-xs text-gray-600">New Material</div>
                  </div>
                </div>
              </div>

              <div
                className="relative p-5 rounded-2xl bg-pink-50 hover:shadow-lg cursor-pointer"
                onClick={() => setCurrentView('quiz')}
                role="button"
              >
                <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Edit size={12} className="text-gray-500" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center text-white">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-pink-900">Quiz</div>
                    <div className="text-xs text-gray-600">Practice & Tests</div>
                  </div>
                </div>
              </div>

              <div
                className="relative p-5 rounded-2xl bg-blue-50 hover:shadow-lg cursor-pointer"
                onClick={() => setShowChat(true)}
                role="button"
              >
                <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Edit size={12} className="text-gray-500" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-lg flex items-center justify-center text-white">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-sky-900">Support</div>
                    <div className="text-xs text-gray-600">Get Help</div>
                  </div>
                </div>
              </div>
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

          {/* Chat Support Interface */}
          {showChat && (
            <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50 border-2 border-blue-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-900">AI Support</h3>
                  <button
                    onClick={() => {
                      setShowChat(false);
                      setChatMessage('');
                      setChatResponse('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {!chatResponse && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-900">👋 Hello! How can I help you today?</p>
                    </div>
                  )}
                  {chatMessage && (
                    <div className="bg-purple-50 p-3 rounded-lg ml-8">
                      <p className="text-purple-900">{chatMessage}</p>
                    </div>
                  )}
                  {chatResponse && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-900">{chatResponse}</p>
                    </div>
                  )}
                  {isChatLoading && (
                    <div className="flex items-center space-x-2 p-3">
                      <div className="animate-pulse">⋯</div>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={isChatLoading || !chatMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const [showAddAttendance, setShowAddAttendance] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    subjectName: '',
    classesConducted: '',
    classesAttended: ''
  });
  const [addingAttendance, setAddingAttendance] = useState(false);

  // Update attendance state
  const [showUpdateAttendance, setShowUpdateAttendance] = useState(false);
  const [updateAttendance, setUpdateAttendance] = useState({
    subjectName: '',
    newClassTaken: '',
    newClassesAttended: ''
  });
  const [updatingAttendance, setUpdatingAttendance] = useState(false);

  const handleAddAttendance = async () => {
    if (!newAttendance.subjectName || !newAttendance.classesConducted || !newAttendance.classesAttended) return;
    
    setAddingAttendance(true);
    try {
      const response = await fetch('http://localhost:5000/api/add_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          subjectName: newAttendance.subjectName,
          classesConducted: parseInt(newAttendance.classesConducted),
          classesAttended: parseInt(newAttendance.classesAttended)
        })
      });

      if (response.ok) {
        // Reset form and close modal
        setNewAttendance({
          subjectName: '',
          classesConducted: '',
          classesAttended: ''
        });
        setShowAddAttendance(false);
        // Refresh attendance data
        const attendanceRes = await fetch(`http://localhost:5000/api/attendance/${username}`);
        const data = await attendanceRes.json();
        setAttendanceData(Array.isArray(data) ? data : data.data || []);
      } else {
        const error = await response.json();
        setAttendanceError(error.message || 'Failed to add attendance');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      setAttendanceError('Failed to add attendance');
    } finally {
      setAddingAttendance(false);
    }
  };

  const handleUpdateAttendance = async () => {
    if (!updateAttendance.subjectName || updateAttendance.newClassTaken === '' || updateAttendance.newClassesAttended === '') return;

    setUpdatingAttendance(true);
    try {
      const response = await fetch('http://localhost:5000/api/update_attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          subjectName: updateAttendance.subjectName,
          newClassTaken: parseInt(updateAttendance.newClassTaken, 10),
          newClassesAttended: parseInt(updateAttendance.newClassesAttended, 10)
        })
      });

      if (response.ok) {
        setShowUpdateAttendance(false);
        setUpdateAttendance({ subjectName: '', newClassTaken: '', newClassesAttended: '' });
        // refresh attendance data
        try {
          const attendanceRes = await fetch(`http://localhost:5000/api/attendance/${username}`);
          const text = await attendanceRes.text().catch(() => '');
          let data = null;
          try { data = text ? JSON.parse(text) : null; } catch { data = null; }
          if (attendanceRes.ok) {
            setAttendanceData(Array.isArray(data) ? data : data?.data || []);
            setAttendanceError('');
          } else {
            const serverMsg = (data && (data.message || data.error)) || text || `Status ${attendanceRes.status}`;
            setAttendanceError(serverMsg);
          }
        } catch (err) {
          console.error('Failed to refresh attendance after update:', err);
        }
      } else {
        const errBody = await response.text().catch(() => '');
        let errJson = null;
        try { errJson = errBody ? JSON.parse(errBody) : null; } catch { errJson = null; }
        setAttendanceError(errJson?.message || errJson?.error || errBody || 'Failed to update attendance');
      }
    } catch (err) {
      console.error('Update attendance error:', err);
      setAttendanceError('Failed to update attendance');
    } finally {
      setUpdatingAttendance(false);
    }
  };

  const AttendanceView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-900">Attendance Records</h3>
          <button
            onClick={() => setShowAddAttendance(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg"
          >
            + Add Subject
          </button>
        </div>
        <div className="overflow-x-auto">
          {attendanceLoading ? (
            <div className="p-4">Loading...</div>
          ) : attendanceError ? (
            <div className="p-4 text-red-600">Error: {attendanceError}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
                <tr>
                  <th className="px-4 py-3 text-left text-white">Subject</th>
                  <th className="px-4 py-3 text-left text-white">Attendance %</th>
                  <th className="px-4 py-3 text-left text-white">Safe Bunk</th>
                  <th className="px-4 py-3 text-left text-white">Classes Missed</th>
                  <th className="px-4 py-3 text-left text-white">Status</th>
                  <th className="px-4 py-3 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-600">No attendance records</td></tr>
                ) : (
                  attendanceData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cyan-50">
                      <td className="px-4 py-3 text-blue-900">{item.subject_name ?? item.subject ?? item.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full"
                              style={{ width: `${item.attendance_percentage ?? item.attendance ?? 0}%` }}
                            ></div>
                          </div>
                          <span className="text-blue-900">{item.attendance_percentage ?? item.attendance ?? 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-blue-900">{item.safe_bunk ?? item.safeBunk ?? 0}</td>
                      <td className="px-4 py-3 text-blue-900">{item.classes_missed ?? item.classesMissed ?? Math.floor(((100 - (item.attendance_percentage ?? item.attendance ?? 0)) / 5))}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          (item.status ?? (item.attendance_percentage ?? item.attendance ?? 0) >= 85 ? 'Safe' : 'Warning') === 'Safe' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {item.status ?? ((item.attendance_percentage ?? item.attendance ?? 0) >= 85 ? 'Safe' : 'Warning')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const subj = item.subject_name ?? item.subject ?? item.name;
                            setUpdateAttendance({ subjectName: subj, newClassTaken: '', newClassesAttended: '' });
                            setShowUpdateAttendance(true);
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add New Attendance Modal */}
        {showAddAttendance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Add New Subject Attendance</h3>
                  <button 
                    onClick={() => setShowAddAttendance(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name
                  </label>
                  <select
                    value={newAttendance.subjectName}
                    onChange={(e) => setNewAttendance(prev => ({ ...prev, subjectName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Theory of Computation">Theory of Computation</option>
                    <option value="SE & PM">SE & PM</option>
                    <option value="DV Lab">DV Lab</option>
                    <option value="BCA (ETC)">BCA (ETC)</option>
                    <option value="UHV">UHV</option>
                    <option value="FSD Lab">FSD Lab</option>
                    <option value="DBMS Lab">DBMS Lab</option>
                    <option value="DSP (AEC)">DSP (AEC)</option>
                    <option value="NSS">NSS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classes Conducted
                  </label>
                  <input
                    type="number"
                    value={newAttendance.classesConducted}
                    onChange={(e) => setNewAttendance(prev => ({ ...prev, classesConducted: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter total classes conducted"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classes Attended
                  </label>
                  <input
                    type="number"
                    value={newAttendance.classesAttended}
                    onChange={(e) => setNewAttendance(prev => ({ ...prev, classesAttended: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter classes attended"
                    min="0"
                    max={newAttendance.classesConducted}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowAddAttendance(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAttendance}
                    disabled={addingAttendance || !newAttendance.subjectName || !newAttendance.classesConducted || !newAttendance.classesAttended}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {addingAttendance ? 'Adding...' : 'Add Attendance'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const NotesView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">My Notes</h3>
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg"
            onClick={() => setCurrentView('upload')}
          >
            + New Note
          </button>
        </div>

        {notesLoading ? (
          <div className="p-4">Loading notes...</div>
        ) : notesError ? (
          <div className="p-4 text-red-600">Error: {notesError}</div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-gray-600">No notes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <div
                key={note._id}
                className="border-2 border-blue-200 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (note.drive_link) window.open(note.drive_link, '_blank', 'noopener,noreferrer');
                }}
                title={note.drive_link || 'Open note'}
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="text-blue-600" size={24} />
                  <span className="text-xs text-gray-500">{new Date(note.created_at || note.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-blue-900 mb-2">{note.subject}</h4>
                <p className="text-sm text-gray-600 mb-3">{note.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); if (note.drive_link) window.open(note.drive_link, '_blank', 'noopener,noreferrer'); }}
                    className="text-xs px-3 py-1 bg-cyan-100 text-blue-900 rounded-full"
                  >
                    Open
                  </button>
                  <a
                    href={note.drive_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-900 rounded-full"
                  >
                    View Drive
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (response.ok) {
        // Update the local state to reflect the change
        setTodos(prevTodos => 
          prevTodos.map(task => 
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const TasksView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">To-Do List & Task Tracker</h3>
          <button onClick={() => setCurrentView('todos')} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg">
            + Add Task
          </button>
        </div>
        
        <div className="space-y-3">
          {todosLoading ? (
            <div className="p-4 text-gray-600">Loading tasks...</div>
          ) : todosError ? (
            <div className="p-4 text-red-600">Error: {todosError}</div>
          ) : todos.length === 0 ? (
            <div className="p-4 text-gray-600">No tasks found.</div>
          ) : (
            todos.map((task, idx) => (
              <div key={task._id ?? task.id ?? idx} className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:shadow-md">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked={task.done ?? task.completed ?? false} />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">{task.task ?? task.title ?? task.name ?? 'Untitled task'}</p>
                  <p className="text-sm text-gray-600">Due: {task.due_date ?? task.deadline ?? task.due ?? task.due_in ?? 'TBD'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${ (String(task.priority ?? '').toLowerCase()) === 'high' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800' }`}>
                  {task.priority ?? 'normal'}
                </span>
                <select
                  value={task.status || 'pending'}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs border-none focus:ring-2 focus:ring-blue-300 cursor-pointer
                    ${task.status === 'completed' ? 'bg-green-200 text-green-800' :
                      task.status === 'progress' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const GradesView = () => {
    const [cgpaData, setCgpaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [updateData, setUpdateData] = useState({ semester: '', sgpaValue: '' });
    const [addData, setAddData] = useState({
      username: username,
      sgpa: {
        sem1: '',
        sem2: '',
        sem3: '',
        sem4: '',
        sem5: '',
        sem6: '',
        sem7: '',
        sem8: ''
      }
    });

    const fetchCGPAData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cgpa_distribution/${username}`);
        const result = await response.json();
        if (result.success) {
          setCgpaData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch CGPA data');
      } finally {
        setLoading(false);
      }
    };

    const handleUpdateSGPA = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cgpa_distribution/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            semester: updateData.semester,
            sgpaValue: parseFloat(updateData.sgpaValue)
          })
        });
        const result = await response.json();
        if (result.success) {
          fetchCGPAData();
          setShowUpdateModal(false);
          setUpdateData({ semester: '', sgpaValue: '' });
        }
      } catch (err) {
        console.error('Failed to update SGPA:', err);
      }
    };

    const handleAddSGPA = async () => {
      try {
        const cleanedSgpa = Object.fromEntries(
          Object.entries(addData.sgpa).filter(([_, value]) => value !== '')
        );
        
        const response = await fetch('http://localhost:5000/api/cgpa_distribution', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: addData.username,
            sgpa: cleanedSgpa
          })
        });
        const result = await response.json();
        if (result.success) {
          fetchCGPAData();
          setShowAddModal(false);
        }
      } catch (err) {
        console.error('Failed to add SGPA:', err);
      }
    };

    useEffect(() => {
      fetchCGPAData();
    }, [username]);

    return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Grades & Performance Tracker</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Overall Performance</h4>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-900 mb-2">
                {loading ? '...' : cgpaData ? cgpaData.cgpa.toFixed(2) : 'N/A'}
              </div>
              <p className="text-gray-600">CGPA</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-900">CGPA Distribution</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddCgpaModal(true)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Add CGPA
                </button>
                <button
                  onClick={() => setShowCgpaModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Update CGPA
                </button>
              </div>
            </div>

            {/* Add CGPA Modal */}
            {showAddCgpaModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                  <h3 className="text-lg font-semibold mb-4">Add CGPA</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {Object.keys(sgpaValues).map((sem) => (
                      <div key={sem}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {sem.charAt(0).toUpperCase() + sem.slice(1)} SGPA
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sgpaValues[sem]}
                          onChange={(e) => setSgpaValues(prev => ({
                            ...prev,
                            [sem]: e.target.value
                          }))}
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Enter SGPA"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAddCgpaModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCgpa}
                      disabled={addCgpaLoading || Object.values(sgpaValues).every(v => v === '')}
                      className={`px-4 py-2 bg-green-600 text-white rounded-md ${
                        addCgpaLoading || Object.values(sgpaValues).every(v => v === '')
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-green-700'
                      }`}
                    >
                      {addCgpaLoading ? 'Adding...' : 'Add CGPA'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CGPA Update Modal */}
            {showCgpaModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                  <h3 className="text-lg font-semibold mb-4">Update CGPA</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option value="">Select Semester</option>
                        <option value="SEM1">Semester 1</option>
                        <option value="SEM2">Semester 2</option>
                        <option value="SEM3">Semester 3</option>
                        <option value="SEM4">Semester 4</option>
                        <option value="SEM5">Semester 5</option>
                        <option value="SEM6">Semester 6</option>
                        <option value="SEM7">Semester 7</option>
                        <option value="SEM8">Semester 8</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SGPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={sgpa}
                        onChange={(e) => setSgpa(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Enter SGPA"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCgpaModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCgpaUpdate}
                      disabled={!semester || !sgpa || updateCgpaLoading}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                        (!semester || !sgpa || updateCgpaLoading)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-700'
                      }`}
                    >
                      {updateCgpaLoading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : !cgpaData ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No CGPA data available</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Semester Results
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(cgpaData.sgpa).map(([sem, value]) => (
                  value !== null && (
                    <div key={sem} className="flex items-center gap-2">
                      <span className="text-sm text-blue-900 w-20">{sem.toUpperCase()}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full" 
                          style={{width: `${(value/10)*100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-blue-900 w-12">{value}</span>
                      {value === null && (
                        <button
                          onClick={() => {
                            setUpdateData({ semester: sem, sgpaValue: '' });
                            setShowUpdateModal(true);
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Update SGPA Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Update Semester SGPA</h3>
                <button 
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={updateData.sgpaValue}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, sgpaValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter SGPA (0-10)"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSGPA}
                  disabled={!updateData.sgpaValue}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Update SGPA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add SGPA Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Semester Results</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {Object.keys(addData.sgpa).map((sem) => (
                <div key={sem}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {sem.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={addData.sgpa[sem]}
                    onChange={(e) => setAddData(prev => ({
                      ...prev,
                      sgpa: { ...prev.sgpa, [sem]: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter SGPA (0-10)"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSGPA}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
                    {/* Keep static example schedule — deadlines are shown in Upcoming Deadlines below */}
                    Study sessions: plan your week
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-2 border-purple-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Upcoming Deadlines</h4>
            <div className="space-y-3">
              {todosLoading ? (
                <div className="p-3 text-gray-600">Loading tasks...</div>
              ) : todosError ? (
                <div className="p-3 text-red-600">Error: {todosError}</div>
              ) : todos.length === 0 ? (
                <div className="p-3 text-gray-600">No upcoming tasks.</div>
              ) : (
                todos.map((task, idx) => (
                  <div key={task._id ?? task.id ?? idx} className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-900">{task.task ?? task.title ?? task.name ?? 'Untitled task'}</p>
                    <p className="text-sm text-gray-600">{task.due_date ?? task.deadline ?? task.due ?? task.due_in ?? 'No deadline'}</p>
                  </div>
                ))
              )}
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
          <button
            type="button"
            onClick={() => setCurrentView('resource-upload')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2"
          >
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
          {(() => {
            const types = ['PRINTED PDF', 'WRITTEN NOTES', 'PAST PAPER'];
            if (resourceCountsLoading) {
              return <div className="col-span-3 p-4 text-gray-600">Loading resource counts...</div>;
            }
            if (resourceCountsError) {
              return <div className="col-span-3 p-4 text-red-600">Error: {resourceCountsError}</div>;
            }
            // if user selected a type, show resource list instead of cards
            if (selectedResourceType) {
              return (
                <div className="col-span-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">{selectedResourceType}</h4>
                    <button
                      onClick={() => { setSelectedResourceType(null); setResourcesByType([]); setResourcesByTypeError(''); }}
                      className="text-sm px-3 py-1 bg-gray-100 rounded"
                    >
                      Back
                    </button>
                  </div>

                  {resourcesByTypeLoading ? (
                    <div className="p-4 text-gray-600">Loading resources...</div>
                  ) : resourcesByTypeError ? (
                    <div className="p-4 text-red-600">Error: {resourcesByTypeError}</div>
                  ) : resourcesByType.length === 0 ? (
                    <div className="p-4 text-gray-600">No resources found for {selectedResourceType}.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resourcesByType.map(r => (
                        <div key={r._id} className="border-2 border-blue-200 p-4 rounded-lg hover:shadow-md cursor-pointer" onClick={() => r.drive_link && window.open(r.drive_link, '_blank', 'noopener,noreferrer')}>
                          <h5 className="font-semibold text-blue-900 mb-1">{r.subject}</h5>
                          <p className="text-sm text-gray-600 mb-2">{r.title}</p>
                          <p className="text-xs text-gray-500 mb-3">Shared by: <span className="font-medium text-gray-700">{r.username}</span></p>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); r.drive_link && window.open(r.drive_link, '_blank', 'noopener,noreferrer'); }} className="px-3 py-1 bg-cyan-100 text-blue-900 text-sm rounded">Open</button>
                            <a href={r.drive_link || '#'} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-purple-100 text-purple-900 text-sm rounded">View Drive</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return types.map((type) => (
              <div
                key={type}
                role="button"
                tabIndex={0}
                onClick={() => fetchResourcesByType(type)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fetchResourcesByType(type)}
                className="border-2 border-blue-200 p-6 rounded-lg hover:shadow-lg transition-shadow text-center cursor-pointer"
              >
                <FileText className="mx-auto text-blue-600 mb-3" size={48} />
                <h4 className="font-bold text-blue-900 mb-2">{type}</h4>
                <p className="text-sm text-gray-600 mb-4">{resourceCounts[type] ?? 0} files</p>
                <div className="px-4 py-2 bg-cyan-100 text-blue-900 rounded-lg">Browse</div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );

  // Define fetchDiscussions at component level so it's accessible everywhere
  const fetchDiscussions = async () => {
    setDiscussionsLoading(true);
    setDiscussionsError('');
    try {
      const res = await fetch('http://localhost:5000/api/discussion_forum');
      if (!res.ok) {
        throw new Error('Failed to fetch discussions');
      }
      const data = await res.json();
      setDiscussions(Array.isArray(data) ? data : data.discussions || []);
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
      setDiscussionsError('Failed to load discussions');
      setDiscussions([]);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  // Initial fetch of discussions
  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Handler: add a new question (POST)
  const handleAddQuestion = async () => {
    if (!newQuestionText?.trim()) return;
    setSubmittingQuestion(true);
    try {
      const res = await fetch('http://localhost:5000/api/discussion_forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, question: newQuestionText.trim() })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add question');
      }

      // success: clear input, close UI, refresh list
      setNewQuestionText('');
      setShowAddQuestion(false);
      setDiscussionsError('');
      await fetchDiscussions();
    } catch (err) {
      console.error('Add question error:', err);
      setDiscussionsError(err.message || 'Failed to add question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // initialize likedQuestions from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('likedQuestions');
      if (raw) setLikedQuestions(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to read likedQuestions from localStorage', err);
    }
  }, []);

  // initialize likedAnswers from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('likedAnswers');
      if (raw) setLikedAnswers(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to read likedAnswers from localStorage', err);
    }
  }, []);

  const handleLikeQuestion = async (id) => {
    if (!id) return;
    // already liked locally -> ignore
    if (likedQuestions[id]) return;

    // mark as in-progress
    setLikingIds(prev => ({ ...prev, [id]: true }));

    try {
      const url = `http://localhost:5000/api/discussion_forum/${encodeURIComponent(id)}/like`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'question' })
      });

      const text = await res.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!res.ok) {
        const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
        console.error('Like request failed:', serverMsg);
        setDiscussionsError(serverMsg);
        return;
      }

      // success: optimistically update local UI (increment likes)
      setDiscussions(prev => prev.map(d => d._id === id ? { ...d, likes: (d.likes ?? 0) + 1 } : d));

      // persist liked flag locally so the user can't like again
      const next = { ...(likedQuestions || {}), [id]: true };
      setLikedQuestions(next);
      try { localStorage.setItem('likedQuestions', JSON.stringify(next)); } catch (err) { console.error('Failed to persist likedQuestions', err); }
    } catch (err) {
      console.error('Like request error:', err);
      setDiscussionsError('API error');
    } finally {
      setLikingIds(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleLikeAnswer = async (questionId, answerId) => {
    if (!questionId || !answerId) return;
    if (likedAnswers[answerId]) return; // already liked locally

    setLikingAnswerIds(prev => ({ ...prev, [answerId]: true }));

    try {
      const url = `http://localhost:5000/api/discussion_forum/${encodeURIComponent(questionId)}/like`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'answer', answer_id: answerId })
      });

      const text = await res.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!res.ok) {
        const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
        console.error('Answer like request failed:', serverMsg);
        setDiscussionsError(serverMsg);
        return;
      }

      // success: optimistically update the answer's likes in state
      setDiscussions(prev => prev.map(d => {
        if (d._id !== questionId) return d;
        const answers = Array.isArray(d.answers) ? d.answers.map(a => {
          const aid = a._id || a.answer_id;
          if (aid === answerId) return { ...a, likes: (a.likes ?? 0) + 1 };
          return a;
        }) : d.answers;
        return { ...d, answers };
      }));

      const next = { ...(likedAnswers || {}), [answerId]: true };
      setLikedAnswers(next);
      try { localStorage.setItem('likedAnswers', JSON.stringify(next)); } catch (err) { console.error('Failed to persist likedAnswers', err); }
    } catch (err) {
      console.error('Answer like request error:', err);
      setDiscussionsError('API error');
    } finally {
      setLikingAnswerIds(prev => {
        const copy = { ...prev };
        delete copy[answerId];
        return copy;
      });
    }
  };

  const toggleAnswers = (id) => {
    setExpandedDiscussions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const DiscussionView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-900">Discussion Forum / Community</h3>
          <div>
            <button
              onClick={() => { setShowAddQuestion(true); setNewQuestionText(''); }}
              className="text-sm px-3 py-1 bg-purple-50 text-gray-700 rounded"
            >
              Add Question
            </button>
          </div>
        </div>

        {showAddQuestion && (
          <div className="mb-4 p-4 bg-gray-50 rounded border border-blue-100">
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Write your question here..."
              className="w-full p-3 border border-blue-200 rounded-lg text-sm"
              rows={3}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setShowAddQuestion(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestionText?.trim() || submittingQuestion}
                className={`px-3 py-1 text-white rounded ${submittingQuestion ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}
              >
                {submittingQuestion ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {discussionsLoading ? (
            <div className="p-4 text-gray-600">Loading discussions...</div>
          ) : discussionsError ? (
            <div className="p-4 text-red-600">Error: {discussionsError}</div>
          ) : discussions.length === 0 ? (
            <div className="p-4 text-gray-600">No discussions found.</div>
          ) : (
            <div className="space-y-4">
              {discussions.map(d => (
                <div key={d._id} className="border-2 border-blue-200 p-4 rounded-lg hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">{(d.username || 'U').charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-blue-900">{d.username || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">{d.timestamp ? new Date(d.timestamp).toLocaleString() : 'Unknown time'}</span>
                      </div>
                      <p className="text-blue-900 mb-3">{d.question}</p>
                      <div className="flex items-center gap-3">
                        {(function(){
                          const isLiked = Boolean(likedQuestions[d._id]);
                          const isLiking = Boolean(likingIds[d._id]);
                          return (
                            <button
                              aria-label="Like"
                              onClick={() => handleLikeQuestion(d._id)}
                              disabled={isLiked || isLiking}
                              className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${isLiked ? 'bg-yellow-200 text-yellow-900' : 'bg-yellow-50 text-gray-700'} ${isLiking ? 'opacity-60 cursor-wait' : ''}`}
                            >
                              <span>👍</span>
                              <span className="text-xs">{d.likes ?? 0}</span>
                            </button>
                          );
                        })()}
                        <button onClick={() => toggleAnswers(d._id)} className="text-sm px-3 py-1 bg-cyan-50 text-gray-700 rounded">
                          {expandedDiscussions[d._id] ? 'Hide Answers' : `View Answers (${(d.answers && d.answers.length) || 0})`}
                        </button>
                        <button 
                          onClick={() => {
                            setExpandedDiscussions(prev => ({ ...prev, [d._id]: true }));
                            setAnswerInputs(prev => ({ ...prev, [d._id]: prev[d._id] || '' }));
                          }} 
                          className="text-sm px-3 py-1 bg-purple-50 text-gray-700 rounded"
                        >
                          Add Answer
                        </button>
                      </div>

                      {expandedDiscussions[d._id] && (
                        <div className="mt-4 space-y-3">
                          <div className="mb-3">
                            <textarea
                              value={answerInputs[d._id] || ''}
                              onChange={(e) => setAnswerInputs(prev => ({ ...prev, [d._id]: e.target.value }))}
                              placeholder="Write your answer here..."
                              className="w-full p-3 border border-blue-200 rounded-lg text-sm"
                              rows="3"
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={async () => {
                                  if (!answerInputs[d._id]?.trim()) return;
                                  
                                  setSubmittingAnswers(prev => ({ ...prev, [d._id]: true }));
                                  try {
                                    const res = await fetch(`http://localhost:5000/api/discussion_forum/${encodeURIComponent(d._id)}/answer`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        username: username,
                                        answer: answerInputs[d._id].trim()
                                      })
                                    });

                                    const text = await res.text();
                                    let json;
                                    try {
                                      json = JSON.parse(text);
                                    } catch {
                                      json = null;
                                    }

                                    // Check if response contains success flag
                                    if (json && json.success) {
                                      // Clear input and refresh discussions
                                      setAnswerInputs(prev => ({ ...prev, [d._id]: '' }));
                                      setDiscussionsError('');
                                      fetchDiscussions();
                                    } else if (!res.ok) {
                                      throw new Error(json?.message || 'Failed to submit answer');
                                    } else {
                                      // Response was ok but didn't have success flag
                                      setAnswerInputs(prev => ({ ...prev, [d._id]: '' }));
                                      setDiscussionsError('');
                                      fetchDiscussions();
                                    }
                                  } catch (err) {
                                    console.error('Answer submission error:', err);
                                    setDiscussionsError(err.message || 'Failed to submit answer');
                                  } finally {
                                    setSubmittingAnswers(prev => ({ ...prev, [d._id]: false }));
                                  }
                                }}
                                disabled={!answerInputs[d._id]?.trim() || submittingAnswers[d._id]}
                                className={`px-4 py-2 text-sm text-white rounded-lg ${!answerInputs[d._id]?.trim() || submittingAnswers[d._id] 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'}`}
                              >
                                {submittingAnswers[d._id] ? 'Submitting...' : 'Submit Answer'}
                              </button>
                            </div>
                          </div>

                          {(!d.answers || d.answers.length === 0) ? (
                            <div className="text-sm text-gray-600">No answers yet.</div>
                          ) : (
                            d.answers.map(ans => (
                              <div key={ans.answer_id || ans._id} className="p-3 bg-gray-50 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium text-blue-900">{ans.username || 'Anonymous'}</div>
                                  <div className="text-xs text-gray-500">{ans.timestamp ? new Date(ans.timestamp).toLocaleString() : ''}</div>
                                </div>
                                <div className="text-sm text-gray-700 mb-2">{ans.answer}</div>
                                <div className="flex items-center gap-2">
                                  {(function(){
                                    const aid = ans.answer_id || ans._id;
                                    const isLiked = Boolean(likedAnswers[aid]);
                                    const isLiking = Boolean(likingAnswerIds[aid]);
                                    return (
                                      <button
                                        aria-label="Like answer"
                                        onClick={() => handleLikeAnswer(d._id, aid)}
                                        disabled={isLiked || isLiking}
                                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${isLiked ? 'bg-yellow-200 text-yellow-900' : 'bg-yellow-50 text-gray-700'} ${isLiking ? 'opacity-60 cursor-wait' : ''}`}
                                      >
                                        👍 <span className="ml-1">{ans.likes ?? 0}</span>
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Quiz view is now handled by Quiz.jsx component

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView />;
      case 'upload': return <FileUploadUI username={username} />;
      case 'resource-upload': return <ResourceLibUpload username={username} />;
      case 'attendance': return <AttendanceView />;
      case 'notes': return <NotesView />;
      case 'tasks': return <TasksView />;
      case 'grades': return <GradesView />;
      case 'study-planner': return <StudyPlannerView />;
      case 'resources': return <ResourcesView />;
      case 'discussion': return <DiscussionView />;
      case 'todos': return <AddTaskForm username={username} />;
      case 'quiz': return <Quiz username={username} />;
      default: return <DashboardView />;
    }
    switch(currentView) {
      case 'dashboard': return <DashboardView />;
      case 'upload': return <FileUploadUI username={username} />;
      case 'resource-upload': return <ResourceLibUpload username={username} goBack={() => setCurrentView('resources')} />;
      case 'attendance': return <AttendanceView />;
      case 'notes': return <NotesView />;
      case 'tasks': return <TasksView />;
      case 'grades': return <GradesView />;
      case 'todos': return <AddTaskForm username={username} />;
      case 'study-planner': return <StudyPlannerView />;
      case 'resources': return <ResourcesView />;
      case 'discussion': return <DiscussionView />;
      case 'quiz': return <QuizPracticeSection username={username} />;
      default: return <DashboardView />;
    }
  };

  return (
    <ErrorBoundary>
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

        <div style={{height:"93vh"}} className="flex">
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
            <div className="max-w-8xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudyBuddy;