import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

// Load config from the generated firebase-applet-config.json
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let projectId = 'demo-project';

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    projectId = config.projectId;
  } catch (err) {
    logger.error('Failed to parse firebase-applet-config.json', err);
  }
}

try {
  admin.initializeApp({
    projectId,
  });
  logger.info(`Firebase Admin initialized for project: ${projectId}`);
} catch (error) {
  logger.error('Firebase Admin initialization error', error);
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
