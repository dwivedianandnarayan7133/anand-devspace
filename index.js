/**
 * Portfolio Backend — Express Server
 *
 * - Serves the static frontend (index.html, CSS, JS)
 * - Exposes REST API at /api/*
 * - Connects to MongoDB via Mongoose
 */

'use strict';

// Load env variables first, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact');
const socialRoutes = require('./routes/social');
const resumeRoutes = require('./routes/resume');
const projectRoutes = require('./routes/projects');
const educationRoutes = require('./routes/education');
const certRoutes = require('./routes/certifications');
const skillRoutes = require('./routes/skills');

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3002;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow same-origin and localhost in dev
const allowedOrigins = [
  `http://localhost:${PORT}`,
  'http://localhost:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5500', // VS Code Live Server
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
}));

// Parse JSON bodies (max 50kb to prevent payload attacks)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────

// General API limit: 100 requests / 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Stricter limit for contact form: 5 submissions / 10 min per IP
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please wait a few minutes.' },
  keyGenerator: (req) =>
    req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
});

// ─── Security Headers (lightweight, no helmet needed) ─────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ─── Request Logger (dev only) ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const ts = new Date().toISOString().split('T')[1].slice(0, 8);
    console.log(`[${ts}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health Check ─────────────────────────────────────────────────────────────
const mongoose = require('mongoose');

app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbStatus = dbState[mongoose.connection.readyState] || 'unknown';

  return res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: `Express on port ${PORT}`,
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'N/A',
      host: mongoose.connection.host || 'N/A',
    },
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/contact', apiLimiter, contactLimiter, contactRoutes);
app.use('/api/social', apiLimiter, socialRoutes);
app.use('/api/resume', apiLimiter, resumeRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/education', apiLimiter, educationRoutes);
app.use('/api/certifications', apiLimiter, certRoutes);
app.use('/api/skills', apiLimiter, skillRoutes);

// ─── 404 handler for unknown API routes ───────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.path}` });
});

// ─── Serve Static Frontend ────────────────────────────────────────────────────
// Serve all static assets from the project root
app.use(express.static(path.join(__dirname, '..')));

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

// Catch-all: serve index.html for any non-API route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║    Anand Narayan Dwivedi — Portfolio API      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`🚀  Server:      http://localhost:${PORT}`);
  console.log(`📡  Health:      http://localhost:${PORT}/api/health`);
  console.log(`💬  Contact:     http://localhost:${PORT}/api/contact`);
  console.log(`🔗  Social:      http://localhost:${PORT}/api/social`);
  console.log(`📄  Resume DL:   http://localhost:${PORT}/api/resume`);
  console.log(`📋  Resume info: http://localhost:${PORT}/api/resume/info`);
  console.log(`🔧  Env:         ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

module.exports = app;
