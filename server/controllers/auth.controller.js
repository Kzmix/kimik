import { findUser, createUser } from "../services/user.service.js";

export async function register(req, res){
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "INVALID_DATA" });
  }

  try {
    await createUser({ username, password });
    res.json({ ok: true });
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(409).json({ error: "USER_EXISTS" });
    }
    res.status(500).json({ error: "SERVER_ERROR" });
  }
}

export async function login(req, res){
  const { username, password } = req.body;

  const user = await findUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "INVALID_LOGIN" });
  }

  req.session.user = {
    id: user.id,
    username: user.username
  };

  res.json({ ok: true });
}

export function logout(req, res){
  req.session.destroy(() => {
    res.json({ ok: true });
  });
}

export function me(req, res){
  if (!req.session.user) {
    return res.status(401).json({ error: "NOT_LOGIN" });
  }
  res.json(req.session.user);
}