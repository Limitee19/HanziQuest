import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus Data',
  itemName,
  itemType = 'data',
  description = 'Data ini akan dihapus secara permanen dari database lokal Anda.',
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 text-xs select-none">
        {/* Warning Icon Dan Message */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Apakah Anda yakin ingin menghapus {itemType} ini?</p>
            <p className="text-[11px] text-rose-600/90 dark:text-rose-300/90">{description}</p>
          </div>
        </div>

        {/* Item Details Card */}
        {itemName && (
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 space-y-1">
            <span className="text-[11px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">
              Rincian {itemType} yang Dihapus:
            </span>
            <div className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 break-words">
              {itemName}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs font-semibold cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
