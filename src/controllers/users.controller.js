const usersService = require("../services/users.service");

async function create(req, res) {
  const { username, email, fullname, bio } = req.body ?? {};
  if (!username || !email || !fullname) {
    return res
      .status(400)
      .json({ error: "username, email and fullname are required" });
  }
  try {
    const user = await usersService.createUser({
      username,
      email,
      fullname,
      bio,
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    throw err;
  }
}

async function list(req, res) {
  const users = await usersService.listUsers();
  res.status(200).json(users);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id)
    ? await usersService.getUserById(id)
    : null;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { fullname, bio, isPrivate } = req.body ?? {};
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const user = await usersService.updateUser(id, { fullname, bio, isPrivate });
    res.status(200).json(user);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw err;
  }
}

async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    await usersService.deleteUser(id);
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw err;
  }
}

module.exports = { create, list, getOne, update, remove };
