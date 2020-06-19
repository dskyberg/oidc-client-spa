import Koa from "koa";
import Router from "koa-router";

const appRouter = new Router({
    prefix: "/app"
});

appRouter.get('/something', async (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello, world!'
    };
})
export default appRouter;