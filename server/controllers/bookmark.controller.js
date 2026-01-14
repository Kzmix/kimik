import * as service from "../services/bookmark.service.js";

export async function toggleBookmark(req, res) {
  try {
    const userId = req.session.user.id;
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ error: "INVALID_SLUG" });
    }

    const bookmarked = await service.toggle(userId, slug);
    res.json({ bookmarked });

  } catch (err) {
    console.error("BOOKMARK ERROR:", err);
    res.status(500).json({ error: "BOOKMARK_FAILED" });
  }
}

export async function getBookmarks(req, res) {
  const userId = req.session.user.id;
  const bookmarks = await service.getByUser(userId);
  res.json(bookmarks);
}

export async function checkBookmark(req, res) {
  const userId = req.session.user.id;
  const { slug } = req.params;

  const bookmarked = await service.isBookmarked(userId, slug);
  res.json({ bookmarked });
}