const session = require('koa-session');
const Koa = require('koa');
const koarouter = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const bodyparser = require('koa-bodyparser');
var mysql = require('mysql');

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'koa_practice1',
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 60000,
    // The maximum age of a valid session; milliseconds:
    expiration: 6000000,
};

var sessionStore = new MySQLStore(options);

const app = new Koa();
const router = new koarouter();

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 6000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


// db connection later
const things = ["family", "programming", "music"];

// bodyparser middleware
app.use(bodyparser());

render(app,{
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: false
})

options.store=

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

// routes
router.get('/',index);
router.get('/add',showadd);
router.post('/add', add);
router.get('/getviews',getviews);

// router middleware
app.use(router.routes()).use(router.allowedMethods());

async function getviews(ctx) {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  views = n + ' views';
  await ctx.render('getviews',{
    views: views,
    cokkie: ctx.session
  })
}

//list of things
async function index(ctx) {
  await ctx.render('index', {
    title: "things title",
    things: things
  })
}

//showadd page
async function showadd(ctx) {
  await ctx.render('add');
}

//add post
async function add(ctx) {
  const body = ctx.request.body;
  things.push(body.input1)
  ctx.redirect('/');
}

// simple middleware
//app.use(async ctx => ctx.body = "hello world");

router.get('/test', ctx => (ctx.body = "hello world2."));

app.listen(3000, () => console.log("server started on port : 3000"));
