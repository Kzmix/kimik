import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PATH ABSOLUT YANG AMAN
 */
const FILE = path.join(__dirname, "../data/users.json");

async function readUsers(){
  try {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(FILE, "[]");
      return [];
    }
    throw err;
  }
}

async function saveUsers(users){
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

export async function findUser(username){
  const users = await readUsers();
  return users.find(u => u.username === username);
}

export async function createUser({ username, password }){
  const users = await readUsers();

  if (users.find(u => u.username === username)) {
    throw new Error("USER_EXISTS");
  }

  const user = {
    id: Date.now(),
    username,
    password
  };

  users.push(user);
  await saveUsers(users);

  return user;
}