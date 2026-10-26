require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
