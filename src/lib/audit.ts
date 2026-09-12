/**
 * CodeQuest — Audit Logging Service
 */

import { db, schema } from '@/db';
import crypto from 'crypto';

export interface LogAuditParams {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'review' | 'rollback' | 'role_change';
  targetType: 'course' | 'module' | 'lesson' | 'exercise' | 'user';
  targetId: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}

function sanitizeAuditDetails(details?: Record<string, unknown>): Record<string, unknown> {
  if (!details) return {};
  const sensitiveKeys = ['password', 'passwordhash', 'token', 'jwt', 'secret', 'cookie', 'session', 'auth'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeAuditDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    const now = new Date().toISOString();
    const safeDetails = sanitizeAuditDetails(params.details);
    db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: JSON.stringify(safeDetails),
      ipAddress: params.ipAddress || null,
      createdAt: now,
    }).run();
  } catch (err) {
    console.error('Audit log yozishda xatolik:', err);
  }
}
