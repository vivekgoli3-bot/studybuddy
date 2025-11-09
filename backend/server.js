import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.js';
import userLoginRouter from './routes/userLogin.js';
import attendanceRoutes from './routes/attendance.js';
import uploadRoutes from './routes/uploadToDrive.js';
import notesRoutes from "./routes/notes.js";
import fetchNotesRoutes from "./routes/fetch_notes.js";
import fetchTodosRoute from "./routes/fetch_todos.js";
import fetchResourceLibraryRoute from "./routes/fetch_resource_library.js";
import uploadResourceLibraryRouter from "./routes/uploadResourceLibrary.js";
import resourceLibraryRoutes from "./routes/resourceLibrary.js";
import todosRoute from "./routes/todos.js";
import discussionForumRoutes from "./routes/discussion_forum.js";
import fetchQuizSubjectsRoutes from "./routes/fetch_quiz_subjects.js";
import quizScoresRoutes from "./routes/quiz_scores.js";
import fetchTotalScoresRoutes from "./routes/fetch_total_scores.js";
import fetchUpcomingClassesRoutes from "./routes/fetch_upcoming_classes.js";
import askCohereRoute from "./routes/askCohere.js";
import addAttendanceRoutes from "./routes/add_attendance.js";
import updateAttendanceRoute from "./routes/updateAttendance.js";
import cgpaDistributionRoute from "./routes/cgpa_distribution.js";
import attendanceSummaryRoute from "./routes/attendance_summary.js";
import todoSummaryRoute from "./routes/todo_summary.js";





dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/StudyBuddy_DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

app.use('/api/users', usersRouter);
app.use('/api/user_login', userLoginRouter);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', uploadRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/fetch_notes", fetchNotesRoutes);
app.use("/api/fetch_todos", fetchTodosRoute);
app.use("/api/fetch_resource_library", fetchResourceLibraryRoute);
app.use("/api", uploadResourceLibraryRouter);
app.use("/api/resource_library", resourceLibraryRoutes);
app.use("/api/todos", todosRoute);
app.use("/api/discussion_forum", discussionForumRoutes);
app.use("/api/fetch_quiz_subjects", fetchQuizSubjectsRoutes);
app.use("/api/quiz_scores", quizScoresRoutes);
app.use("/api/fetch_total_scores", fetchTotalScoresRoutes);
app.use("/api/upcoming_classes", fetchUpcomingClassesRoutes);
app.use("/api/ask_cohere", askCohereRoute);
app.use("/api/add_attendance", addAttendanceRoutes);
app.use("/api/update_attendance", updateAttendanceRoute);
app.use("/api/cgpa_distribution", cgpaDistributionRoute);
app.use("/api/attendance_summary", attendanceSummaryRoute);
app.use("/api/todo_summary", todoSummaryRoute);




if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
