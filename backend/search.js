import {
  getEmbedding
}
from "./embedding.js";

import {
  getTable
}
from "./lancedb.js";

export async function searchFiles(
  query,
  topK = 3
) {

  const table =
    await getTable();

  if (!table) {

    return "";
  }

  const embedding =
    await getEmbedding(
      query
    );

  const result =
    await table
      .search(embedding)
      .limit(topK)
      .toArray();

  let context = "";

  for (const item of result) {

    context +=
      `===== ${item.file} =====\n`;

    context +=
      item.content;

    context +=
      "\n\n";
  }

  return context;
}