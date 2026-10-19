import db from "./database.js";

export function getHistory(
  sessionId,
  limit = 20
) {
  return new Promise(
    (resolve, reject) => {
      db.all(
        `
        SELECT role, content
        FROM chat_messages
        WHERE session_id = ?
        ORDER BY id DESC
        LIMIT ?
        `,
        [sessionId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows.reverse());
        }
      );
    }
  );
}

export function saveMessage(
  sessionId,
  role,
  content
) {
  return new Promise(
    (resolve, reject) => {
      db.run(
        `
        INSERT INTO
        chat_messages
        (
          session_id,
          role,
          content
        )
        VALUES
        (
          ?, ?, ?
        )
        `,
        [
          sessionId,
          role,
          content
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(true);
        }
      );
    }
  );
}

export function clearSession(
  sessionId
) {
  return new Promise(
    (resolve, reject) => {
      db.run(
        `
        DELETE FROM chat_messages
        WHERE session_id = ?
        `,
        [sessionId],
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(true);
        }
      );
    }
  );
}