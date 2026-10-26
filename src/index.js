require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/users", async (req, res) => {
  // Pick only allowed fields so clients can't set id, createdAt, etc.
  const { username, email, fullname, bio } = req.body ?? {};
  if (!username || !email || !fullname) {
    return res
      .status(400)
      .json({ error: "username, email and fullname are required" });
  }
  try {
    const user = await prisma.user.create({
      data: { username, email, fullname, bio },
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    throw err;
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
