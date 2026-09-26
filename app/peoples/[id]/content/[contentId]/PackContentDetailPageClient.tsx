"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Video,
  ChevronLeft,
  Trash2,
  Edit2,
  Camera,
  X,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Globe,
  Share2,
  ExternalLink,
  Star,
  Archive,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaPatreon,
} from "react-icons/fa";
import { Header } from "@/components/header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackDetail, MediaItem } from "./page";
import { API_URL } from "@/constant/variable";

function getPlatformIcon(platform?: string) {
  if (!platform) return <Globe className="w-3.5 h-3.5" />;
  const p = platform.toLowerCase();
  if (p.includes("instagram"))
    return (
      <FaInstagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
    );
  if (p.includes("twitter") || p.includes("x"))
    return <FaTwitter className="w-3.5 h-3.5 text-sky-500" />;
  if (p.includes("tiktok")) return <FaTiktok className="w-3.5 h-3.5" />;
  if (p.includes("youtube"))
    return <FaYoutube className="w-3.5 h-3.5 text-red-500" />;
  if (p.includes("patreon"))
    return <FaPatreon className="w-3.5 h-3.5 text-orange-500" />;
  if (p.includes("facebook"))
    return <FaFacebook className="w-3.5 h-3.5 text-blue-600" />;
  return <Share2 className="w-3.5 h-3.5 text-muted-foreground" />;
}

interface ClientProps {
  personId: string;
  pack: PackDetail;
}

