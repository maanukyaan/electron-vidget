const mainHours = document.querySelector("#mainHours"),
  mainMinutes = document.querySelector("#mainMinutes"),
  secondaryHours = document.querySelector("#secondaryHours"),
  secondaryMinutes = document.querySelector("#secondaryMinutes");

function getTime() {
  // Получаем текущее время
  const currentTime = new Date();

  // Создаем объект для полуночи
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  // Вычисляем разницу во времени
  const timeDifference = currentTime - midnight;

  // Вычисляем количество прошедших часов и минут
  mainHours.innerHTML =
    Math.floor(timeDifference / 3600000) < 10
      ? `0${Math.floor(timeDifference / 3600000)}`
      : Math.floor(timeDifference / 3600000); // 1 час = 3600000 миллисекунд
  mainMinutes.innerHTML =
    Math.floor((timeDifference % 3600000) / 60000) < 10
      ? `0${Math.floor((timeDifference % 3600000) / 60000)}`
      : Math.floor((timeDifference % 3600000) / 60000); // 1 минута = 60000 миллисекунд

  // Создаем объект для полуночи следующего дня
  const nextMidnight = new Date();
  nextMidnight.setDate(currentTime.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);

  // Вычисляем разницу во времени
  const secondaryTimeDifference = nextMidnight - currentTime;

  // Вычисляем количество оставшихся часов и минут
  secondaryHours.innerHTML =
    Math.floor(secondaryTimeDifference / 3600000) < 10
      ? `0${Math.floor(secondaryTimeDifference / 3600000)}`
      : Math.floor(secondaryTimeDifference / 3600000); // 1 час = 3600000 миллисекунд
  secondaryMinutes.innerHTML =
    Math.floor((secondaryTimeDifference % 3600000) / 60000) < 10
      ? `0${Math.floor((secondaryTimeDifference % 3600000) / 60000)}`
      : Math.floor((secondaryTimeDifference % 3600000) / 60000); // 1 минута = 60000 миллисекунд
}

getTime();

setInterval(getTime, 1000);

function getData() {
  const currentDate = new Date();

  // Получаем число месяца
  const dayOfMonth = currentDate.getDate();

  // Массив с названиями месяцев
  const monthNames = [
    "ЯНВАРЯ",
    "ФЕВРАЛЯ",
    "МАРТА",
    "АПРЕЛЯ",
    "МАЯ",
    "ИЮНЯ",
    "ИЮЛЯ",
    "АВГУСТА",
    "СЕНТЯБРЯ",
    "ОКТЯБРЯ",
    "НОЯБРЯ",
    "ДЕКАБРЯ",
  ];

  // Получаем название месяца
  const monthName = monthNames[currentDate.getMonth()];

  // Формируем строку
  document.querySelector("h4").innerHTML = `${dayOfMonth} ${monthName}`;

  // Получаем год
  const year = currentDate.getFullYear();

  // Формируем строку
  document.querySelector("h5").innerHTML = `${dayOfMonth}.${
    currentDate.getMonth() + 1 < 10
      ? `0${currentDate.getMonth() + 1}`
      : currentDate.getMonth() + 1
  }.${year}`;

  // Массив с названиями дней недели
  const dayNames = [
    "ВОСКРЕСЕНЬЕ",
    "ПОНЕДЕЛЬНИК",
    "ВТОРНИК",
    "СРЕДА",
    "ЧЕТВЕРГ",
    "ПЯТНИЦА",
    "СУББОТА",
  ];

  // Получаем день недели (от 0 до 6, где 0 - воскресенье, 1 - понедельник и так далее)
  const dayOfWeek = currentDate.getDay();

  // Получаем название дня недели
  document.querySelector("h6").innerHTML = dayNames[dayOfWeek];
}

getData();

setInterval(getData, 1000);
