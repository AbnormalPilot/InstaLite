const prisma = require("../db");

function createPost(data) {
  return prisma.post.create({ data });
}

function listPosts() {
  return prisma.post.findMany();
}

module.exports = { createPost, listPosts };
