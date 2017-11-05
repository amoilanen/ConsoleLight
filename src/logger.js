export const LogLevel = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {

  constructor(originalConsole, emit) {
    this.originalConsole = originalConsole;
    this.emit = emit;
  }

  log(...args) {
    this.emit('log', {
      level: LogLevel.LOG,
      severalData: args
    });
    this.originalConsole.log.apply(window, args);
  }

  error(...args) {
    this.emit('log', {
      level: LogLevel.ERROR,
      severalData: args
    });
    this.originalConsole.error.apply(window, args);
  }

  warn(...args) {
    this.emit('log', {
      level: LogLevel.WARN,
      severalData: args
    });
    this.originalConsole.warn.apply(window, args);
  }

  info(...args) {
    this.emit('log', {
      level: LogLevel.INFO,
      severalData: args
    });
    this.originalConsole.info.apply(window, args);
  }
}

export const extendBrowserConsole = emit => {
  const originalConsole = window.console;
  window.console = new Logger(originalConsole, emit);
}

export default Logger;