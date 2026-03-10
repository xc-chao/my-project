import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import { openai } from './app-server.mjs';
import dotenv from 'dotenv';
import useStore from '../store/index'; // Adjust the path as needed

dotenv.config();

// 这require是为了在ESM中使用CommonJS模块
const require = createRequire(import.meta.url);
const outputFilePath = path.resolve('./data/posts-with-embedding.json');

async function processBills() {
  try {
    // Access the static data from the store
    const { originList } = useStore.getState();

    const postsWithEmbedding = [];

    for (const item of originList) {
      for (const bill of item.bills) {
        try {
          // Call OpenAI API to get embeddings
          const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: bill.type_name, // Use relevant text for embedding
          });

          if (response.data) {
            const embedding = response.data[0].embedding;
            postsWithEmbedding.push({
              ...bill,
              embedding,
            });
          } else {
            console.error('Unexpected response structure:', response);
          }
        } catch (apiError) {
          console.error('Error calling OpenAI API:', apiError);
        }
      }
    }

    // Write the embeddings to the output file
    await fs.writeFile(outputFilePath, JSON.stringify(postsWithEmbedding, null, 2), 'utf8');
    console.log('Embeddings have been successfully written to the file.');
  } catch (error) {
    console.error("Error during processing:", error.message);
  }
}

// Execute the asynchronous function
processBills();
