"use client";

import Link from "next/link";
import {
  Search,
  Image as ImageIcon,
  ArrowUpDown,
  ChevronLeft,
  MoreHorizontal,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState } from "react";

// Mock data untuk koleksi konten / photopack
const allContents = [
  {
    id: "1",
    title: "Ganyu - Spring Blossom Set",
    cosplayer: "HaneAme",
    character: "Ganyu",
    series: "Genshin Impact",
    photoCount: 45,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tags: ["SFW", "Studio", "Kimono"],
    addedAt: "2026-09-10",
  },
  {
    id: "2",
    title: "Makima - Devil Hunter",
    cosplayer: "Miu Cosplay",
    character: "Makima",
    series: "Chainsaw Man",
    photoCount: 32,
    coverUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    tags: ["Suit", "Outdoor"],
    addedAt: "2026-09-08",
  },
  {
    id: "3",
    title: "Marin Kitagawa - Shizuku-tan",
    cosplayer: "Alisa",
    character: "Marin Kitagawa",
    series: "My Dress-Up Darling",
    photoCount: 60,
    coverUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    tags: ["Cosplay", "Gothic"],
    addedAt: "2026-09-05",
  },
  {
    id: "4",
    title: "Yor Forger - Thorn Princess",
    cosplayer: "Yuki",
    character: "Yor Forger",
    series: "Spy x Family",
    photoCount: 28,
    coverUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    tags: ["Dress", "Action"],
    addedAt: "2026-08-28",
  },
  {
    id: "5",
    title: "2B - YoRHa No.2 Type B",
    cosplayer: "HaneAme",
    character: "2B",
    series: "NieR:Automata",
    photoCount: 50,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tags: ["Sword", "Studio"],
    addedAt: "2026-08-20",
  },
  {
    id: "6",
    title: "2B - YoRHa No.2 Type B",
    cosplayer: "HaneAme",
    character: "2B",
    series: "NieR:Automata",
    photoCount: 50,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tags: ["Sword", "Studio"],
    addedAt: "2026-08-20",
  },
  {
    id: "7",
    title: "2B - YoRHa No.2 Type B",
    cosplayer: "HaneAme",
    character: "2B",
    series: "NieR:Automata",
    photoCount: 50,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tags: ["Sword", "Studio"],
    addedAt: "2026-08-20",
  },
  {
    id: "8",
    title: "2B - YoRHa No.2 Type B",
    cosplayer: "HaneAme",
    character: "2B",
    series: "NieR:Automata",
    photoCount: 50,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tags: ["Sword", "Studio"],
    addedAt: "2026-08-20",
  },
];

export default function ContentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Nanti dihubungkan ke total data dari database/API

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Jumlah halaman utama di tengah yang ingin ditampilkan

    if (totalPages <= 5) {
      // Jika total halaman sedikit, tampilkan semua tanpa ellipsis
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Selalu masukkan halaman pertama
      pages.push(1);

      // Hitung range halaman di sekitar halaman aktif
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Penyesuaian agar jumlah tombol tetap konsisten di awal/akhir range
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Tambahkan ellipsis kiri jika ada jarak dari halaman 1
      if (startPage > 2) {
        pages.push("dots-left");
      }

      // Tambahkan halaman di tengah
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Tambahkan ellipsis kanan jika ada jarak menuju halaman terakhir
      if (endPage < totalPages - 1) {
        pages.push("dots-right");
      }

      // Selalu masukkan halaman terakhir
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        left={
          /* Tombol Back menggunakan Shadcn Button Ghost */
          <Link href="/">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mx-auto">
            {/* Info Total Konten */}
            <div className="flex items-center shrink-0">
              <h1 className="text-sm font-semibold tracking-tight text-muted-foreground whitespace-nowrap bg-muted px-3 py-1.5 rounded-full border border-border">
                Total Content:{" "}
                <span className="text-foreground font-bold">
                  {allContents.length}
                </span>
              </h1>
            </div>

            {/* Baris Kontrol (Search & Filter) */}
            <div className="flex items-center gap-2 flex-1 w-full">
              {/* Input Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search Content..."
                  className="w-full h-9 pl-9 pr-4 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-full text-sm"
                />
              </div>

              {/* Dropdown Select Shadcn/UI yang Benar */}
              <Select defaultValue="terbaru">
                <SelectTrigger className="w-auto h-9 gap-2 rounded-full px-4 border-border shrink-0 text-xs font-medium bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:ring-2 focus:ring-primary/20">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">
                    <SelectValue placeholder="Urutkan" />
                  </span>
                </SelectTrigger>
                <SelectContent align="end" className="w-40 rounded-xl">
                  <SelectItem
                    value="terbaru"
                    className="text-xs cursor-pointer font-medium"
                  >
                    Terbaru
                  </SelectItem>
                  <SelectItem
                    value="populer"
                    className="text-xs cursor-pointer"
                  >
                    Paling Populer
                  </SelectItem>
                  <SelectItem value="az" className="text-xs cursor-pointer">
                    A-Z
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-4">
        {/* Photopacks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {allContents.map((content) => (
            <Card
              key={content.id}
              className="p-0 group overflow-hidden border-border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col select-none cursor-pointer rounded-xl"
            >
              {/* Pembungkus Link Utama */}
              <Link href={`/peoples/${content.id}/content/${content.id}`}>
                {/* Image Cover Preview */}
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={content.coverUrl}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{content.photoCount} foto</span>
                  </div>
                </div>

                {/* Content Info */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors mt-0.5">
                      {content.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {content.cosplayer}
                    </p>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Diunggah {content.addedAt}</span>
                  <span className="font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                    Lihat Detail <ArrowRight className="w-3 h-3" />
                  </span>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
          {/* Kontrol Navigasi */}
          <div className="flex items-center gap-1.5 justify-center sm:justify-end w-full sm:w-auto">
            {/* Tombol Sebelumnya */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Render Angka & Ellipsis secara Dinamis */}
            {getPageNumbers().map((page, index) => {
              if (page === "dots-left" || page === "dots-right") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                      : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Tombol Selanjutnya */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
