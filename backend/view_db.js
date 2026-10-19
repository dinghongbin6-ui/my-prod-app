import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./chat_memory.db");

db.all(
  "SELECT * FROM chat_messages",
  [],
  (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    console.table(rows);

    db.close();
  }
);