const postsService = require("../services/posts.service");

async function create(req, res) {
  const { imageUrl, caption, location } = req.body ?? {};
  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }
  const post = await postsService.createPost({ imageUrl, caption, location });
  res.status(201).json(post);
}

async function list(req, res) {
  const posts = await postsService.listPosts();
  res.status(200).json(posts);
}

module.exports = { create, list };
