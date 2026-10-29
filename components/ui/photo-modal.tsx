"use client";
import * as React from "react";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export function PhotoModal({
  src,
  alt,
  children,
  onClose,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open && onClose) onClose();
        handleResetZoom();
      }}
    >
      <DialogPrimitive.Trigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md animate-in fade-in duration-200" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between text-white pb-2 border-b border-zinc-800 shrink-0 h-14">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-center items-center">
              <div className="flex gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-white shadow-xs">
                <button
                  onClick={() => setScale((prev) => Math.max(prev - 0.2, 1))}
                  disabled={scale <= 1}
                  className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  disabled={scale === 1}
                  className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setScale((prev) => Math.min(prev + 0.2, 4))}
                  disabled={scale >= 4}
                  className="p-2 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-1/3 flex justify-end items-center gap-2">
              <DialogPrimitive.Close className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className="flex-1 w-full flex items-center justify-center p-2 relative overflow-auto scrollbar-none select-none"
            style={{ touchAction: "none" }}
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartPos({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              });
            }}
            onMouseMove={(e) => {
              if (isDragging)
                setPosition({
                  x: e.clientX - startPos.x,
                  y: e.clientY - startPos.y,
                });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
              className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl origin-center transition-transform duration-100 ease-out ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
