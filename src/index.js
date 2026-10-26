const express = require("express");
const prisma = require("./db");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/users", async (req, res) => {
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

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = Number.isInteger(id)
    ? await prisma.user.findUnique({ where: { id } })
    : null;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { fullname, bio, isPrivate } = req.body ?? {};
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { fullname, bio, isPrivate },
    });
    res.status(200).json(user);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw err;
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw err;
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
