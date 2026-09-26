"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FolderHeart,
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

export function PeoplesClient({ initialPeoples }: { initialPeoples: any[] }) {
  const [sortValue, setSortValue] = useState<string | null>("paling-banyak");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Filter & Sort
  const filteredPeoples = useMemo(() => {
    let result = [...initialPeoples];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(q) ||
          p.nickname?.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortValue === "paling-banyak") {
      result.sort((a, b) => (b.packCount || 0) - (a.packCount || 0));
    } else if (sortValue === "paling-sedikit") {
      result.sort((a, b) => (a.packCount || 0) - (b.packCount || 0));
    } else if (sortValue === "az") {
      result.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    } else if (sortValue === "terbaru") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return result;
  }, [initialPeoples, searchQuery, sortValue]);

  const totalPages = Math.ceil(filteredPeoples.length / ITEMS_PER_PAGE) || 1;
  const paginatedPeoples = filteredPeoples.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) endPage = 4;
      else if (currentPage >= totalPages - 1) startPage = totalPages - 3;

      if (startPage > 2) pages.push("dots-left");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("dots-right");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        left={
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
                  {filteredPeoples.length}
                </span>
              </h1>
            </div>

            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary pointer-events-none" />
              <Input
                type="text"
                placeholder="Search People..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-9 pr-4 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-lg text-sm"
              />
            </div>

            <Select
              value={sortValue || undefined}
              onValueChange={(val) => {
                setSortValue(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="inline-flex items-center justify-between gap-2 w-auto h-9 px-3.5 text-sm bg-background border border-border rounded-lg hover:bg-muted text-foreground transition-all focus:ring-2 focus:ring-primary/20 select-none cursor-pointer whitespace-nowrap shrink-0 [&>svg:last-child]:hidden">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">
                    <SelectValue placeholder="Urutkan Konten" />
                  </span>
                </div>
              </SelectTrigger>
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {filteredPeoples.length === 0 ? (
          <div className="flex justify-center p-8">
            <span className="text-muted-foreground">
              Tidak ditemukan orang.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPeoples.map((person) => (
              <div
                key={person.id}
                className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between select-none"
              >
                <div className="relative aspect-4/3.5 w-full overflow-hidden bg-muted border-b border-border">
                  <img
                    src={
                      person.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={person.fullName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/40 shadow-xs">
                    {person.socials?.find(
                      (s: any) => s.platform.toLowerCase() === "instagram",
                    ) && (
                      <a
                        href={
                          person.socials.find(
                            (s: any) =>
                              s.platform.toLowerCase() === "instagram",
                          ).url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      >
                        <FaInstagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {person.socials?.find(
                      (s: any) => s.platform.toLowerCase() === "twitter / x",
                    ) && (
                      <a
                        href={
                          person.socials.find(
                            (s: any) =>
                              s.platform.toLowerCase() === "twitter / x",
                          ).url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      >
                        <FaTwitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {person.websites?.[0] && (
                      <a
                        href={person.websites[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-bold text-base text-card-foreground group-hover:text-primary transition-colors leading-tight">
                    <Link
                      href={`/peoples/${person.id}`}
                      className="focus:outline-hidden after:absolute after:inset-0 after:z-10"
                    >
                      {person.fullName}
                    </Link>
                  </h3>
                </div>

                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs mt-auto relative z-20 pointer-events-none">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderHeart className="w-3.5 h-3.5 text-primary" />
                      <strong className="text-foreground font-semibold">
                        {person.packCount || 0}
                      </strong>{" "}
                      Packs
                    </span>
                  </div>
                  <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-0.5 text-xs">
                    Profil <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPeoples.length > ITEMS_PER_PAGE && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

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

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
