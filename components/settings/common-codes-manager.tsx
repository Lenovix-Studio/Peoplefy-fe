"use client";

import React, { useState, useEffect } from "react";
import { Layers, ListTree, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { CommonCodeType, CommonCodeDetail } from "@/types/common-code";
import { API_URL } from "@/constant/variable";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommonCodesManagerProps {
  initialTypes: CommonCodeType[];
}

export function CommonCodesManager({ initialTypes }: CommonCodesManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [types, setTypes] = useState<CommonCodeType[]>(initialTypes);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    initialTypes[0]?.id || "",
  );
  const [details, setDetails] = useState<CommonCodeDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [newTypeCode, setNewTypeCode] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newDetailCode, setNewDetailCode] = useState("");
  const [newDetailLabel, setNewDetailLabel] = useState("");
  const [isEditTypeOpen, setIsEditTypeOpen] = useState(false);
  const [editTypeId, setEditTypeId] = useState("");
  const [editTypeCode, setEditTypeCode] = useState("");
  const [editTypeName, setEditTypeName] = useState("");
  const [isEditDetailOpen, setIsEditDetailOpen] = useState(false);
  const [editDetailId, setEditDetailId] = useState("");
  const [editDetailCode, setEditDetailCode] = useState("");
  const [editDetailLabel, setEditDetailLabel] = useState("");
  const [editDetailSortOrder, setEditDetailSortOrder] = useState(0);
  const [editDetailIsActive, setEditDetailIsActive] = useState(true);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{
    isOpen: boolean;
    type: "type" | "detail" | null;
    id: string;
  }>({ isOpen: false, type: null, id: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const reloadTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/common-codes/types`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setTypes(data);
        if (data.length > 0 && !selectedTypeId) {
          setSelectedTypeId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to reload types:", error);
    }
  };

  const fetchDetails = async (typeId: string) => {
    if (!typeId) return;
    setLoadingDetails(true);
    try {
      const res = await fetch(
        `${API_URL}/common-codes/types/${typeId}/details`,
        {
          cache: "no-store",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedTypeId) {
      fetchDetails(selectedTypeId);
    } else {
      setDetails([]);
    }
  }, [selectedTypeId]);

  const activeType = types.find((t) => t.id === selectedTypeId);

  const handleAddType = async () => {
    if (!newTypeCode || !newTypeName) {
      toast.error("Code dan Nama tidak boleh kosong!");
      return;
    }
    const tid = toast.loading("Menambahkan Type...");
    try {
      const res = await fetch(`${API_URL}/common-codes/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newTypeCode.toUpperCase().trim(),
          name: newTypeName,
          description: "",
        }),
      });
      if (res.ok) {
        toast.success("Berhasil menambahkan Code Type!", { id: tid });
        setIsTypeDialogOpen(false);
        setNewTypeCode("");
        setNewTypeName("");
        reloadTypes();
      } else {
        toast.error("Gagal menambahkan Type. Mungkin code sudah ada.", {
          id: tid,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    }
  };

  const handleUpdateType = async () => {
    if (!editTypeCode || !editTypeName) {
      toast.error("Code dan Nama tidak boleh kosong!");
      return;
    }
    const tid = toast.loading("Menyimpan perubahan Type...");
    try {
      const res = await fetch(`${API_URL}/common-codes/types/${editTypeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editTypeCode.toUpperCase().trim(),
          name: editTypeName,
        }),
      });
      if (res.ok) {
        toast.success("Berhasil memperbarui Code Type!", { id: tid });
        setIsEditTypeOpen(false);
        reloadTypes();
      } else {
        toast.error("Gagal memperbarui Type. Mungkin code sudah digunakan.", {
          id: tid,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    }
  };

  const handleAddDetail = async () => {
    if (!selectedTypeId) return;
    if (!newDetailCode || !newDetailLabel) {
      toast.error("Code dan Label tidak boleh kosong!");
      return;
    }
    const tid = toast.loading("Menambahkan Detail...");
    try {
      const res = await fetch(
        `${API_URL}/common-codes/types/${selectedTypeId}/details`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: newDetailCode.toUpperCase().trim(),
            label: newDetailLabel,
            sortOrder: details.length + 1,
            isActive: true,
          }),
        },
      );
      if (res.ok) {
        toast.success("Berhasil menambahkan Detail Code!", { id: tid });
        setIsDetailDialogOpen(false);
        setNewDetailCode("");
        setNewDetailLabel("");
        fetchDetails(selectedTypeId);
      } else {
        toast.error("Gagal menambahkan Detail.", { id: tid });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    }
  };

  const handleUpdateDetail = async () => {
    if (!editDetailCode || !editDetailLabel) {
      toast.error("Code dan Label tidak boleh kosong!");
      return;
    }
    const tid = toast.loading("Menyimpan perubahan Detail...");
    try {
      const res = await fetch(
        `${API_URL}/common-codes/details/${editDetailId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: editDetailCode.toUpperCase().trim(),
            label: editDetailLabel,
            sortOrder: Number(editDetailSortOrder),
            isActive: editDetailIsActive,
          }),
        },
      );
      if (res.ok) {
        toast.success("Berhasil memperbarui Detail Code!", { id: tid });
        setIsEditDetailOpen(false);
        fetchDetails(selectedTypeId);
      } else {
        toast.error("Gagal memperbarui Detail.", { id: tid });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmInfo.id || !deleteConfirmInfo.type) return;

    const { type, id } = deleteConfirmInfo;
    const isType = type === "type";
    const endpoint = isType
      ? `${API_URL}/common-codes/types/${id}`
      : `${API_URL}/common-codes/details/${id}`;

    const tid = toast.loading("Menghapus data...");

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Berhasil menghapus ${isType ? "Type" : "Detail"}!`, {
          id: tid,
        });
        if (isType) {
          if (selectedTypeId === id) setSelectedTypeId("");
          reloadTypes();
        } else {
          fetchDetails(selectedTypeId);
        }
      } else {
        toast.error(`Gagal menghapus ${isType ? "Type" : "Detail"}.`, {
          id: tid,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: tid });
    } finally {
      setDeleteConfirmInfo({ isOpen: false, type: null, id: "" });
    }
  };

  const openEditType = (type: CommonCodeType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTypeId(type.id);
    setEditTypeCode(type.code);
    setEditTypeName(type.name);
    setIsEditTypeOpen(true);
  };

  const openEditDetail = (detail: CommonCodeDetail) => {
    setEditDetailId(detail.id);
    setEditDetailCode(detail.code);
    setEditDetailLabel(detail.label);
    setEditDetailSortOrder(detail.sortOrder);
    setEditDetailIsActive(detail.isActive);
    setIsEditDetailOpen(true);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-44 bg-neutral-100 dark:bg-neutral-800/40 rounded-xl" />
        <div className="h-44 bg-neutral-100 dark:bg-neutral-800/40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Code Types Box */}
      <div className="w-full bg-white dark:bg-neutral-900 border rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Code Types</h3>
          </div>
          <button
            onClick={() => setIsTypeDialogOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Type
          </button>
        </div>

        <div className="overflow-x-auto max-h-57.5 overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 text-xs uppercase border-b">
              <tr>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Nama</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700 dark:text-neutral-300">
              {types.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-neutral-400 text-xs"
                  >
                    Belum ada Code Type.
                  </td>
                </tr>
              ) : (
                types.map((item) => {
                  const isSelected = item.id === selectedTypeId;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedTypeId(item.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 font-medium text-primary border-l-4 border-l-primary"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs">
                        {item.code}
                      </td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={(e) => openEditType(item, e)}
                          className="p-1 hover:text-blue-600 rounded cursor-pointer transition-colors"
                          title="Edit Type"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmInfo({
                              isOpen: true,
                              type: "type",
                              id: item.id,
                            });
                          }}
                          className="p-1 hover:text-red-600 rounded cursor-pointer transition-colors"
                          title="Hapus Type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Details Box */}
      <div className="w-full bg-white dark:bg-neutral-900 border rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2">
            <ListTree className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">
              Detail Code: {activeType ? `${activeType.code}` : ""}
            </h3>
          </div>
          <button
            disabled={!selectedTypeId}
            onClick={() => setIsDetailDialogOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Detail
          </button>
        </div>

        <div className="overflow-x-auto max-h-57.5 overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 text-xs uppercase border-b">
              <tr>
                <th className="py-2.5 px-4">Urutan</th>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Label</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700 dark:text-neutral-300">
              {loadingDetails ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-neutral-400 text-xs"
                  >
                    Memuat data detail...
                  </td>
                </tr>
              ) : details.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-neutral-400 text-xs"
                  >
                    Tidak ada detail code untuk tipe ini.
                  </td>
                </tr>
              ) : (
                details.map((detail) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-neutral-400">
                      {detail.sortOrder}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold">
                      {detail.code}
                    </td>
                    <td className="py-3 px-4">{detail.label}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          detail.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {detail.isActive ? (
                          <>
                            <Check className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditDetail(detail)}
                        className="p-1 hover:text-blue-600 rounded cursor-pointer transition-colors"
                        title="Edit Detail"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmInfo({
                            isOpen: true,
                            type: "detail",
                            id: detail.id,
                          })
                        }
                        className="p-1 hover:text-red-600 rounded cursor-pointer transition-colors"
                        title="Hapus Detail"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Code Type</DialogTitle>
            <DialogDescription>
              Buat tipe kategori baru (contoh: GENRE, STATUS).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                placeholder="GENRE"
                value={newTypeCode}
                onChange={(e) => setNewTypeCode(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Tipe</label>
              <Input
                placeholder="Genre Komik"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsTypeDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleAddType}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Type Dialog */}
      <Dialog open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Code Type</DialogTitle>
            <DialogDescription>Ubah data Code Type.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                placeholder="GENRE"
                value={editTypeCode}
                onChange={(e) => setEditTypeCode(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Tipe</label>
              <Input
                placeholder="Genre Komik"
                value={editTypeName}
                onChange={(e) => setEditTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditTypeOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateType}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Code Detail</DialogTitle>
            <DialogDescription>
              Tambahkan detail untuk tipe {activeType?.name || ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                placeholder="ACTION"
                value={newDetailCode}
                onChange={(e) => setNewDetailCode(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder="Action"
                value={newDetailLabel}
                onChange={(e) => setNewDetailLabel(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleAddDetail}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Detail Dialog */}
      <Dialog open={isEditDetailOpen} onOpenChange={setIsEditDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Code Detail</DialogTitle>
            <DialogDescription>
              Ubah data Code Detail untuk tipe {activeType?.name || ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Urutan (Sort Order)</label>
              <Input
                type="number"
                value={editDetailSortOrder}
                onChange={(e) => setEditDetailSortOrder(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                placeholder="ACTION"
                value={editDetailCode}
                onChange={(e) => setEditDetailCode(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder="Action"
                value={editDetailLabel}
                onChange={(e) => setEditDetailLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg border">
              <div>
                <label className="text-sm font-medium">Status Aktif</label>
                <p className="text-xs text-neutral-500">
                  Tentukan apakah kode ini bisa dipilih.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditDetailIsActive(!editDetailIsActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${
                  editDetailIsActive
                    ? "bg-primary"
                    : "bg-neutral-300 dark:bg-neutral-600"
                }`}
              >
                <span className="sr-only">Toggle Active</span>
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                    editDetailIsActive ? "translate-x-2" : "-translate-x-2"
                  }`}
                />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditDetailOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateDetail}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteConfirmInfo.isOpen}
        onOpenChange={(open) => {
          if (!open)
            setDeleteConfirmInfo({ isOpen: false, type: null, id: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              {deleteConfirmInfo.type === "type"
                ? "Apakah Anda yakin ingin menghapus tipe ini beserta SELURUH detail di dalamnya? Tindakan ini tidak dapat dibatalkan."
                : "Apakah Anda yakin ingin menghapus detail kode ini?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setDeleteConfirmInfo({ isOpen: false, type: null, id: "" })
              }
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
