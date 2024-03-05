"use strict";

const { database } = require("../database");

const dayOfWeek = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];

const getToDoById = async (id) => {
  const db = await database.readDB();

  // データベースの中身一覧を表示（確認用）
  // console.log(db.toDoList.records);

  return db.toDoList.records.find((record) => record.id === parseInt(id));
};

const editToDo = async (id, content, supplement, priority, deadline, genre) => {
  const db = await database.readDB();
  const deadlineObj = new Date(deadline);
  const date = deadlineObj.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo"
  });
  let day = "";
  const dayOfWeekIndex = deadlineObj.getDay();
  if (dayOfWeekIndex in dayOfWeek) {
    day = dayOfWeek[dayOfWeekIndex];
  }
  const time = deadlineObj
    .toLocaleTimeString("ja-JP", {
      timeZone: "Asia/Tokyo"
    })
    .match(/\d{1,2}:\d{1,2}/);

  const index = db.toDoList.records.findIndex(
    (record) => record.id === parseInt(id)
  );
  db.toDoList.records[index] = {
    id,
    content,
    supplement,
    priority,
    deadlineDate: date,
    deadlineDay: day,
    deadlineTime: time,
    genre,
    complete: db.toDoList.records[index].complete
  };

  await database.writeDB(db);
};

const parseStrDateTimeElement = (element) => {
  const strDate = element
    .getElementsByClassName("deadline-date-day")[0]
    .textContent.match(/\d{4}\/\d{1,2}\/\d{1,2}/)[0]
    .split("/");
  const year = strDate[0];
  const month = strDate[1];
  const date = strDate[2];
  const strTime = element
    .getElementsByClassName("deadline-time")[0]
    .textContent.split(":");
  const hour = strTime[0];
  const minute = strTime[1];
  return [year, month, date, hour, minute];
};

const createToDo = async (
  content,
  supplement,
  priority,
  deadline,
  genre,
  complete
) => {
  const db = await database.readDB();
  const deadlineObj = new Date(deadline);
  const date = deadlineObj.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo"
  });
  let day = "";
  const dayOfWeekIndex = deadlineObj.getDay();
  if (dayOfWeekIndex in dayOfWeek) {
    day = dayOfWeek[dayOfWeekIndex];
  }
  const time = deadlineObj
    .toLocaleTimeString("ja-JP", {
      timeZone: "Asia/Tokyo"
    })
    .match(/\d{1,2}:\d{1,2}/);

  db.toDoList.records.push({
    id: db.toDoList.id++,
    content,
    supplement,
    priority,
    deadlineDate: date,
    deadlineDay: day,
    deadlineTime: time,
    genre,
    complete: false
  });
  await database.writeDB(db);
};

const getToDoList = async () => {
  const db = await database.readDB();
  return db.toDoList.records;
};

const deleteToDoById = async (id) => {
  const db = await database.readDB();
  db.toDoList.records = db.toDoList.records.filter(
    (record) => record.id !== id
  );
  await database.writeDB(db);
};

const deleteAllToDo = async () => {
  const db = await database.readDB();
  db.toDoList.records = [];
  db.toDoList.id = 0;
  await database.writeDB(db);
};

const allsortByDeadline = async () => {
  const db = await database.readDB();
  db.toDoList.records.sort((a, b) => {
    const deadlineA = new Date(a.deadlineDate + " " + a.deadlineTime.join(":"));
    const deadlineB = new Date(b.deadlineDate + " " + b.deadlineTime.join(":"));
    return deadlineA - deadlineB;
  });
  await database.writeDB(db);
};

const allsortByImportance = async () => {
  const db = await database.readDB();
  const priorityMap = { high: 3, middle: 2, low: 1 };
  db.toDoList.records.sort(
    (b, a) => priorityMap[a.priority] - priorityMap[b.priority]
  );
  await database.writeDB(db);
};

const allsortBygenre = async () => {
  const db = await database.readDB();
  const genreMap = { 課題: 5, 仕事: 4, あそび: 3, ごはん: 2, デート: 1 };
  db.toDoList.records.sort((b, a) => genreMap[a.genre] - genreMap[b.genre]);
  await database.writeDB(db);
};

const completeTask = async (id) => {
  const db = await database.readDB();
  const find = db.toDoList.records.find((record) => record.id === id);

  if (find) {
    find.complete = !find.complete;
  }

  await database.writeDB(db);
};

module.exports = {
  getToDoById,
  editToDo,
  parseStrDateTimeElement,
  createToDo,
  getToDoList,
  deleteToDoById,
  deleteAllToDo,
  allsortByDeadline,
  allsortByImportance,
  allsortBygenre,
  completeTask
};
