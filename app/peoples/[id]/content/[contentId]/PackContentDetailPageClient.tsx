"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaPatreon,
} from "react-icons/fa";
import { SiGooglechrome } from "react-icons/si";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { PackDetail, MediaItem } from "./page";

// Helper icon platform upload
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
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);

  // 1. FILTER ITEMS HARUS BERADA DI ATAS agar bisa dibaca oleh fungsi & useEffect di bawahnya
  const filteredItems = useMemo(() => {
    return pack.items.filter((item) =>
      activeTab === "photo" ? item.type === "image" : item.type === "video",
    );
  }, [pack.items, activeTab]);

  const photoCount = pack.items.filter((i) => i.type === "image").length;
  const videoCount = pack.items.filter((i) => i.type === "video").length;

  // 2. Deklarasikan fungsi navigasi dasar slideshow
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

  // 3. Deklarasikan fungsi wrapper untuk navigasi sekaligus reset zoom
  const handleResetZoom = () => setScale(1);

  const handleNext = () => {
    showNext();
    handleResetZoom();
  };

  const handlePrev = () => {
    showPrev();
    handleResetZoom();
  };

  // 4. useEffect untuk mendeteksi scroll mouse (Wheel Event) untuk Zoom Gambar
  useEffect(() => {
    if (
      selectedIndex === null ||
      filteredItems[selectedIndex]?.type !== "image"
    )
      return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Mencegah halaman utama ikut terskrol

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

  // 5. useEffect untuk mendeteksi navigasi Keyboard (ArrowRight, ArrowLeft, Escape)
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // UBAH: Memanggil handleNext / handlePrev agar zoom ter-reset saat pencet keyboard
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") {
        setSelectedIndex(null);
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems]); // Tambahkan filteredItems ke dependency array

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
      <Header
        left={
          /* Tombol Back menggunakan Shadcn Button Ghost */
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
            {/* 1. Download Content (Aksi Utama / Paling Kiri) */}
            <Button
              variant="outline"
              size="sm"
              className="group shadow-xs font-medium tracking-tight cursor-pointer rounded-lg px-3 h-9 text-muted-foreground hover:text-foreground"
              title="Download Content"
            >
              {/* Mengganti ikon menjadi Download */}
              <Download className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:translate-y-px" />
              <span>Download</span>
            </Button>

            {/* 2. Edit Content (Aksi Sekunder / Tengah) */}
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

            {/* 3. Delete Content (Aksi Destruktif / Paling Kanan) */}
            <Button
              variant="destructive"
              size="sm"
              className="group shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg px-3 h-9"
              title="Delete Content"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:animate-shake" />
              <span>Delete</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner Info Unggahan & Link External (Jika ada) */}
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
                {/* 1. Preview Full untuk Tipe Gambar (Photo) */}
                {item.type === "image" && item.url && (
                  <img
                    src={item.url}
                    alt={item.title || pack.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* 2. Preview Full untuk Tipe Video */}
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

                {/* Badge Cover Utama */}
                {item.isCover && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Overlay Judul saat hover */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {item.title && (
                    <p className="text-white text-xs font-semibold truncate mb-0.5">
                      {item.title}
                    </p>
                  )}
                  {item.size && (
                    <p className="text-zinc-300 text-[10px]">{item.size}</p>
                  )}
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
          {/* Bar Atas / Header: Menggunakan flex horizontal 3 bagian */}
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

            {/* TENGAH: PANEL KONTROL ZOOM (Hanya untuk gambar, menyatu di Header) */}
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

            {/* KANAN: Tombol Close */}
            <div className="w-1/3 flex justify-end">
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

          {/* Area Tengah: Viewer Konten + Tombol Navigasi */}
          <div className="flex-1 w-full flex items-center justify-between relative my-4 overflow-hidden">
            {/* Tombol Kiri */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-6 z-30 p-3 bg-black/40 border border-zinc-800 backdrop-blur-md rounded-full text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Konten Utama */}
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

            {/* Tombol Kanan */}
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
