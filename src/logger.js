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
    emit('log', {
      level: LogLevel.LOG,
      data: arg
    });
  }

  error(arg) {
    emit('log', {
      level: LogLevel.ERROR,
      data: arg
    });
  }

  warn(arg) {
    emit('log', {
      level: LogLevel.WARN,
      data: arg
    });
  }

  info(arg) {
    emit('log', {
      level: LogLevel.INFO,
      data: arg
    });
  }
}

export default Logger;