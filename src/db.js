const os = require("os");
const path = require("path");
const lowdb = require("lowdb");
const localStorage = require("lowdb/adapters/LocalStorage");
// const { aesDecrypt, aesEncrypt } = require("./utils/aes");

// const key = "kongsoft";

const adapter = new localStorage("db");
const db = lowdb(adapter);

db.defaults({
  user: [],
  dlPath: path.normalize(os.homedir() + "/qomo"),
  backupPath: "",
}).write();

export default db;
