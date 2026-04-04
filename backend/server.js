import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.js';
import userRegisterRouter from './routes/user_register.js';
import userLoginRouter from './routes/userLogin.js';
import attendanceRoutes from './routes/attendance.js';
import uploadRoutes from './routes/uploadToDrive.js';
import notesRoutes from './routes/notes.js';
import fetchNotesRoutes from './routes/fetch_notes.js';
import fetchTodosRoute from './routes/fetch_todos.js';
import fetchResourceLibraryRoute from './routes/fetch_resource_library.js';
import uploadResourceLibraryRouter from './routes/uploadResourceLibrary.js';
import resourceLibraryRoutes from './routes/resourceLibrary.js';
import todosRoute from './routes/todos.js';
import discussionForumRoutes from './routes/discussion_forum.js';
import fetchQuizSubjectsRoutes from './routes/fetch_quiz_subjects.js';
import quizScoresRoutes from './routes/quiz_scores.js';
import fetchTotalScoresRoutes from './routes/fetch_total_scores.js';
import fetchUpcomingClassesRoutes from './routes/fetch_upcoming_classes.js';
import askCohereRoute from './routes/askCohere.js';
import addAttendanceRoutes from './routes/add_attendance.js';
import updateAttendanceRoute from './routes/updateAttendance.js';
import cgpaDistributionRoute from './routes/cgpa_distribution.js';
import attendanceSummaryRoute from './routes/attendance_summary.js';
import todoSummaryRoute from './routes/todo_summary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/StudyBuddy_DB';
const clientDistDir = path.resolve(
  __dirname,
  '..',
  process.env.CLIENT_DIST_DIR || 'frontend_Homepage/dist'
);
const clientIndexPath = path.join(clientDistDir, 'index.html');
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Backend working' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/api/users', usersRouter);
app.use('/api/user_login', userLoginRouter);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', uploadRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/fetch_notes', fetchNotesRoutes);
app.use('/api/fetch_todos', fetchTodosRoute);
app.use('/api/fetch_resource_library', fetchResourceLibraryRoute);
app.use('/api', uploadResourceLibraryRouter);
app.use('/api/resource_library', resourceLibraryRoutes);
app.use('/api/todos', todosRoute);
app.use('/api/discussion_forum', discussionForumRoutes);
app.use('/api/fetch_quiz_subjects', fetchQuizSubjectsRoutes);
app.use('/api/quiz_scores', quizScoresRoutes);
app.use('/api/fetch_total_scores', fetchTotalScoresRoutes);
app.use('/api/upcoming_classes', fetchUpcomingClassesRoutes);
app.use('/api/ask_cohere', askCohereRoute);
app.use('/api/add_attendance', addAttendanceRoutes);
app.use('/api/update_attendance', updateAttendanceRoute);
app.use('/api/cgpa_distribution', cgpaDistributionRoute);
app.use('/api/attendance_summary', attendanceSummaryRoute);
app.use('/api/todo_summary', todoSummaryRoute);
app.use('/api/user_register', userRegisterRouter);

app.use('/users', usersRouter);
app.use('/register', userRegisterRouter);
app.use('/login', userLoginRouter);

if (process.env.NODE_ENV === 'production') {
  if (existsSync(clientIndexPath)) {
    app.use(express.static(clientDistDir));
    app.get('/{*splat}', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }

      return res.sendFile(clientIndexPath);
    });
  } else {
    console.warn(`Client build not found at ${clientIndexPath}`);
  }
}

app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
