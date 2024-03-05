"use strict";

const fs = require("fs");
const path = require("path");

const DB_DIR = path.resolve(__dirname, "../db");
const DB_FILE = path.resolve(DB_DIR, "db.json");

class Database {
  initDB = async (tableName) => {
    const db = await this.readDB();
    if (tableName in db === false) {
      db[tableName] = {};
      db[tableName].id = 0;
      db[tableName].records = [];
    }
    await this.writeDB(db);
  };

  readDB = async () => {
    const db = await fs.promises.readFile(DB_FILE);
    return JSON.parse(db);
  };

  writeDB = async (db) => {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(db));
  };
}

const database = new Database();

const init = async (tables) => {
  if (fs.existsSync(DB_DIR) === false) {
    await fs.mkdirSync(DB_DIR);
  }
  if (fs.existsSync(DB_FILE) === false) {
    await database.writeDB({});
  }

  for (const table of tables) {
    await database.initDB(table);
  }
};

module.exports = {
  init,
  database
};
