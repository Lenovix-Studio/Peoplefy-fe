"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Camera,
  Plus,
  Trash2,
  Globe,
  Share2,
  Users,
  Check,
  X,
  ChevronLeft,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/header";
import { toast } from "sonner";
import { API_URL } from "@/constant/variable";

interface SocialItem {
  id: string;
  platform: string;
  url: string;
}

interface WebItem {
  id: string;
  platform: string;
  url: string;
}

interface ClosePersonItem {
  id: string;
  relation: string;
  platform: string;
  url: string;
}

export function EditPersonClient({
  initialPerson,
  initialSocialPlatforms,
  initialWebPlatforms,
  initialPresetTags,
  initialPresetTagsTypeId,
}: any) {
  const router = useRouter();
  const params = useParams();
  const personId = params.id as string;

  const [coverUrl, setCoverUrl] = useState(initialPerson?.coverUrl || "");
  const [avatarUrl, setAvatarUrl] = useState(initialPerson?.avatarUrl || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState(initialPerson?.fullName || "");
  const [nickname, setNickname] = useState(initialPerson?.nickname || "");
  const [birthPlace, setBirthPlace] = useState(initialPerson?.birthPlace || "");
  const [tags, setTags] = useState<string[]>(initialPerson?.tags || []);
  const [newTagInput, setNewTagInput] = useState("");
  const [debouncedTagInput, setDebouncedTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>(
    initialSocialPlatforms || [],
  );
  const [webPlatforms, setWebPlatforms] = useState<string[]>(
    initialWebPlatforms || [],
  );
  const [presetTags, setPresetTags] = useState<string[]>(
    initialPresetTags || [],
  );
  const [presetTagsTypeId, setPresetTagsTypeId] = useState<string>(
    initialPresetTagsTypeId || "",
  );
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    initialPerson?.birthDate ? new Date(initialPerson.birthDate) : undefined,
  );
  const [description, setDescription] = useState(
    initialPerson?.description || "",
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    initialPerson?.birthDate ? new Date(initialPerson.birthDate) : new Date(),
  );
  const [socials, setSocials] = useState<SocialItem[]>(
    initialPerson?.socials || [],
  );
  const [websites, setWebsites] = useState<WebItem[]>(
    initialPerson?.websites || [],
  );
  const [closePersons, setClosePersons] = useState<ClosePersonItem[]>(
    initialPerson?.closePersons || [],
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTagInput(newTagInput), 300);
    return () => clearTimeout(handler);
  }, [newTagInput]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const url = debouncedTagInput
          ? `${API_URL}/peoples/tags/popular?search=${encodeURIComponent(debouncedTagInput)}`
          : `${API_URL}/peoples/tags/popular`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSuggestedTags(data.slice(0, 10));
        }
      } catch (err) {
        console.error("Gagal memuat popular tags", err);
      }
    };
    fetchTags();
  }, [debouncedTagInput]);

  const handleSelectDate = (date: Date | undefined) => {
    setBirthDate(date);
    if (date) setCalendarMonth(date);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverUrl(URL.createObjectURL(file));
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleAddTag = async (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput("");

      if (
        presetTagsTypeId &&
        !presetTags.some((p) => p.toLowerCase() === trimmed.toLowerCase())
      ) {
        const newCode = trimmed
          .toUpperCase()
          .replace(/\s+/g, "_")
          .substring(0, 50);
        try {
          await fetch(
            `${API_URL}/common-codes/types/${presetTagsTypeId}/details`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: newCode,
                label: trimmed,
                sortOrder: 0,
                isActive: true,
              }),
            },
          );
          setPresetTags((prev) => [...prev, trimmed]);
        } catch (error) {
          console.error("Gagal menambah tag baru ke common codes", error);
        }
      }
    }
  };
  const handleRemoveTag = (targetTag: string) => {
    setTags(tags.filter((t) => t !== targetTag));
  };

  const addSocial = () =>
    setSocials([
      ...socials,
      {
        id: crypto.randomUUID(),
        platform: socialPlatforms[0] || "Instagram",
        url: "",
      },
    ]);
  const updateSocial = (id: string, field: "platform" | "url", value: string) =>
    setSocials(
      socials.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  const removeSocial = (id: string) =>
    setSocials(socials.filter((s) => s.id !== id));

  const addWebsite = () =>
    setWebsites([
      ...websites,
      {
        id: crypto.randomUUID(),
        platform: webPlatforms[0] || "Personal Website",
        url: "",
      },
    ]);
  const updateWebsite = (
    id: string,
    field: "platform" | "url",
    value: string,
  ) =>
    setWebsites(
      websites.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    );
  const removeWebsite = (id: string) =>
    setWebsites(websites.filter((w) => w.id !== id));

  const addClosePerson = () =>
    setClosePersons([
      ...closePersons,
      {
        id: crypto.randomUUID(),
        relation: "",
        platform: socialPlatforms[0] || "Instagram",
        url: "",
      },
    ]);
  const updateClosePerson = (
    id: string,
    field: "relation" | "platform" | "url",
    value: string,
  ) =>
    setClosePersons(
      closePersons.map((cp) => (cp.id === id ? { ...cp, [field]: value } : cp)),
    );
  const removeClosePerson = (id: string) =>
    setClosePersons(closePersons.filter((cp) => cp.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Nama Lengkap wajib diisi!");
      return;
    }
    setIsSubmitting(true);
    const tid = toast.loading("Menyimpan...");

    const payload = {
      fullName,
      nickname,
      birthDate: birthDate ? birthDate.toISOString() : undefined,
      birthPlace,
      description,
      tags,
      coverUrl: coverUrl.startsWith("blob:") ? undefined : coverUrl,
      avatarUrl: avatarUrl.startsWith("blob:") ? undefined : avatarUrl,
      socials: socials.map(({ id, ...rest }) => rest),
      websites: websites.map(({ id, ...rest }) => rest),
      closePersons: closePersons.map(({ id, ...rest }) => rest),
    };

    try {
      const res = await fetch(`${API_URL}/peoples/${personId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (coverFile || avatarFile) {
          toast.loading("Mengunggah foto...", { id: tid });
          const formData = new FormData();
          if (avatarFile) formData.append("avatar", avatarFile);
          if (coverFile) formData.append("cover", coverFile);

          await fetch(`${API_URL}/peoples/${personId}/upload`, {
            method: "POST",
            body: formData,
          });
        }

        toast.success("Berhasil menyimpan profil!", { id: tid });
        router.push(`/peoples/${personId}`);
      } else {
        toast.error("Gagal menyimpan profil.", { id: tid });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
      setIsSubmitting(false);
    }
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
        center={false}
        right={
          <Button
            type="submit"
            form="edit-profile-form"
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
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* SECTION 1: Banner & Avatar */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="relative h-44 sm:h-56 bg-muted group flex items-center justify-center z-0">
              {typeof coverUrl === "string" && coverUrl.trim().length > 0 ? (
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5 select-none">
                  <Camera className="w-6 h-6 opacity-40" />
                  <span className="text-xs">Belum ada foto cover</span>
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-medium cursor-pointer transition-opacity backdrop-blur-xs z-10">
                <Camera className="w-4 h-4" />
                <span>Ganti Foto Cover</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </label>
            </div>

            <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 z-20 pointer-events-none">
              <div className="relative w-28 h-28 rounded-full border-4 border-card overflow-hidden shadow-md group bg-muted shrink-0 flex items-center justify-center pointer-events-auto">
                {typeof avatarUrl === "string" &&
                avatarUrl.trim().length > 0 ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                  />
                )}

                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-medium cursor-pointer transition-opacity z-10">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: Informasi Dasar */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
              Informasi Pribadi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Kamilia Putri"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Nama Panggilan / Nickname
                </label>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Contoh: Mimi"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Tempat Lahir
                </label>
                <Input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Contoh: Jakarta"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-medium text-foreground">
                  Tanggal Lahir
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-9 justify-start text-left font-normal border-border bg-background hover:bg-muted text-xs",
                        !birthDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {birthDate ? (
                        format(birthDate, "d MMMM yyyy", { locale: localeId })
                      ) : (
                        <span>Pilih tanggal lahir</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={handleSelectDate}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      captionLayout="dropdown"
                      startMonth={new Date(1950, 0)}
                      endMonth={new Date()}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      autoFocus
                      className="w-70"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-foreground">
                Tag Kategori
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ketik tag baru..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(newTagInput);
                    }
                  }}
                  className="max-w-xs h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleAddTag(newTagInput)}
                >
                  Tambah Tag
                </Button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 flex-wrap">
                <span>Saran:</span>
                {suggestedTags.length > 0 ? (
                  suggestedTags.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => handleAddTag(preset)}
                      className="hover:underline text-primary/80 hover:text-primary cursor-pointer whitespace-nowrap"
                    >
                      +{preset}
                    </button>
                  ))
                ) : (
                  <span className="italic">Tidak ada tag ditemukan...</span>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium text-foreground">
                Deskripsi / Bio Singkat
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan gambaran singkat atau bio profil..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-y"
              />
            </div>
          </div>

          {/* SECTION 3: Social Media (Multi-Add) */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Media Sosial
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocial}
                className="h-8 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Sosmed</span>
              </Button>
            </div>

            <div className="space-y-3">
              {socials.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  Belum ada media sosial ditambahkan.
                </p>
              ) : (
                socials.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <select
                      value={item.platform}
                      onChange={(e) =>
                        updateSocial(item.id, "platform", e.target.value)
                      }
                      className="h-9 px-2.5 text-xs font-medium rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 w-36"
                    >
                      {socialPlatforms.map((plat) => (
                        <option key={plat} value={plat}>
                          {plat}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="url"
                      value={item.url}
                      onChange={(e) =>
                        updateSocial(item.id, "url", e.target.value)
                      }
                      placeholder="https://..."
                      className="h-9 text-xs flex-1"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocial(item.id)}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 4: Web & Portofolio (Multi-Add) */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Website / Donasi / Portofolio
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWebsite}
                className="h-8 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Web</span>
              </Button>
            </div>

            <div className="space-y-3">
              {websites.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  Belum ada tautan website ditambahkan.
                </p>
              ) : (
                websites.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <select
                      value={item.platform}
                      onChange={(e) =>
                        updateWebsite(item.id, "platform", e.target.value)
                      }
                      className="h-9 px-2.5 text-xs font-medium rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 w-36"
                    >
                      {webPlatforms.map((web) => (
                        <option key={web} value={web}>
                          {web}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="url"
                      value={item.url}
                      onChange={(e) =>
                        updateWebsite(item.id, "url", e.target.value)
                      }
                      placeholder="https://..."
                      className="h-9 text-xs flex-1"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWebsite(item.id)}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 5: Orang Terdekat (Multi-Add) */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Orang Terdekat / Relasi
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Keluarga, manajer, atau rekan dekat
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addClosePerson}
                className="h-8 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Relasi</span>
              </Button>
            </div>

            <div className="space-y-3">
              {closePersons.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  Belum ada relasi orang terdekat.
                </p>
              ) : (
                closePersons.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-muted/30 p-2.5 rounded-lg border border-border/60"
                  >
                    {/* Status / Hubungan */}
                    <div className="sm:col-span-3">
                      <Input
                        type="text"
                        placeholder="Hubungan (ex: Kakak, Manajer)"
                        value={item.relation}
                        onChange={(e) =>
                          updateClosePerson(item.id, "relation", e.target.value)
                        }
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    {/* Platform Sosmed */}
                    <div className="sm:col-span-3">
                      <select
                        value={item.platform}
                        onChange={(e) =>
                          updateClosePerson(item.id, "platform", e.target.value)
                        }
                        className="w-full h-9 px-2.5 text-xs font-medium rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {socialPlatforms.map((plat) => (
                          <option key={plat} value={plat}>
                            {plat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tautan Profil */}
                    <div className="sm:col-span-5">
                      <Input
                        type="url"
                        placeholder="Link Sosmed (https://...)"
                        value={item.url}
                        onChange={(e) =>
                          updateClosePerson(item.id, "url", e.target.value)
                        }
                        className="h-9 text-xs bg-background"
                      />
                    </div>

                    {/* Tombol Hapus */}
                    <div className="sm:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClosePerson(item.id)}
                        className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
