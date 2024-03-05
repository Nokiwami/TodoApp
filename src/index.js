"use strict";

const app = require("./app");
const database = require("./database");

const main = async () => {
  await database.init(["toDoList"]);
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

main();
