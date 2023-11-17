const { app, BrowserWindow, Tray, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const AutoLaunch = require("auto-launch");

let autostartEnabled = false;
const autoLauncher = new AutoLaunch({
  name: "Ultra Clock",
  path: app.getPath("exe"),
});

try {
  const configFilePath = path.join(__dirname, "config.txt");
  const configContent = fs.readFileSync(configFilePath, "utf8");
  const configLines = configContent.split("\n");
  const autostartLine = configLines.find((line) =>
    line.startsWith("AUTOSTART=")
  );

  if (autostartLine) {
    const autostartValue = autostartLine.split("=")[1].trim();
    autostartEnabled = autostartValue === "true";
  }
} catch (error) {
  console.error("Error reading config.txt:", error);
}

try {
  autostartEnabled ? autoLauncher.enable() : autoLauncher.disable();
} catch (error) {
  console.error("Error with autostart operation:", error);
}

function updateAutostart() {
  try {
    if (autostartEnabled) {
      autoLauncher.enable().catch((error) => {
        console.error("Error enabling autostart:", error);
      });
    } else {
      autoLauncher.disable().catch((error) => {
        console.error("Error disabling autostart:", error);
      });
    }

    const configFilePath = path.join(__dirname, "config.txt");
    const newConfigContent = `AUTOSTART=${autostartEnabled ? "true" : "false"}`;
    fs.writeFileSync(configFilePath, newConfigContent);
  } catch (error) {
    console.error("Error updating AUTOSTART in config.txt:", error);
  }
}

let win, tray;

const createWindow = () => {
  win = new BrowserWindow({
    width: 700,
    height: 500,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
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

  const opacitySubMenu = Array.from({ length: 10 }, (_, index) => {
    const opacityValue = (index + 1) * 10; // Вычисляем значение opacity в процентах (10%, 20%, 30%, ...)
    return {
      label: `${opacityValue}%`, // Опция для указанной opacity в процентах
      type: "radio",
      click: () => {
        setOpacity(opacityValue / 100); // Пересчитываем в десятичное значение (0.1, 0.2, 0.3, ...)
      },
      checked: opacityValue === 50,
    };
  });

  // Создание иконки в системном трее
  tray = new Tray(`${__dirname}/icon.ico`);

  // Создание контекстного меню для трея
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Opacity",
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
      label: "Autostart",
      submenu: [
        {
          label: "Enable",
          type: "radio",
          click: () => {
            autostartEnabled = true;
            updateAutostart();
          },
          checked: autostartEnabled,
        },
        {
          label: "Disable",
          type: "radio",
          click: () => {
            autostartEnabled = false;
            updateAutostart();
          },
          checked: !autostartEnabled,
        },
      ],
    },
    {
      label: "Exit",
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

function setOpacity(opacity) {
  win.webContents.insertCSS(`
        h1, h2, h3, h4, h5, h6 {
          opacity: ${opacity} !important;
        }
      `);
}
