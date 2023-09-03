const { app, BrowserWindow, Tray, Menu, dialog } = require("electron");

let win, tray;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
  });

  win.loadURL(`file://${__dirname}/app/index.html`);
  win.show();

  // Обработчик события закрытия окна
  win.on("close", (event) => {
    // Отменяем закрытие окна
    event.preventDefault();

    // Скрываем окно
    win.hide();
  });

  const opacitySubMenu = Array.from({ length: 10 }, (_, index) => {
    const opacityValue = (index + 1) * 10; // Вычисляем значение opacity в процентах (10%, 20%, 30%, ...)
    return {
      label: `${opacityValue}%`, // Опция для указанной opacity в процентах
      click: () => {
        setOpacity(opacityValue / 100); // Пересчитываем в десятичное значение (0.1, 0.2, 0.3, ...)
      },
    };
  });

  // Создание иконки в системном трее
  tray = new Tray(`${__dirname}/logo.ico`);

  // Создание контекстного меню для трея
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Opacity", // Название меню
      submenu: opacitySubMenu,
    },
    {
    label: "Info",
    click: () => {
      dialog.showMessageBox({
        type: "info",
        title: "Information",
        message: "Made by @kancni",
      });
    },
  },
    {
      label: "Exit", // Опция для выхода из приложения
      click: () => {
        app.exit();
      },
    },
  ]);

  // Установка контекстного меню для трея
  tray.setContextMenu(contextMenu);

  // Обработчик события двойного клика по иконке в трее
  tray.on("double-click", () => {
    // Показываем окно, если оно скрыто
    win.show();
  });
};

app.whenReady().then(() => {
  createWindow();
});

// Функция для установки opacity элементов
function setOpacity(opacity) {
  win.webContents.insertCSS(`
      h1, h2, h3, h4, h5, h6 {
        opacity: ${opacity} !important;
      }
    `);
}
