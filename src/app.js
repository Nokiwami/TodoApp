"use strict";
const path = require("path");

const PromiseRouter = require("express-promise-router");
const express = require("express");
const methodOverride = require("method-override");
const { toDoRouter } = require("./to_do/to-do.controller");
const { getToDoList } = require("./to_do/to-do.service");

const PORT = 3000;

const app = express();
// テンプレートエンジンに EJS を使うようにする設定
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// クエリパラメータの _method キーの値でリクエストメソッドを上書きする
// 例： /messages?_method=DELETE で DELETE リクエストを受け付ける
app.use(methodOverride("_method"));
// リクエストボディをパースする
app.use(express.urlencoded({ extended: true }));

// 静的ファイルを提供する
app.use(express.static(path.resolve(__dirname, "public")));

// リクエストのルーティング
const router = PromiseRouter();
app.use(router);
app.use("/to-do-app", toDoRouter);

const moment = require("moment");

router.get("/to-do-app", async (req, res) => {
  const toDoList = await getToDoList();
  const current = moment().format("YYYY-MM-DDTHH:mm");
  res.render("to_do_app", { toDoList, current });
});

module.exports = app;
