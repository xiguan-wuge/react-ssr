import path from 'path'
import express from "express";
import childProcess from "child_process";
import {renderToString } from 'react-dom/server'
import {Route, Routes, matchRoutes, RouteObject} from 'react-router-dom'
import {StaticRouter} from 'react-router-dom/server'
import {Helmet} from 'react-helmet'

import {port, serverPath} from './config'
import router from '@/router';
import { serverStore } from "@/store";
import { Provider } from "react-redux";

// import Home from '@/pages/Home'

const app = express();

app.use(express.static(path.resolve(process.cwd(), "client_build")));

const bodyParser = require("body-parser");
// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 启一个post服务
app.post("/api/getDemoData", (req, res) => {
  res.send({
    data: req.body,
    status_code: 0,
  });
});


// const content = renderToString(<Home />)


app.get("*", (req, res) => {
  // res.send(`
  //   <html
  //     <body>
  //       <div id="root">${content}</div>
  //       <script src="/index.js"></script>
  //     </body>
  //   </html>
  // `);

  // 服务器端拉取对应的初始化方法，并统一请求注入它们
  const routeMap = new Map<string, () => Promise<any>>()
  router?.forEach(item => {
    if(item.path && item.loadData) {
      routeMap.set(item.path, item.loadData(serverStore))
    }
  })
  // 匹配到当前路由的routes
  const matchedRoutes = matchRoutes(router as RouteObject[], req.path)
  const promises: Array<() => Promise<any>> = [] 
  matchedRoutes?.forEach(item => {
    if(routeMap.has(item.pathname)) {
      promises.push(routeMap.get(item.pathname) as () => Promise<any>)
    }
  })

  Promise.all(promises).then(() => {
    // 统一放到state中
    // 编译需要渲染到tsx,转成对应的HTML String
    const content = renderToString(
      <Provider store={serverStore}>
        <StaticRouter location={req.path}>
          <Routes>
            {
              router?.map((item, index) => {
                return <Route {...item} key={index} />
              })
            }
          </Routes>
        </StaticRouter>
      </Provider>
    )

    const helmet = Helmet.renderStatic()
    res.send(`
      <html>
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
        </head>
        <body>
          <div id="root">${content}</div>
          <script src="/index.js"></script>
        </body>
      </html>
    `)
  })
});

app.listen(port, () => {
  console.log(`ssr-server listen on port`);
});

childProcess.exec(`start ${serverPath}`);
