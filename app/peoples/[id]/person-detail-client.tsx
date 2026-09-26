"use client";

import { useState, useMemo } from "react";
import { format, differenceInYears } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderHeart,
  Image as ImageIcon,
  Globe,
  ExternalLink,
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  X,
  Share2,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitch,
  FaDiscord,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { Header } from "@/components/header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { API_URL } from "@/constant/variable";

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram"))
    return (
      <FaInstagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
    );
  if (p.includes("twitter") || p.includes("x"))
    return <FaTwitter className="w-3.5 h-3.5 text-sky-500" />;
  if (p.includes("tiktok"))
    return <FaTiktok className="w-3.5 h-3.5 text-foreground" />;
  if (p.includes("youtube"))
    return <FaYoutube className="w-3.5 h-3.5 text-red-500" />;
  if (p.includes("facebook"))
    return <FaFacebook className="w-3.5 h-3.5 text-blue-600" />;
  if (p.includes("threads"))
    return <FaThreads className="w-3.5 h-3.5 text-foreground" />;
  if (p.includes("twitch"))
    return <FaTwitch className="w-3.5 h-3.5 text-purple-500" />;
  if (p.includes("discord"))
    return <FaDiscord className="w-3.5 h-3.5 text-indigo-500" />;
  return <Share2 className="w-3.5 h-3.5 text-muted-foreground" />;
}

function formatDisplayUrl(url: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.replace("www.", "") + parsed.pathname.replace(/\/$/, "")
    );
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  }
}

