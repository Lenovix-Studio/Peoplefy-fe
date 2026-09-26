"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DangerZone() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const executeDeleteAll = () => {
    setIsDeleting(true);
    const tid = toast.loading("Sedang menghapus semua data...");

    // Simulasi penghapusan data
    setTimeout(() => {
      toast.success("Seluruh data berhasil dihapus! (Mock)", { id: tid });
      setIsDeleting(false);
      setIsDialogOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="border border-red-200 dark:border-red-900/60 rounded-xl bg-red-50/30 dark:bg-red-950/10 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Menghapus semua data komik, task, transaksi, dan histori yang ada
              di Peoplefy. Tindakan ini bersifat destruktif permanen dan tidak
              dapat dipulihkan.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua Data
          </button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Peringatan Kritis!
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus SELURUH data sistem? Tindakan
              ini tidak dapat dibatalkan!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={executeDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
