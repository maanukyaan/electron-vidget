const { app, BrowserWindow, Tray, Menu, dialog, ipcMain } = require("electron");
const path = require("path");

let win, tray, colorWindow;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
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

  ipcMain.on("sendColor", (event, color) => {
    setColor(color);
    console.log("Color delivered");
    colorWindow.close();
  });

  const opacitySubMenu = Array.from({ length: 10 }, (_, index) => {
    const opacityValue = (index + 1) * 10; // Вычисляем значение opacity в процентах (10%, 20%, 30%, ...)
    return {
      label: `${opacityValue}%`, // Опция для указанной opacity в процентах
      type: "radio",
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
      label: "Color",
      click: () => {
        createColorWindow(); // При клике на "Color" создаем окно выбора цветов
      },
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

// Функция для создания окна выбора цветов
function createColorWindow() {
  colorWindow = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
  });

  colorWindow.loadURL(`file://${__dirname}/app/color.html`); // Создайте файл color.html для выбора цветов

  // Закрываем окно выбора цветов при закрытии
  colorWindow.on("closed", () => {
    colorWindow = null;
  });
}

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

// Функция для установки color элементов
function setColor(color) {
  win.webContents.insertCSS(`
    h1, h2, h3, h4, h5, h6 {
      color: ${color} !important;
    }
  `);
}