export default function PackContentDetailPageClient({
  personId,
  pack,
}: ClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingItemId, setDownloadingItemId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);

  const filteredItems = useMemo(() => {
    return pack.items.filter((item) =>
      activeTab === "photo" ? item.type === "image" : item.type === "video",
    );
  }, [pack.items, activeTab]);

  const photoCount = pack.items.filter((i) => i.type === "image").length;
  const videoCount = pack.items.filter((i) => i.type === "video").length;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${API_URL}/peoples/${personId}/photopacks/${pack.id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        router.push(`/peoples/${personId}`);
        router.refresh();
      } else {
        alert("Gagal menghapus photopack");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal mengambil file: ${url}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadItem = async (item: MediaItem, index: number) => {
    setDownloadingItemId(item.id);
    const tid = toast.loading("Mengunduh file...");
    try {
      const ext =
        item.type === "video"
          ? "mp4"
          : item.url.split(".").pop()?.split("?")[0] || "jpg";
      const filename = `${pack.title}-${index + 1}.${ext}`;
      await downloadFile(item.url, filename);
      toast.success("File berhasil diunduh!", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh file.", { id: tid });
    } finally {
      setDownloadingItemId(null);
    }
  };

  const handleDownloadAll = async (items: MediaItem[], label: string) => {
    if (items.length === 0) {
      toast.error(`Tidak ada ${label} untuk diunduh.`);
      return;
    }

    setIsDownloading(true);
    const tid = toast.loading(
      `Mengunduh ${items.length} ${label}... Harap tunggu.`,
    );
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const folder = zip.folder(pack.title) ?? zip;

      await Promise.all(
        items.map(async (item, i) => {
          const res = await fetch(item.url);
          if (!res.ok) return;
          const blob = await res.blob();
          const ext =
            item.type === "video"
              ? "mp4"
              : item.url.split(".").pop()?.split("?")[0] || "jpg";
          const filename = `${String(i + 1).padStart(3, "0")}.${ext}`;
          folder.file(filename, blob);
        }),
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `${pack.title} - ${label}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);

      toast.success(`${items.length} ${label} berhasil diunduh sebagai ZIP!`, {
        id: tid,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat ZIP. Coba lagi.", { id: tid });
    } finally {
      setIsDownloading(false);
    }
  };

  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  };

  const showPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + filteredItems.length) % filteredItems.length,
    );
  };

  const handleResetZoom = () => setScale(1);

  const handleNext = () => {
    showNext();
    handleResetZoom();
  };

  const handlePrev = () => {
    showPrev();
    handleResetZoom();
  };

  useEffect(() => {
    if (
      selectedIndex === null ||
      filteredItems[selectedIndex]?.type !== "image"
    )
      return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      setScale((prevScale) => {
        const zoomStep = 0.1;
        let newScale = prevScale + (e.deltaY < 0 ? zoomStep : -zoomStep);
        return Math.min(Math.max(newScale, 1), 4);
      });
    };

    const viewerArea = document.getElementById("media-viewer-content");
    if (viewerArea) {
      viewerArea.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (viewerArea) viewerArea.removeEventListener("wheel", handleWheel);
    };
  }, [selectedIndex, filteredItems]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") {
        setSelectedIndex(null);
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
      <Header
        left={
          <Link href={`/peoples/${personId}`}>
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
              {pack.title}
            </h1>
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <div className="relative group/dl">
              <Button
                variant="outline"
                size="sm"
                disabled={isDownloading}
                className="group shadow-xs font-medium tracking-tight cursor-pointer rounded-lg px-3 h-9 text-muted-foreground hover:text-foreground"
                title="Download Content"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:translate-y-px" />
                )}
                <span>{isDownloading ? "Mengunduh..." : "Download"}</span>
              </Button>

              <div className="absolute right-0 top-full pt-1 hidden group-hover/dl:flex flex-col z-50 w-52 rounded-xl border border-border bg-popover shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <button
                  onClick={() =>
                    handleDownloadAll(
                      pack.items.filter((i) => i.type === "image"),
                      "Foto",
                    )
                  }
                  disabled={isDownloading || photoCount === 0}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Semua Foto ({photoCount}) sebagai ZIP</span>
                </button>
                <button
                  onClick={() =>
                    handleDownloadAll(
                      pack.items.filter((i) => i.type === "video"),
                      "Video",
                    )
                  }
                  disabled={isDownloading || videoCount === 0}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Semua Video ({videoCount}) sebagai ZIP</span>
                </button>
                <div className="border-t border-border my-0.5" />
                <button
                  onClick={() => handleDownloadAll(pack.items, "Semua File")}
                  disabled={isDownloading || pack.items.length === 0}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Download Semua ({pack.items.length} file)</span>
                </button>
              </div>
            </div>

            <Link href={`/peoples/${personId}/content/${pack.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="group shadow-xs font-medium tracking-tight cursor-pointer rounded-lg px-3 h-9 text-muted-foreground hover:text-foreground"
                title="Edit Content"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:scale-110" />
                <span>Edit</span>
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger
                disabled={isDeleting}
                title="Delete Content"
                className={buttonVariants({
                  variant: "destructive",
                  size: "sm",
                  className:
                    "group shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg px-3 h-9",
                })}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:animate-shake" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </DialogTrigger>

              <DialogContent onConfirm={handleDelete} className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                  <DialogDescription>
                    Apakah Anda yakin ingin menghapus photopack "{pack.title}"?
                    Tindakan ini tidak dapat dibatalkan dan semua media di
                    dalamnya akan terhapus.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <DialogClose
                    type="button"
                    disabled={isDeleting}
                    className={buttonVariants({
                      variant: "outline",
                      className: "cursor-pointer",
                    })}
                  >
                    Batal
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Menghapus..." : "Hapus Photopack"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {(pack.platform || pack.externalUrl) && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                Diupload di:
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground px-2 py-0.5 rounded-md bg-background border border-border/60">
                {getPlatformIcon(pack.platform || undefined)}
                <span>{pack.platform || "Platform Web"}</span>
              </span>
            </div>

            {pack.externalUrl && (
              <a
                href={pack.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <span>Lihat Post Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Tab Navigation: Foto vs Video */}
        <div className="border-b border-border flex items-center justify-between gap-4 text-sm font-medium w-full">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("photo")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "photo"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="capitalize">Photo ({photoCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "video"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="capitalize">Video ({videoCount})</span>
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`group relative w-full aspect-3/4 bg-muted border rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer ${
                  item.isCover
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-border/80"
                }`}
              >
                {item.type === "image" && item.url && (
                  <img
                    src={item.url}
                    alt={item.title || pack.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {item.type === "video" && item.url && (
                  <div className="w-full h-full relative bg-black">
                    <video
                      src={item.url}
                      preload="metadata"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/50 backdrop-blur-xs rounded-lg text-white pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {item.isCover && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Cover</span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      {item.title && (
                        <p className="text-white text-xs font-semibold truncate mb-0.5">
                          {item.title}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-zinc-300 text-[10px]">{item.size}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadItem(item, index);
                      }}
                      disabled={downloadingItemId === item.id}
                      title="Download file ini"
                      className="shrink-0 p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-lg text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {downloadingItemId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="text-sm text-muted-foreground col-span-full py-16 text-center border border-dashed border-border rounded-xl">
                Tidak ada {activeTab === "photo" ? "foto" : "video"} yang
                tersedia dalam album ini.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SLIDESHOW LIGHTBOX MODAL */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between text-white pb-2 border-b border-zinc-800 shrink-0 h-14">
            {/* KIRI: Informasi Metadata */}
            <div className="w-1/3 min-w-0">
              <h3 className="font-semibold text-sm truncate">ID: #12121</h3>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">
                {selectedIndex + 1} dari {filteredItems.length}{" "}
                {activeTab === "photo" ? "Foto" : "Video"}
                {filteredItems[selectedIndex].size &&
                  ` • ${filteredItems[selectedIndex].size}`}
                {filteredItems[selectedIndex].type === "image" &&
                  scale > 1 &&
                  ` • Zoom: ${Math.round(scale * 100)}%`}
              </p>
            </div>

            <div className="w-1/3 flex justify-center items-center">
              {filteredItems[selectedIndex].type === "image" && (
                <div className="flex gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-white shadow-xs">
                  {/* Tombol Zoom Out */}
                  <button
                    onClick={() => setScale((prev) => Math.max(prev - 0.2, 1))}
                    disabled={scale <= 1}
                    title="Zoom Out"
                    className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  {/* Tombol Reset Zoom */}
                  <button
                    onClick={handleResetZoom}
                    disabled={scale === 1}
                    title="Reset Zoom"
                    className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Tombol Zoom In */}
                  <button
                    onClick={() => setScale((prev) => Math.min(prev + 0.2, 4))}
                    disabled={scale >= 4}
                    title="Zoom In"
                    className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="w-1/3 flex justify-end items-center gap-2">
              <button
                onClick={() =>
                  handleDownloadItem(
                    filteredItems[selectedIndex],
                    selectedIndex,
                  )
                }
                disabled={
                  downloadingItemId === filteredItems[selectedIndex]?.id
                }
                title="Download file ini"
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                {downloadingItemId === filteredItems[selectedIndex]?.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedIndex(null);
                  handleResetZoom();
                }}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-between relative my-4 overflow-hidden">
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-6 z-30 p-3 bg-black/40 border border-zinc-800 backdrop-blur-md rounded-full text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              id="media-viewer-content"
              className="w-full h-full flex items-center justify-center p-2 relative overflow-auto scrollbar-none"
            >
              {filteredItems[selectedIndex].type === "image" ? (
                <div className="flex items-center justify-center m-auto">
                  <img
                    src={filteredItems[selectedIndex].url}
                    alt={filteredItems[selectedIndex].title}
                    style={{ transform: `scale(${scale})` }}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl select-none origin-center transition-transform duration-100 ease-out"
                  />
                </div>
              ) : (
                <video
                  src={filteredItems[selectedIndex].url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl bg-zinc-950"
                />
              )}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 md:right-6 z-30 p-3 bg-black/40 border border-zinc-800 backdrop-blur-md rounded-full text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
