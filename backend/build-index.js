import fs from "fs";
import path from "path";
import { fileURLToPath }
  from "url";

import { getEmbedding }
  from "./embedding.js";

import {
  db,
  getTable
} from "./lancedb.js";

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

const knowledgeDir =
  path.join(
    __dirname,
    "knowledge"
  );

function splitText(
  text,
  chunkSize = 1000,
  overlap = 200
) {

  const chunks = [];

  let start = 0;

  while (
    start < text.length
  ) {

    chunks.push(
      text.slice(
        start,
        start + chunkSize
      )
    );

    start +=
      chunkSize - overlap;
  }

  return chunks;
}

async function build() {

  let table =
    await getTable();

  const files =
    fs.readdirSync(
      knowledgeDir
    );

  const rows = [];

  for (const file of files) {

    const fullPath =
      path.join(
        knowledgeDir,
        file
      );

    if (
      !fs
        .statSync(fullPath)
        .isFile()
    ) {
      continue;
    }

    const content =
      fs.readFileSync(
        fullPath,
        "utf8"
      );
      console.log(content)
    const cleanedContent = content
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const chunks =
      splitText(
        cleanedContent
      );
      console.log(chunks)
       console.log("ok")
    console.log(
      `${file} -> ${chunks.length} chunks`
    );

    const embeddings =
      await Promise.all(
        chunks.map(
          chunk =>
            getEmbedding(
              chunk
            )
        )
      );
      console.log(embeddings)
    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {

      rows.push({
        id:
          `${file}-${i}`,

        file,

        chunkId:
          i + 1,

        content:
          chunks[i],

        vector:
          embeddings[i]
      });
    }
  }

  if (
    rows.length === 0
  ) {

    console.log(
      "No files found."
    );

    return;
  }

  if (!table) {

    console.log(
      "Creating table..."
    );
   
    table =
      await db.createTable(
        "knowledge",
        rows
      );

  } else {

    console.log("22222222222222222222222222222222222222222222222222222222")
    console.log(rows)
    console.log(
      "Rebuilding table..."
    );

    try {

      await table.delete(
        "id != ''"
      );

    } catch (
      error
    ) {

      console.log(
        "Skip delete."
      );
    }

    await table.add(
      rows
    );

  }

  console.log(
    `Done. Indexed ${rows.length} chunks`
  );
}

build().catch(
  console.error
);