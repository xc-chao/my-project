import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { openai } from './app-server.mjs';
import fs from 'fs/promises';

const inputFilePath = './data/posts-with-embedding.json';
let posts; // 定义全局变量用于存储加载的数据

// 计算余弦相似度的函数
function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error('向量长度不匹配');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 异步初始化函数，用于加载数据
async function initialize() {
    try {
        const data = await fs.readFile(inputFilePath, 'utf8');
        posts = JSON.parse(data);
        console.log('Data loaded successfully.');
    } catch (error) {
        console.error("Error loading data:", error.message);
        // 可选: 如果文件不存在，可以尝试调用processPosts或其他方法来生成所需的数据
        // 这里假设有一个processPosts函数可以用来生成数据
        // await processPosts();
    }
}

// 初始化应用
initialize();

// 创建Koa应用实例
const app = new Koa();
const router = new Router();
const port = 3000;

app.use(cors());
app.use(bodyParser());

router.post('/search', async (ctx) => {
    const { keyword } = ctx.request.body;
    console.log(keyword);
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: keyword,
        });
        const { embedding } = response.data[0];

        if (!posts || posts.length === 0) {
            ctx.status = 500;
            ctx.body = { message: "Data not ready" };
            return;
        }

        const results = posts.map(item => ({
            ...item,
            similarity: cosineSimilarity(embedding, item.embedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .map((item) => ({
            date: item.date,
            bills: [{
                amount: item.amount,
                date: item.date,
                id: item.id,
                pay_type: item.pay_type,
                type_id: item.type_id,
                type_name: item.type_name,
                remark: item.remark || "",
            }]
        }));

        ctx.body = {
            status: 200,
            data: results
        };
    } catch (error) {
        console.error("Error during OpenAI API request:", error.message);
        ctx.status = 500;
        ctx.body = { message: "Failed to fetch embeddings from OpenAI", details: error.message };
    }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});