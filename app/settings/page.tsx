"use client";

import React, { useState } from "react";
import {
  Settings,
  Trash2,
  Plus,
  Pencil,
  AlertTriangle,
  Layers,
  ListTree,
  Check,
  X,
} from "lucide-react";
import { Header } from "@/components/header";

// Tipe Data
interface CommonCodeType {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface CommonCodeDetail {
  id: string;
  typeId: string;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export default function SettingsPage() {
  // Dummy Data State
  const [types, setTypes] = useState<CommonCodeType[]>([
    {
      id: "1",
      code: "STATUS",
      name: "Status Pengerjaan",
      description: "Status alur komik/proyek",
    },
    {
      id: "2",
      code: "PRIORITY",
      name: "Prioritas",
      description: "Tingkat urgensi task",
    },
  ]);

  const [details, setDetails] = useState<CommonCodeDetail[]>([
    {
      id: "d1",
      typeId: "1",
      code: "ONGOING",
      label: "Ongoing",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "d2",
      typeId: "1",
      code: "COMPLETED",
      label: "Completed",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "d3",
      typeId: "1",
      code: "DROPPED",
      label: "Dropped",
      sortOrder: 3,
      isActive: false,
    },
    {
      id: "d4",
      typeId: "2",
      code: "HIGH",
      label: "High",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "d5",
      typeId: "2",
      code: "MEDIUM",
      label: "Medium",
      sortOrder: 2,
      isActive: true,
    },
  ]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>("1");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Filter detail berdasarkan tipe yang dipilih
  const activeType = types.find((t) => t.id === selectedTypeId);
  const filteredDetails = details.filter((d) => d.typeId === selectedTypeId);

  // Handler Hapus Semua Data
  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      "PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data sistem? Tindakan ini tidak dapat dibatalkan!",
    );
    if (confirmed) {
      // TODO: Panggil endpoint API reset database kamu di sini
      alert("Seluruh data berhasil dihapus!");
      setIsDeletingAll(false);
    }
  };

  // Handler CRUD sederhana (Bisa dihubungkan ke Modal form atau Dialog)
  const handleAddType = () => {
    const code = prompt("Masukkan Code Tipe (contoh: GENRE):");
    const name = prompt("Masukkan Nama Tipe (contoh: Genre Komik):");
    if (code && name) {
      const newType: CommonCodeType = {
        id: Date.now().toString(),
        code: code.toUpperCase().trim(),
        name,
        description: "",
      };
      setTypes([...types, newType]);
      setSelectedTypeId(newType.id);
    }
  };

  const handleDeleteType = (id: string) => {
    if (confirm("Hapus type ini beserta seluruh detail di dalamnya?")) {
      setTypes(types.filter((t) => t.id !== id));
      setDetails(details.filter((d) => d.typeId !== id));
      if (selectedTypeId === id) {
        setSelectedTypeId(types.find((t) => t.id !== id)?.id || "");
      }
    }
  };

  const handleAddDetail = () => {
    if (!selectedTypeId) return;
    const code = prompt("Masukkan Kode Detail (contoh: ACTION):");
    const label = prompt("Masukkan Label (contoh: Action):");
    if (code && label) {
      const newDetail: CommonCodeDetail = {
        id: Date.now().toString(),
        typeId: selectedTypeId,
        code: code.toUpperCase().trim(),
        label,
        sortOrder: filteredDetails.length + 1,
        isActive: true,
      };
      setDetails([...details, newDetail]);
    }
  };

  const handleDeleteDetail = (id: string) => {
    if (confirm("Hapus item detail ini?")) {
      setDetails(details.filter((d) => d.id !== id));
    }
  };

  return (
    <>
      <Header
        center={
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" /> Pengaturan Sistem
            </h1>
          </div>
        }
      />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Bagian 1: Master-Detail Common Code */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Common Code Management
            </h2>
            <p className="text-xs text-neutral-500">
              Pilih Tipe pada tabel atas untuk melihat dan mengelola Detail
              Kodenya di tabel bawah.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Tabel 1: Common Code Type (Atas) */}
            <div className="w-full bg-white dark:bg-neutral-900 border rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Code Types</h3>
                </div>
                <button
                  onClick={handleAddType}
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
                    {types.map((item) => {
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteType(item.id);
                              }}
                              className="p-1 hover:text-red-600 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {types.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-6 text-neutral-400 text-xs"
                        >
                          Belum ada Code Type.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel 2: Detail Common Code (Bawah) */}
            <div className="w-full bg-white dark:bg-neutral-900 border rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">
                <div className="flex items-center gap-2">
                  <ListTree className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">
                    Detail Code {activeType ? `(${activeType.code})` : ""}
                  </h3>
                </div>
                <button
                  disabled={!selectedTypeId}
                  onClick={handleAddDetail}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Detail
                </button>
              </div>

              {/* Kontainer scroll vertikal: max-h-[230px] menampung ~5 baris */}
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
                    {filteredDetails.map((detail) => (
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
                            onClick={() => handleDeleteDetail(detail.id)}
                            className="p-1 hover:text-red-600 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredDetails.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-neutral-400 text-xs"
                        >
                          Tidak ada detail code untuk tipe ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 2: Danger Zone (Hapus Semua Data) */}
        <div className="border border-red-200 dark:border-red-900/60 rounded-xl bg-red-50/30 dark:bg-red-950/10 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Menghapus semua data komik, task, transaksi, dan histori yang
                ada di Komify. Tindakan ini bersifat destruktif permanen dan
                tidak dapat dipulihkan.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDeleteAllData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
