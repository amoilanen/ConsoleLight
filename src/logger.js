export const LogLevel = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {

  constructor(emit) {
    this.emit = emit;
  }

  log(arg) {
    this.emit('log', {
      level: LogLevel.LOG,
      data: arg
    });
  }

  error(arg) {
    this.emit('log', {
      level: LogLevel.ERROR,
      data: arg
    });
  }

  warn(arg) {
    this.emit('log', {
      level: LogLevel.WARN,
      data: arg
    });
  }

  info(arg) {
    this.emit('log', {
      level: LogLevel.INFO,
      data: arg
    });
  }
}

export default Logger;