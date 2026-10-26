const prisma = require("../db");

function createPost(data) {
  return prisma.post.create({ data });
}

module.exports = { createPost };
