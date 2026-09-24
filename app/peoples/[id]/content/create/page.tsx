"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Globe,
  ImageIcon,
  Plus,
  Trash2,
  Upload,
  Video,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";

const UPLOAD_PLATFORMS = [
  "Pilih Platform (Opsional)",
  "Instagram",
  "Twitter / X",
  "TikTok",
  "Trakteer",
  "Saweria",
  "Karyakarsa",
  "Patreon",
  "Google Drive",
  "Mega",
  "Website Pribadi",
  "Lainnya",
];

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  isCover?: boolean;
}

export default function CreateContentPage() {
  const router = useRouter();
  const params = useParams();
  const personId = params.id as string;

  // Form State
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Pilih Platform (Opsional)");
  const [externalUrl, setExternalUrl] = useState("");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set salah satu foto sebagai cover
  const handleSetCover = (id: string) => {
    setMediaList((prev) =>
      prev.map((item) => ({
        ...item,
        isCover: item.id === id,
      })),
    );
  };

  // Hapus foto/video dari antrean upload
  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (filtered.length > 0 && !filtered.some((item) => item.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Upload Media (Multi select)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = Array.from(files).map((file, idx) => {
      const isVid = file.type.startsWith("video");
      return {
        id: crypto.randomUUID(),
        type: isVid ? "video" : "image",
        url: URL.createObjectURL(file),
        title: file.name,
        // Otomatis jadikan file pertama sebagai cover jika belum ada cover
        isCover: mediaList.length === 0 && idx === 0,
      };
    });

    setMediaList((prev) => [...prev, ...newItems]);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Nama konten wajib diisi!");
      return;
    }

    if (mediaList.length === 0) {
      alert("Unggah minimal 1 foto atau video untuk konten ini!");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      personId,
      title: title.trim(),
      platform: platform === "Pilih Platform (Opsional)" ? null : platform,
      externalUrl: externalUrl.trim() || null,
      mediaList,
    };

    console.log("Menyimpan konten baru:", payload);

    // Simulasi delay simpan ke API
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/peoples/${personId}`);
    }, 800);
  };

  return (
    <>
      <Header
        left={
          <Link href={`/peoples/${personId}`}>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full gap-1 pl-2 pr-3 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>
        }
        center={
          <div className="flex flex-col items-center text-center">
            <h1 className="text-base font-semibold text-foreground mt-0.5 max-w-75 truncate">
              Add Content
            </h1>
          </div>
        }
        right={
          <Button
            type="submit"
            form="create-content-form"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Publikasikan"}</span>
          </Button>
        }
      />
      <div className="w-200 mx-auto py-8">
        <form
          id="create-content-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* SECTION 1: Informasi Konten */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Informasi Utama
            </h2>

            {/* Nama Konten */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Konten / Judul Photopack{" "}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Raiden Shogun - Plane of Euthymia"
              />
            </div>

            {/* Sumber Unggahan / External URL (Opsional) */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <label className="text-xs font-medium text-foreground">
                  Diupload Di Mana?{" "}
                  <span className="text-muted-foreground font-normal">
                    (Opsional)
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full h-9 px-2.5 text-xs font-medium rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {UPLOAD_PLATFORMS.map((plat) => (
                      <option key={plat} value={plat}>
                        {plat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-8">
                  <Input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://instagram.com/p/... atau tautan postingan"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Upload File Foto & Video */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Media File ({mediaList.length}){" "}
                  <span className="text-destructive">*</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Pilih foto atau video. Klik ikon bintang untuk menentukan
                  cover utama.
                </p>
              </div>

              {/* Tombol Upload Media Baru */}
              <label className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>Tambah File</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Grid Preview Media */}
            {mediaList.length === 0 ? (
              <label className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                <ImageIcon className="w-9 h-9 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-foreground">
                  Belum ada media yang dipilih
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Klik di sini atau tombol di atas untuk memilih foto & video
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl overflow-hidden border bg-background flex flex-col transition-all ${
                      item.isCover
                        ? "border-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.title || "Media"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                          <video
                            src={item.url}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white/90 drop-shadow-md" />
                          </div>
                        </div>
                      )}

                      {/* Badge Cover */}
                      {item.isCover && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Cover</span>
                        </div>
                      )}

                      {/* Badge Tipe File */}
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                        {item.type === "image" ? (
                          <ImageIcon className="w-3 h-3" />
                        ) : (
                          <Video className="w-3 h-3" />
                        )}
                        <span className="capitalize">{item.type}</span>
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                        title="Hapus Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Kontrol Set Cover */}
                    <div className="p-2 border-t border-border flex items-center justify-between text-xs">
                      {!item.isCover ? (
                        <button
                          type="button"
                          onClick={() => handleSetCover(item.id)}
                          className="text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <Star className="w-3 h-3" />
                          <span>Set Cover</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-primary flex items-center gap-1">
                          <Check className="w-3 h-3" /> Cover Utama
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
