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

  log(...args) {
    this.logAction({
      level: LogLevel.LOG,
      data: args
    });
    this.windowConsole.log.apply(window, args);
  }

  error(...args) {
    this.logAction({
      level: LogLevel.ERROR,
      data: args
    });
    this.windowConsole.error.apply(window, args);
  }

  warn(...args) {
    this.logAction({
      level: LogLevel.WARN,
      data: args
    });
    this.windowConsole.warn.apply(window, args);
  }

  info(...args) {
    this.logAction({
      level: LogLevel.INFO,
      data: args
    });
    this.windowConsole.info.apply(window, args);
  }
}

export const extendBrowserConsole = logAction => {
  const windowConsole = window.console;
  window.console = new Logger(windowConsole, logAction);
}

export default Logger;