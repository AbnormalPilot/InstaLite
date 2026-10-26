const prisma = require("../db");

function createPost(data) {
  return prisma.post.create({ data });
}

function listPosts() {
  return prisma.post.findMany();
}

function getPostById(id) {
  return prisma.post.findUnique({ where: { id } });
}

module.exports = { createPost, listPosts, getPostById };
