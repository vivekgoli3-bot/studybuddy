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

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  (isVercel ? '' : 'mongodb://127.0.0.1:27017/StudyBuddy_DB');
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

mongoose.set('bufferCommands', false);

let mongoConnectionPromise = null;
let mongoConnectionError = null;

const getDatabaseStatus = () => {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

const ensureMongoConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoUri) {
    mongoConnectionError = new Error(
      'MONGODB_URI is not configured for this deployment.'
    );
    throw mongoConnectionError;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error) => {
        mongoConnectionPromise = null;
        mongoConnectionError = error;
        throw error;
      });
  }

  return mongoConnectionPromise;
};

mongoose.connection.on('connected', () => {
  mongoConnectionError = null;
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (error) => {
  mongoConnectionError = error;
  console.error('MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  mongoConnectionPromise = null;
});

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
  const configured = Boolean(mongoUri);
  const databaseStatus = getDatabaseStatus();
  const ok = configured && databaseStatus === 'connected';

  res.status(ok ? 200 : 503).json({
    ok,
    database: {
      configured,
      status: databaseStatus,
      error: mongoConnectionError?.message ?? null,
    },
  });
});

const requireDatabaseConnection = async (req, res, next) => {
  try {
    await ensureMongoConnection();
    return next();
  } catch (error) {
    const missingMongoUri = !mongoUri;

    return res.status(503).json({
      success: false,
      error: missingMongoUri
        ? 'Database unavailable. Set MONGODB_URI in your Vercel project settings.'
        : 'Database unavailable. Check your MongoDB connection settings.',
      details: error.message,
    });
  }
};

app.use('/api/users', requireDatabaseConnection, usersRouter);
app.use('/api/user_login', requireDatabaseConnection, userLoginRouter);
app.use('/api/attendance', requireDatabaseConnection, attendanceRoutes);
app.use('/api', uploadRoutes);
app.use('/api/notes', requireDatabaseConnection, notesRoutes);
app.use('/api/fetch_notes', requireDatabaseConnection, fetchNotesRoutes);
app.use('/api/fetch_todos', requireDatabaseConnection, fetchTodosRoute);
app.use(
  '/api/fetch_resource_library',
  requireDatabaseConnection,
  fetchResourceLibraryRoute
);
app.use('/api', uploadResourceLibraryRouter);
app.use('/api/resource_library', requireDatabaseConnection, resourceLibraryRoutes);
app.use('/api/todos', requireDatabaseConnection, todosRoute);
app.use('/api/discussion_forum', requireDatabaseConnection, discussionForumRoutes);
app.use('/api/fetch_quiz_subjects', requireDatabaseConnection, fetchQuizSubjectsRoutes);
app.use('/api/quiz_scores', requireDatabaseConnection, quizScoresRoutes);
app.use('/api/fetch_total_scores', requireDatabaseConnection, fetchTotalScoresRoutes);
app.use('/api/upcoming_classes', requireDatabaseConnection, fetchUpcomingClassesRoutes);
app.use('/api/ask_cohere', askCohereRoute);
app.use('/api/add_attendance', requireDatabaseConnection, addAttendanceRoutes);
app.use('/api/update_attendance', requireDatabaseConnection, updateAttendanceRoute);
app.use('/api/cgpa_distribution', requireDatabaseConnection, cgpaDistributionRoute);
app.use('/api/attendance_summary', requireDatabaseConnection, attendanceSummaryRoute);
app.use('/api/todo_summary', requireDatabaseConnection, todoSummaryRoute);
app.use('/api/user_register', requireDatabaseConnection, userRegisterRouter);

app.use('/users', requireDatabaseConnection, usersRouter);
app.use('/register', requireDatabaseConnection, userRegisterRouter);
app.use('/login', requireDatabaseConnection, userLoginRouter);

if (process.env.NODE_ENV === 'production' && !isVercel) {
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

if (!isVercel) {
  app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
}

export default app;
