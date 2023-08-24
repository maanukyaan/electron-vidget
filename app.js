const { app, BrowserWindow, Tray, nativeImage } = require("electron");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
  });

  win.loadURL(`file://${__dirname}/app/index.html`);
  win.show();

  // Emitted when the window is closed.
  win.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

// // Обработчик события закрытия окна
// win.on("close", (event) => {
//   // Отменяем закрытие окна
//   event.preventDefault();

//   // Скрываем окно
//   win.hide();
// });

// // Путь к иконке для трея
// const trayIcon = nativeImage.createFromPath(path.join(__dirname, "logo.ico"));

// let tray;

// // Создайте трей и установите в него иконку
// function createTray() {
//   tray = new Tray(trayIcon);
//   // Создание контекстного меню для трея
//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: "Exit",
//       click: () => {
//         app.exit();
//       },
//     },
//   ]);

//   // Установка контекстного меню для трея
//   tray.setContextMenu(contextMenu);

//   // Обработчик события двойного клика по иконке в трее
//   tray.on("double-click", () => {
//     // Показываем окно, если оно скрыто
//     if (!win.isVisible()) {
//       win.show();
//     }
//   });
// }

app.whenReady().then(() => {
  createWindow();
});
