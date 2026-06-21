require('dotenv').config();

const requiredInProduction = ['POSTGRES_PASSWORD', 'SESSION_SECRET', 'ADMIN_PASSWORD'];

function bool(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

const pgUser = process.env.POSTGRES_USER || 'luerevival';
const pgPassword = encodeURIComponent(process.env.POSTGRES_PASSWORD || 'luerevival_dev_password');
const pgHost = process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost';
const pgPort = process.env.POSTGRES_PORT || process.env.DB_PORT || '5432';
const pgDb = process.env.POSTGRES_DB || 'luerevival';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  trustProxy: bool('TRUST_PROXY', false),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  siteName: process.env.SITE_NAME || 'LueRevival',
  siteTagline: process.env.SITE_TAGLINE || 'Modern AlpacaBoards revival, old-board soul intact.',
  databaseUrl: process.env.DATABASE_URL || `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDb}`,
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-change-me',
  cookieSecure: bool('COOKIE_SECURE', false),
  registrationMode: process.env.REGISTRATION_MODE || 'invite',
  invitesEnabled: bool('INVITES_ENABLED', true),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 8),
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin-change-me'
  }
};

function validateConfig() {
  const warnings = [];
  if (config.env === 'production') {
    for (const key of requiredInProduction) {
      if (!process.env[key] || process.env[key].includes('CHANGE_ME')) {
        warnings.push(`${key} must be set to a real production value`);
      }
    }
    if (!config.cookieSecure) warnings.push('COOKIE_SECURE should be true behind HTTPS');
  }
  if (config.sessionSecret.length < 32) warnings.push('SESSION_SECRET should be at least 32 characters');
  return warnings;
}

module.exports = { config, validateConfig };
