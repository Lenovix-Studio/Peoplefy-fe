export async function ensureCompatibleImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<File> {
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name);

  if (!isHeic) {
    onProgress?.(100);
    return file;
  }

  try {
    onProgress?.(20);
    const heic2any = (await import("heic2any")).default;
    onProgress?.(50);
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    onProgress?.(90);

    const blob = Array.isArray(converted) ? converted[0] : converted;
    const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");

    onProgress?.(100);
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    onProgress?.(100);
    return file;
  }
}
