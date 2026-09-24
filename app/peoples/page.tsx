"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FolderHeart,
  Image as ImageIcon,
  Globe,
  ArrowUpDown,
  ArrowRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaInstagram, FaTwitter } from "react-icons/fa6";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock Data Peoples / Cosplayers
const allPeoples = [
  {
    id: "1",
    name: "HaneAme",
    handle: "@haneame_cos",
    bio: "Cosplayer, Model & Costume Maker based in Taiwan.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    packCount: 18,
    photoCount: 850,
    socials: {
      instagram: "haneame_cos",
      twitter: "HaneAme_cos",
      website: "https://haneame.com",
    },
  },
  {
    id: "2",
    name: "Miu Cosplay",
    handle: "@miu_cos",
    bio: "Vietnamese Cosplayer & Digital Creator.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 12,
    photoCount: 420,
    socials: {
      instagram: "miu_cos",
      twitter: "miu_cosplay",
    },
  },
  {
    id: "3",
    name: "Alisa",
    handle: "@alisa_cos",
    bio: "Anime enthusiast & craft maker.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    packCount: 8,
    photoCount: 290,
    socials: {
      instagram: "alisa_cosplay",
    },
  },
  {
    id: "4",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
  {
    id: "5",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
  {
    id: "6",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
  {
    id: "7",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
  {
    id: "8",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
];

export default function PeoplesPage() {
  const [sortValue, setSortValue] = useState<string | null>("paling-banyak");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

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
              size="sm"
              className="rounded-full gap-1 pl-2 pr-3 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>
        }
        center={
          <div className="flex items-center gap-2 w-full mx-auto">
            <div className="flex items-center shrink-0">
              <h1 className="text-sm font-semibold tracking-tight text-muted-foreground whitespace-nowrap bg-muted px-3 py-1.5 rounded-full border border-border">
                Total People:{" "}
                <span className="text-foreground font-bold">
                  {allPeoples.length}
                </span>
              </h1>
            </div>
            {/* Input Search dengan Flex-1 agar responsif melebar */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary pointer-events-none" />
              <Input
                type="text"
                placeholder="Search People..."
                className="w-full h-9 pl-9 pr-4 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-lg text-sm"
              />
            </div>

            {/* Dropdown Select yang Dioptimalkan */}
            <Select value={sortValue} onValueChange={setSortValue}>
              <SelectTrigger className="inline-flex items-center justify-between gap-2 w-auto h-9 px-3.5 text-sm bg-background border border-border rounded-lg hover:bg-muted text-foreground transition-all focus:ring-2 focus:ring-primary/20 select-none cursor-pointer whitespace-nowrap shrink-0 [&>svg:last-child]:hidden">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">
                    <SelectValue placeholder="Urutkan Konten" />
                  </span>
                </div>
              </SelectTrigger>

              {/* Konten Pilihan Dropdown Select */}
              <SelectContent
                align="end"
                className="w-48 rounded-xl p-1 shadow-md"
              >
                <SelectItem
                  value="terbaru"
                  className="text-xs cursor-pointer font-medium"
                >
                  Terbaru
                </SelectItem>
                <SelectItem
                  value="paling-banyak"
                  className="text-xs cursor-pointer font-medium"
                >
                  Paling Banyak Pack
                </SelectItem>
                <SelectItem
                  value="paling-sedikit"
                  className="text-xs cursor-pointer font-medium"
                >
                  Paling Sedikit Pack
                </SelectItem>
                <SelectItem
                  value="az"
                  className="text-xs cursor-pointer font-medium"
                >
                  A - Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Peoples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPeoples.map((person) => (
            <div
              key={person.id}
              className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between select-none"
            >
              {/* 1. Foto Profil Berukuran Besar */}
              <div className="relative aspect-4/3.5 w-full overflow-hidden bg-muted border-b border-border">
                <img
                  src={person.avatar}
                  alt={person.name}
                  loading="lazy"
                  className="w-full h-full object-cover "
                />

                {/* Overlay Tombol Media Sosial (Aman karena berada di luar komponen <Link>) */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/40 shadow-xs">
                  {person.socials.instagram && (
                    <a
                      href={`https://instagram.com/${person.socials.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {person.socials.twitter && (
                    <a
                      href={`https://twitter.com/${person.socials.twitter}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      aria-label="Twitter"
                    >
                      <FaTwitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {person.socials.website && (
                    <a
                      href={person.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      aria-label="Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* 2. Informasi Nama Utama */}
              <div className="p-4 flex-1">
                <h3 className="font-bold text-base text-card-foreground group-hover:text-primary transition-colors leading-tight">
                  {/* Tautannya dipasang di sini, namun areanya diperluas se-kartu penuh menggunakan utility 'after:absolute' */}
                  <Link
                    href={`/peoples/${person.id}`}
                    className="focus:outline-hidden after:absolute after:inset-0 after:z-10"
                  >
                    {person.name}
                  </Link>
                </h3>
              </div>

              {/* 3. Footer Statistik */}
              <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs mt-auto relative z-20 pointer-events-none">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FolderHeart className="w-3.5 h-3.5 text-primary" />
                    <strong className="text-foreground font-semibold">
                      {person.packCount}
                    </strong>{" "}
                    Packs
                  </span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <strong className="text-foreground font-semibold">
                      {person.photoCount}
                    </strong>{" "}
                    Foto
                  </span>
                </div>

                <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-0.5 text-xs">
                  Profil <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
