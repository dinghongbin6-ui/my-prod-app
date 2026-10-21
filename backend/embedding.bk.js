import dotenv from "dotenv";

dotenv.config();

const LMSTUDIO_URL = process.env.LMSTUDIO_embeddings_API;
const API_KEY = `Bearer ${process.env.LMSTUDIO_KEY}`;

export async function getEmbedding(text) {

  const response =
    await fetch(
      LMSTUDIO_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            API_KEY
        },

        body: JSON.stringify({
          model:
            "text-embedding-nomic-embed-text-v1.5",

          input:
            text
        })
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Embedding Error: ${errorText}`
    );
  }

  const data =
    await response.json();

  return data.data[0].embedding;
}