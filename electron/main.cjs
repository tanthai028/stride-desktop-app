const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    title: 'PicklePulse',
    icon: path.join(__dirname, 'assets', 'app.ico'),
    backgroundColor: '#fdf2f8',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  Menu.setApplicationMenu(null)
  win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})