"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Globe,
  ImageIcon,
  Trash2,
  Upload,
  Video,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { API_URL } from "@/constant/variable";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  isCover?: boolean;
  file?: File;
}

export function EditContentClient({
  initialPhotopack,
  initialPlatforms,
}: {
  initialPhotopack: any;
  initialPlatforms: string[];
}) {
  const router = useRouter();
  const params = useParams();
  const personId = params.id as string;
  const contentId = params.contentId as string;

  const [title, setTitle] = useState(initialPhotopack?.title || "");
  const [platform, setPlatform] = useState(
    initialPhotopack?.platform || "Pilih Platform (Opsional)",
  );
  const [externalUrl, setExternalUrl] = useState(
    initialPhotopack?.externalUrl || "",
  );
  const [uploadPlatforms, setUploadPlatforms] = useState<string[]>(
    initialPlatforms || ["Pilih Platform (Opsional)"],
  );
  const [mediaList, setMediaList] = useState<MediaItem[]>(
    initialPhotopack?.media?.map((m: any) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      title: "",
      isCover: m.isCover,
    })) || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetCover = (id: string) => {
    setMediaList((prev) =>
      prev.map((item) => ({
        ...item,
        isCover: item.id === id,
      })),
    );
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (filtered.length > 0 && !filtered.some((item) => item.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

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
        isCover: mediaList.length === 0 && idx === 0,
        file: file,
      };
    });

    setMediaList((prev) => [...prev, ...newItems]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Nama konten wajib diisi!");
      return;
    }
    if (mediaList.length === 0) {
      alert("Unggah minimal 1 foto atau video!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    if (platform !== "Pilih Platform (Opsional)") {
      formData.append("platform", platform);
    }
    if (externalUrl.trim()) {
      formData.append("externalUrl", externalUrl.trim());
    }

    const existingMedia = mediaList
      .filter((m) => !m.file)
      .map((m) => ({
        id: m.id,
        isCover: m.isCover,
      }));
    formData.append("existingMedia", JSON.stringify(existingMedia));

    const newMedia = mediaList.filter((m) => m.file);
    newMedia.forEach((item, index) => {
      formData.append(`media`, item.file!);
      formData.append(`isCover_${index}`, item.isCover ? "true" : "false");
    });

    try {
      const res = await fetch(
        `${API_URL}/peoples/${personId}/photopacks/${contentId}`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (res.ok) {
        router.push(`/peoples/${personId}/content/${contentId}`);
      } else {
        alert("Gagal menyimpan perubahan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header
        left={
          <Link href={`/peoples/${personId}/content/${contentId}`}>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full gap-1 pl-2 pr-3 font-medium"
              title="Back to Detail People"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>
        }
        center={
          <div className="flex flex-col items-center text-center">
            <h1 className="text-base font-semibold text-foreground mt-0.5 max-w-75 truncate">
              Edit Content
            </h1>
          </div>
        }
        right={
          <Button
            type="submit"
            form="edit-content-form"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </Button>
        }
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form
          id="edit-content-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* SECTION 1: Informasi Konten */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Informasi Utama
            </h2>

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
                placeholder="Contoh: Genshin Impact - Raiden Shogun Cosplay"
              />
            </div>

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
                    {uploadPlatforms.map((plat) => (
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
                    placeholder="https://instagram.com/p/... atau link website"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Daftar Foto & Video yang Diupload */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Media File ({mediaList.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Daftar foto dan video dalam konten ini. Anda bisa mengatur
                  thumbnail/cover utama.
                </p>
              </div>

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

            {/* Grid Media Items */}
            {mediaList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs font-medium text-foreground">
                  Belum ada foto atau video
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Klik tombol "Tambah File" di atas untuk mengunggah media.
                </p>
              </div>
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
                    {/* Thumbnail / Video Preview */}
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

                      {item.isCover && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Cover</span>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                        {item.type === "image" ? (
                          <ImageIcon className="w-3 h-3" />
                        ) : (
                          <Video className="w-3 h-3" />
                        )}
                        <span className="capitalize">{item.type}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                        title="Hapus Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

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
