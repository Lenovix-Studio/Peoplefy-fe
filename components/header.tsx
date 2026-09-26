"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddPeopleModal } from "@/components/add-people-modal";

interface HeaderProps {
  left?: React.ReactNode | boolean;
  center?: React.ReactNode | boolean;
  right?: React.ReactNode | boolean;
  searchPlaceholder?: string;
}

export function Header({
  left = true,
  center = true,
  right = true,
  searchPlaceholder = "Search...",
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderSlot = (
    propValue: React.ReactNode | boolean,
    defaultContent: React.ReactNode,
  ) => {
    if (propValue === false) return null;
    if (propValue === true || propValue === undefined || propValue === null) {
      return defaultContent;
    }
    return propValue;
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left Section */}
        {left !== false && (
          <div className="flex items-center">
            {renderSlot(
              left,
              <Link
                href="/"
                className="flex items-center gap-3 group select-none"
              >
                <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm group-hover:scale-105 transition-all">
                  P
                </div>
                <h1 className="font-black text-lg tracking-tighter uppercase text-foreground group-hover:text-primary transition-colors">
                  People
                  <span className="text-primary/90 font-light lowercase">
                    fy
                  </span>
                </h1>
              </Link>,
            )}
          </div>
        )}

        {/* Center Section */}
        {center !== false && (
          <div className="flex-1 max-w-[40%] hidden md:block">
            {renderSlot(
              center,
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary pointer-events-none" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full h-9 pl-9 pr-4 bg-background border-border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-xs rounded-lg text-sm"
                />
              </div>,
            )}
          </div>
        )}

        {/* Right Section */}
        {right !== false && (
          <div className="flex items-center gap-3">
            {renderSlot(
              right,
              <>
                <Button
                  size="sm"
                  className="group h-9 px-3.5 shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:rotate-45" />
                    <span>Setting</span>
                  </Link>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="group h-9 px-3.5 shadow-xs font-semibold tracking-tight cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                  <span>Add People</span>
                </Button>
              </>,
            )}
          </div>
        )}
      </header>

      {/* Modal Dialog */}
      <AddPeopleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
