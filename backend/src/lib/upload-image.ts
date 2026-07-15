import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads/images",
);

export async function uploadImage(imageBuffer: Buffer): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const filename = `${crypto.randomUUID()}.jpg`;
  const filepath = path.join(UPLOADS_DIR, filename);
  await writeFile(filepath, imageBuffer);

  return `/uploads/images/${filename}`;
}
