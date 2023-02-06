import {send_to_openai} from './openai.mjs'
import Koa from 'koa';
import bodyParser from 'koa-body';
const app = new Koa();

// response
app.use(async ctx => {
    try {
        if (ctx.request.headers.origin) {
            ctx.set("access-control-allow-credentials", "true")
            ctx.set("access-control-allow-origin", ctx.request.headers.origin)
        } else {
            ctx.set("access-control-allow-origin", "*")
        }
        ctx.set("access-control-allow-methods", "GET,DELETE,POST,PUT,PATCH,OPTIONS")
        ctx.set("access-control-allow-headers", "content-type,user_name,remote_user")
        ctx.set("access-control-max-age", "600")

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

        console.log("Q:", q);
        let a = ""
        let tryed = 0;
        while ((a == '' || !a) && ++tryed < 3) {
            try {
                a = await send_to_openai(q);
            } catch (err) {
                console.log(err);
            }
        }
        ctx.body = a
    } catch (err) { console.log(err) }
});

app.listen(3000);
console.log('listening on port 3000');
