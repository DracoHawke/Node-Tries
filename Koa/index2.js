const koa = require('koa')
session = require('koa-session')
MysqlStore = require('koa2-session-mysql')
const app = new koa() ;

const THIRTY_MINTUES = 30 * 60 * 1000;

const config= {
        host: "localhost",
        user: "root",
        password: "",
        database: "dogmate"
}

app.keys = ['your-session-secret']


app.use(session({
        store: new MysqlStore(config),
        rolling: true,
        cookie: {
            domain: '.app.localhost',
            maxage:10000
        }
}))

app.use(ctx => {
    // ignore favicon
    //if (ctx.path === '/favicon.ico') return;

    // increase counter
    //let n = ctx.session.views || 0;
  //  ctx.session.views = ++n;

    // show counter
    //ctx.body = n + ' views';
    ctx.body = "hello";
});

app.listen(3000);
console.log('listening on port 3000');
