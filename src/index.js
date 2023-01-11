import {send_to_openai} from './openai.mjs'
import Koa from 'koa';
import bodyParser from 'koa-body';
const app = new Koa();

// response
app.use(async ctx => {
    try {
        await bodyParser({
            multipart: true,
            formidable: {
                maxFileSize: 3145728,
            },
        })(ctx, async () => {})

        const q = ctx.request.body.q;
        if (!q) {
            ctx.body = '';
            return;
        }

        const a = await send_to_openai(q);

        console.log("Q:", q);
        console.log("A:", a);
        console.log();

        ctx.body = a
    } catch (err) {}
});

app.listen(3000);
console.log('listening on port 3000');