export function PersonDetailClient({ initialPerson }: { initialPerson: any }) {
  const params = useParams();
  const router = useRouter();
  const personId = params.id as string;

  const [personDetail, setPersonDetail] = useState<any>(initialPerson);
  const [activeTab, setActiveTab] = useState<"packs">("packs");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const handleDelete = async () => {
    const tid = toast.loading("Menghapus...");
    try {
      const res = await fetch(`${API_URL}/peoples/${personId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Berhasil dihapus!", { id: tid });
        router.push("/peoples");
      } else {
        toast.error("Gagal menghapus.", { id: tid });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    }
  };

  const filteredPacks = useMemo(() => {
    if (!personDetail || !personDetail.photopacks) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return personDetail.photopacks;

    return personDetail.photopacks.filter((pack: any) =>
      pack.title.toLowerCase().includes(query),
    );
  }, [personDetail, searchQuery]);

  const totalPages = Math.ceil(filteredPacks.length / ITEMS_PER_PAGE) || 1;

  const paginatedPacks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPacks, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

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

      if (startPage > 2) {
        pages.push("dots-left");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("dots-right");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <span className="animate-pulse text-muted-foreground">
          Loading Profile...
        </span>
      </div>
    );
  }

  if (!personDetail) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <span className="text-muted-foreground">Profile not found.</span>
      </div>
    );
  }

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
        center={false}
        right={
          <div className="flex items-center gap-2">
            <Link href={`/peoples/${personDetail.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="group shadow-xs font-medium tracking-tight cursor-pointer rounded-lg px-3 h-9 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:scale-110" />
                <span>Edit Profile</span>
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger
                className={buttonVariants({
                  variant: "destructive",
                  size: "sm",
                  className:
                    "group shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg px-3 h-9",
                })}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:animate-shake" />
                <span>Delete People</span>
              </DialogTrigger>

              <DialogContent onConfirm={handleDelete} className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                  <DialogDescription>
                    Apakah Anda yakin ingin menghapus {personDetail.fullName}?
                    Semua data terkait profil ini (termasuk photopacks) mungkin
                    akan terhapus.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <DialogClose
                    className={buttonVariants({
                      variant: "outline",
                      className: "cursor-pointer",
                    })}
                  >
                    Batal
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDelete}>
                    Hapus Profil
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs select-none">
          {/* 1. Cover / Banner Section */}
          {(() => {
            const bannerSrc =
              personDetail.coverUrl && personDetail.coverUrl.trim().length > 0
                ? personDetail.coverUrl
                : personDetail.banner && personDetail.banner.trim().length > 0
                  ? personDetail.banner
                  : null;

            const bannerName =
              personDetail.fullName || personDetail.name || "Person";

            return (
              <div className="relative h-48 md:h-64 bg-muted overflow-hidden flex items-center justify-center">
                {bannerSrc ? (
                  <img
                    src={bannerSrc}
                    alt={`${bannerName} banner`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-primary/10 via-muted to-primary/5 flex items-center justify-center" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })()}

          {/* 2. Profile Content Section */}
          <div className="px-6 pb-6 relative">
            {(() => {
              const avatarSrc =
                personDetail.avatarUrl &&
                personDetail.avatarUrl.trim().length > 0
                  ? personDetail.avatarUrl
                  : personDetail.avatar && personDetail.avatar.trim().length > 0
                    ? personDetail.avatar
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

              const avatarName =
                personDetail.fullName || personDetail.name || "Avatar";

              return (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
                  <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-card bg-muted shadow-md overflow-hidden flex items-center justify-center">
                    <img
                      src={avatarSrc}
                      alt={avatarName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })()}

            <div className="space-y-4 max-w-4xl">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    {personDetail.fullName || personDetail.name}
                  </h2>
                  {personDetail.nickname && (
                    <div className="flex flex-wrap gap-1.5">
                      {personDetail.nickname
                        .split(",")
                        .map((nick: string, idx: number) => {
                          const trimmedNick = nick.trim();
                          if (!trimmedNick) return null;
                          return (
                            <span
                              key={idx}
                              className="text-sm font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md shadow-sm"
                            >
                              "{trimmedNick}"
                            </span>
                          );
                        })}
                    </div>
                  )}
                </div>

                {personDetail.tags && personDetail.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {personDetail.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(personDetail.birthDate || personDetail.birthPlace) && (
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                  {personDetail.birthPlace && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{personDetail.birthPlace}</span>
                    </div>
                  )}

                  {personDetail.birthDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        {format(
                          new Date(personDetail.birthDate),
                          "d MMMM yyyy",
                          {
                            locale: localeId,
                          },
                        )}{" "}
                        <span className="text-muted-foreground/75 font-normal">
                          (
                          {differenceInYears(
                            new Date(),
                            new Date(personDetail.birthDate),
                          )}{" "}
                          tahun)
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {personDetail.description && (
                <p className="text-sm text-muted-foreground leading-relaxed font-normal whitespace-pre-line">
                  {personDetail.description}
                </p>
              )}

              <div className="pt-1 flex flex-wrap gap-2.5 text-xs font-medium">
                <div className="flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-xl text-muted-foreground">
                  <FolderHeart className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    <strong className="text-foreground font-semibold">
                      {personDetail.photopacks?.length ||
                        personDetail.stats?.totalPacks ||
                        0}
                    </strong>{" "}
                    Packs
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/70 space-y-4">
                {((personDetail.socials && personDetail.socials.length > 0) ||
                  (personDetail.websites &&
                    personDetail.websites.length > 0)) && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Tautan & Media Sosial
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {personDetail.socials?.map((item: any) => (
                        <a
                          key={item.id || item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs font-medium bg-background text-foreground hover:bg-muted transition-colors shadow-2xs group"
                        >
                          {getSocialIcon(item.platform)}
                          <span>{item.platform}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                        </a>
                      ))}

                      {personDetail.websites?.map((web: any) => (
                        <a
                          key={web.id || web.url}
                          href={web.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs font-medium bg-background text-foreground hover:bg-muted transition-colors shadow-2xs group"
                        >
                          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{web.platform || "Web"}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {personDetail.closePersons &&
                  personDetail.closePersons.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Orang Terdekat & Relasi
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {personDetail.closePersons.map((person: any) => (
                          <div
                            key={person.id || person.url}
                            className="inline-flex items-center gap-2 border border-border/80 bg-muted/40 px-3 py-1.5 rounded-xl text-xs"
                          >
                            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-semibold text-foreground">
                              {person.relation || "Relasi"}:
                            </span>
                            <a
                              href={person.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                            >
                              {getSocialIcon(person.platform)}
                              <span>{person.platform}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-7 mt-7">
          {/* Tab Navigation */}
          <div className="border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-medium w-full pb-2 sm:pb-0">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("packs")}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === "packs"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FolderHeart className="w-4 h-4" />
                <span>Content ({filteredPacks.length})</span>
              </button>
            </div>

            {/* Search Box & Add Button */}
            <div className="flex items-center gap-3 sm:pb-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Content..."
                  className="w-full h-9 pl-9 pr-3 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-full text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <Button
                size="sm"
                className="group h-9 px-3.5 shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              >
                <Link
                  href={`/peoples/${personDetail.id}/content/create`}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                  <span>Add Content</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Tab Content: Photopacks */}
          {activeTab === "packs" && (
            <div className="space-y-4">
              {paginatedPacks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {paginatedPacks.map((pack: any) => (
                    <Card
                      key={pack.id}
                      className="p-0 group overflow-hidden border-border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col select-none cursor-pointer rounded-xl"
                    >
                      <Link
                        href={`/peoples/${personDetail.id}/content/${pack.id}`}
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-muted">
                          <img
                            src={pack.coverUrl}
                            alt={pack.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                            {pack.photoCount > 0 && (
                              <div className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>{pack.photoCount}</span>
                              </div>
                            )}
                            {pack.videoCount > 0 && (
                              <div className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>{pack.videoCount}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors mt-0.5">
                              {pack.title}
                            </h3>
                          </div>
                        </CardContent>

                        <CardFooter className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground mt-auto">
                          <span>Diunggah {pack.addedAt}</span>
                          <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                            Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <p className="text-sm font-medium text-foreground">
                    Konten tidak ditemukan
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tidak ada hasil untuk kata kunci "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
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
          )}
        </div>
      </main>
    </div>
  );
}
