import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⬇️ path BENAR ke /server/data/bookmarks.json
const filePath = path.join(__dirname, "../data/bookmarks.json");

async function readData() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/* ================================
   TOGGLE BOOKMARK
================================ */
export async function toggle(userId, slug) {
  const data = await readData();

  if (!data[userId]) data[userId] = [];

  const idx = data[userId].indexOf(slug);
  let bookmarked;

  if (idx === -1) {
    data[userId].push(slug);
    bookmarked = true;
  } else {
    data[userId].splice(idx, 1);
    bookmarked = false;
  }

  await writeData(data);
  return bookmarked;
}

export async function getByUser(userId) {
  const data = await readData();
  return data[userId] || [];
}

export async function isBookmarked(userId, slug) {
  const data = await readData();
  return (data[userId] || []).includes(slug);
}