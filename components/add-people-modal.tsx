"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constant/variable";

interface AddPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPeopleModal({ isOpen, onClose }: AddPeopleModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    const tid = toast.loading("Membuat profil baru...");

    try {
      const res = await fetch(`${API_URL}/peoples`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name }),
      });
      if (res.ok) {
        const data = await res.json();

        if (fileToUpload) {
          toast.loading("Mengunggah foto...", { id: tid });
          const formData = new FormData();
          formData.append("avatar", fileToUpload);

          await fetch(`${API_URL}/peoples/${data.id}/upload`, {
            method: "POST",
            body: formData,
          });
        }

        toast.success("Berhasil dibuat! Mengalihkan...", { id: tid });
        setName("");
        setPreview(null);
        setFileToUpload(null);
        onClose();
        router.push(`/peoples/${data.id}/edit`);
      } else {
        toast.error("Gagal membuat profil.", { id: tid });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md p-6 gap-5 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
        showCloseButton={false}
      >
        {/* Header Modal */}
        <DialogHeader className="space-y-1 text-center border-b border-border pb-3">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            New People
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Upload Foto Profil */}
          <div className="space-y-2">
            <div className="flex flex-col items-center justify-center pt-1">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square w-full rounded-full border-2 border-dashed border-border hover:border-primary/60 bg-muted/40 hover:bg-muted/80 flex items-center justify-center overflow-hidden cursor-pointer group transition-all duration-200 select-none"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors duration-200">
                    <User className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[10px] mt-1 font-semibold">
                      Upload
                    </span>
                  </div>
                )}

                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                  <Upload className="w-4 h-4 animate-bounce duration-1000" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Input Nama People */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-foreground">
              Full Name
            </label>
            <Input
              type="text"
              required
              placeholder="Ex: Ichsanul Kamil Sudarmi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-sm"
            />
          </div>

          {/* Actions Button */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-9 text-xs font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="h-9 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors px-4"
            >
              Simpan Data
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
