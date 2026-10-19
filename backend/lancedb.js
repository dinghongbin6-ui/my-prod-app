import * as lancedb from "@lancedb/lancedb";

export const db =
  await lancedb.connect(
    "./lancedb-data"
  );

export async function getTable() {

  try {

    return await db.openTable(
      "knowledge"
    );

  } catch {

    return null;

  }
}