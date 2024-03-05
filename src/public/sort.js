"use strict";

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

const parsePriorityElement = (element) => {
  const strPriority = element
    .getElementsByClassName("priority-icon")[0]
    .className.replace("priority-icon ", "")
    .replace("-priority", "");
  switch (strPriority) {
    case "high":
      return 1;
    case "middle":
      return 2;
    case "low":
      return 3;
    default:
      return 4;
  }
};

const sortKey = (sortValue) => {
  switch (sortValue) {
    case "deadline":
      return (a, b) => {
        const parsedA = parseStrDateTimeElement(a);
        const deadlineA = Date.parse(new Date(...parsedA));
        const parsedB = parseStrDateTimeElement(b);
        const deadlineB = Date.parse(new Date(...parsedB));
        const priorityA = parsePriorityElement(a);
        const priorityB = parsePriorityElement(b);
        if (deadlineA === deadlineB) {
          return priorityA - priorityB;
        }
        return deadlineA - deadlineB;
      };
    case "priority":
      return (a, b) => {
        const parsedA = parseStrDateTimeElement(a);
        const deadlineA = Date.parse(new Date(...parsedA));
        const parsedB = parseStrDateTimeElement(b);
        const deadlineB = Date.parse(new Date(...parsedB));
        const priorityA = parsePriorityElement(a);
        const priorityB = parsePriorityElement(b);
        if (priorityA === priorityB) {
          return deadlineA - deadlineB;
        }
        return priorityA - priorityB;
      };
    default:
      return "priority";
  }
};

const sort = (sortValue) => {
  const parent = document.querySelector(".to-do-list");
  const toDoItems = parent.querySelectorAll(".to-do-item");
  const toDoItemsArray = Array.from(toDoItems);

  toDoItemsArray.sort(sortKey(sortValue));

  for (let i = 0; i < toDoItemsArray.length; i++) {
    parent.appendChild(parent.removeChild(toDoItemsArray[i]));
  }
};

module.exports = { sort };
