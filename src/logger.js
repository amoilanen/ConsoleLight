export const LogLevel = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {

  constructor(windowConsole, logAction) {
    this.windowConsole = windowConsole;
    this.logAction = logAction;
  }

  logAtLevel(level, values) {
    values.forEach(value => {
      this.logAction({
        level,
        value
      })
    });
    this.windowConsole[level].apply(window, values);
  }

  log(...args) {
    this.logAtLevel(LogLevel.LOG, args);
  }

  error(...args) {
    this.logAtLevel(LogLevel.ERROR, args);
  }

  warn(...args) {
    this.logAtLevel(LogLevel.WARN, args);
  }

  info(...args) {
    this.logAtLevel(LogLevel.INFO, args);
  }
}

export const extendBrowserConsole = logAction => {
  const windowConsole = window.console;
  window.console = new Logger(windowConsole, logAction);
}

export default Logger;