"use strict";

const PromiseRouter = require("express-promise-router");
const moment = require("moment");
const express = require("express");
const path = require("path");

const {
  getToDoById,
  editToDo,
  createToDo,
  deleteToDoById,
  deleteAllToDo,
  allsortByImportance,
  allsortByDeadline,
  allsortBygenre,
  completeTask
} = require("./to-do.service");

const toDoRouter = PromiseRouter();

toDoRouter.use(express.static(path.resolve(__dirname, "public")));

toDoRouter.get("/:id", async (req, res) => {
  const toDo = await getToDoById(parseInt(req.params.id, 10));
  const prevDeadline = await moment(
    toDo.deadlineDate + "T" + toDo.deadlineTime,
    "YYYY/MM/DDTHH:mm"
  ).format("YYYY-MM-DDTHH:mm");
  const current = await moment().format("YYYY-MM-DDTHH:mm");
  res.render("edit_to_do", { toDo, prevDeadline, current });
});

toDoRouter.put("/:id", async (req, res) => {
  await editToDo(
    parseInt(req.params.id, 10),
    req.body.content,
    req.body.supplement,
    req.body.priority,
    req.body.deadline,
    req.body.genre
  );
  res.redirect("/to-do-app");
});

toDoRouter.post("/", async (req, res) => {
  await createToDo(
    req.body.content,
    req.body.supplement,
    req.body.priority,
    req.body.deadline,
    req.body.genre,
    req.body.complete
  );
  res.redirect("/to-do-app");
});

toDoRouter.delete("/:id", async (req, res) => {
  await deleteToDoById(parseInt(req.params.id, 10));
  res.redirect("/to-do-app");
});

toDoRouter.delete("/", async (req, res) => {
  await deleteAllToDo();
  res.redirect("/to-do-app");
});

toDoRouter.post("/allsortByDeadline", async (req, res) => {
  await allsortByDeadline();
  res.redirect("/to-do-app");
});

toDoRouter.post("/allsortByImportance", async (req, res) => {
  await allsortByImportance();
  res.redirect("/to-do-app");
});

toDoRouter.post("/allsortBygenre", async (req, res) => {
  await allsortBygenre();
  res.redirect("/to-do-app");
});

toDoRouter.post("/:id", async (req, res) => {
  await completeTask(parseInt(req.params.id, 10));
  res.redirect("/to-do-app");
});

module.exports = {
  toDoRouter
};
