import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { exportBackupData, validateAndRestoreBackup } from '@/services/backupService';
import { HardDriveDownload, Upload, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleExport = async () => {
    try {
      await exportBackupData();
      setStatusMessage({ type: 'success', text: 'Backup exported successfully!' });
    } catch (err) {
      console.error('Export failed:', err);
      setStatusMessage({ type: 'error', text: 'Export failed.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setFileContent(content);
      setStatusMessage(null);
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!fileContent) return;

    setIsRestoring(true);
    setStatusMessage(null);
    try {
      const result = await validateAndRestoreBackup(fileContent);
      if (result.success) {
        setStatusMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          window.location.reload(); // Reload window to refresh application state
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      console.error('Restore error:', err);
      setStatusMessage({ type: 'error', text: 'Restore failed due to an unexpected error.' });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Backup Dan Data Safety Manager">
      <div className="space-y-6 text-xs">
        {/* Status Alert Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 border font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Section 1: Manual Export */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
            <HardDriveDownload className="w-4 h-4 text-blue-500" />
            Export Data Backup
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Download an encrypted local snapshot (`.plmbackup`) of your calendar, notes, financial records, and vault passwords.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vault passwords remain encrypted (AES-256-GCM) during export.</span>
          </div>
          <Button size="sm" onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Export Backup Snapshot
          </Button>
        </div>

        {/* Section 2: Data Restore */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
            <Upload className="w-4 h-4 text-purple-500" />
            Restore Data from Backup
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Select a previously exported `.plmbackup` file to restore your database records.
          </p>

          <input
            type="file"
            accept="*/*,.plmbackup,.json,application/json,application/octet-stream"
            onChange={handleFileChange}
            className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-300 cursor-pointer"
          />

          {fileName && (
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 text-[11px] text-zinc-700 dark:text-zinc-300 font-mono">
              Selected: {fileName}
            </div>
          )}

          <Button
            size="sm"
            disabled={!fileContent || isRestoring}
            onClick={handleRestore}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {isRestoring ? 'Restoring Database...' : 'Restore Selected Backup'}
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
