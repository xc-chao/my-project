const Koa = require('koa'); // 引入koa
const Router = require('koa-router'); // 引入koa-router
const axios = require('axios'); // 引入axios
const bodyParser = require('koa-bodyparser'); // 引入koa-bodyparser

const app = new Koa();
const router = new Router();

// CORS 中间件
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*'); // 允许特定域名
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE'); // 允许的请求方法
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头

    if (ctx.method === 'OPTIONS') {
        ctx.status = 204; // No Content
        return;
    }
    await next();
});

// 使用bodyParser中间件  
app.use(bodyParser());

// 路由
router.post('/chatai', async (ctx) => {
    const { message } = ctx.request.body; // 从请求体中获取消息

    if (!message) {
        ctx.status = 400; // 错误请求
        ctx.body = {
            code: 400,
            message: 'Message is required'
        };
        return;
    }

    const data = {
        model: 'deepseek-r1:1.5b', // 使用的模型名称
        messages: [
            {
                role: 'user',
                content: message // 用户输入的消息
            }
        ],
        // stream的意思是流式输出
        stream: false // 设置为 false 以获取完整响应
    };

    try {
        // 调用 DeepSeek 模型的 API
        const response = await axios.post('http://localhost:11434/api/chat', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log('Response:', response.data); // 记录响应 确定里面有content属性，且就是我们想要的内容
        // 返回模型的响应
        ctx.body = {
            code: 200,
            message: response.data.message.content // 假设返回的结构是 { message: { content: '...' } }
        };
    } catch (error) {
        console.error('Error:', error); // 记录错误
        ctx.status = 500; // 服务器内部错误
        ctx.body = {
            code: 500,
            message: 'Internal Server Error'
        };
    }
});

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
app.listen(3000, () => {
    console.log('服务器启动成功，监听端口 3000');
});