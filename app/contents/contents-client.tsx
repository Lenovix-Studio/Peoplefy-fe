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
  Video,
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
import { useState, useMemo } from "react";

export function ContentsClient({
  initialContents,
}: {
  initialContents: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState<string | null>("terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const filteredContents = useMemo(() => {
    let result = [...initialContents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.person?.fullName?.toLowerCase().includes(q),
      );
    }

    if (sortValue === "terbaru") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortValue === "populer") {
      result.sort(
        (a, b) =>
          (b.photoCount || 0) +
          (b.videoCount || 0) -
          ((a.photoCount || 0) + (a.videoCount || 0)),
      );
    } else if (sortValue === "az") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [initialContents, searchQuery, sortValue]);

  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE) || 1;
  const paginatedContents = filteredContents.slice(
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

      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

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
            <div className="flex items-center shrink-0">
              <h1 className="text-sm font-semibold tracking-tight text-muted-foreground whitespace-nowrap bg-muted px-3 py-1.5 rounded-full border border-border">
                Total Content:{" "}
                <span className="text-foreground font-bold">
                  {filteredContents.length}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-1 w-full">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search Content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-9 pr-4 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-full text-sm"
                />
              </div>

              <Select
                value={sortValue || undefined}
                onValueChange={(val) => {
                  setSortValue(val);
                  setCurrentPage(1);
                }}
              >
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedContents.map((content: any) => (
            <Card
              key={content.id}
              className="p-0 group overflow-hidden border-border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col select-none cursor-pointer rounded-xl"
            >
              <Link href={`/peoples/${content.personId}/content/${content.id}`}>
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  {content.coverUrl ? (
                    <img
                      src={content.coverUrl}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No cover
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                    {content.photoCount > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{content.photoCount}</span>
                      </div>
                    )}
                    {content.videoCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>{content.videoCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors mt-0.5">
                      {content.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by{" "}
                      {content.person?.nickname?.split(",")[0] ||
                        content.person?.fullName}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                    Lihat Detail <ArrowRight className="w-3 h-3" />
                  </span>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>

        {filteredContents.length > ITEMS_PER_PAGE && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
            <div className="flex items-center gap-1.5 justify-center sm:justify-end w-full sm:w-auto">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman sebelumnya"
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
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
