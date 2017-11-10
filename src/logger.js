export const LogLevel = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {

  constructor(windowConsole, emit) {
    this.windowConsole = windowConsole;
    this.emit = emit;
  }

  log(...args) {
    this.emit('log', {
      level: LogLevel.LOG,
      data: args
    });
    this.windowConsole.log.apply(window, args);
  }

  error(...args) {
    this.emit('log', {
      level: LogLevel.ERROR,
      data: args
    });
    this.windowConsole.error.apply(window, args);
  }

  warn(...args) {
    this.emit('log', {
      level: LogLevel.WARN,
      data: args
    });
    this.windowConsole.warn.apply(window, args);
  }

  info(...args) {
    this.emit('log', {
      level: LogLevel.INFO,
      data: args
    });
    this.windowConsole.info.apply(window, args);
  }
}

export const extendBrowserConsole = emit => {
  const windowConsole = window.console;
  window.console = new Logger(windowConsole, emit);
}

export default Logger;