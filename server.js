const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const Router = require('koa-router');
const MsgGenerator = require('./js/MsgGenerator');

const app = new Koa();

app.use(async (ctx, next) => {
  // Так как frontend на ходится на сервере, то CORS не нужен.
  // ctx.response.set('Access-Control-Allow-Origin', 'http://localhost:8080');

  // ajax (rxjs) отправляет запрос с заголовком 'X-Requested-With'.
  // Нужно разрешать, если фронтенд на другом домене.
  // ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With');
  await next();
});

const dirPublic = path.join(__dirname, 'public');
app.use(koaStatic(dirPublic));

const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());

const msgGenerator = new MsgGenerator();
msgGenerator.start();

const getMessages = async (ctx) => {
  const id = ctx.params.id ? ctx.params.id : '';

  ctx.response.body = JSON.stringify({
    timestamp: Date.now(),
    messages: msgGenerator.getLastMessages(id),
    status: msgGenerator.isFinish ? 'finish' : 'ok',
  });
};

router.get('/messages/unread', getMessages);

router.get('/messages/unread/:id', getMessages);

const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));
