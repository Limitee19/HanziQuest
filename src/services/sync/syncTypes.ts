export type SyncStatusType = 'synced' | 'pending_upload' | 'pending_download' | 'offline' | 'conflict' | 'syncing';

export interface AuthSession {
  user: {
    id: string;
    email: string;
  } | null;
  accessToken: string | null;
  isOnline: boolean;
}

export interface SyncMetadata {
  entityId: string;
  entityType: string; // e.g. 'course', 'class_meeting', 'task', 'note'
  ownerId: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus: SyncStatusType;
}

export interface SyncOutboxItem {
  id: string;
  entityType: string;
  entityId: string;
  action: 'insert' | 'update' | 'delete';
  payload: any;
  createdAt: string;
}

export interface CloudSyncState {
  status: SyncStatusType;
  lastSyncedAt: string | null;
  pendingOutboxCount: number;
  userEmail: string | null;
  isOfflineMode: boolean;
}
