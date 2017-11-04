
const getDefinedVariableNames = () =>
  [].slice.call(Object.keys(window));

export default class Evaluator {

  constructor() {
    this.initiallyDefinedVariableNames = getDefinedVariableNames();
  }

  getNewVariableNames() {
    const definedVariableNames = getDefinedVariableNames();

    return definedVariableNames.filter(variableName =>
      this.initiallyDefinedVariableNames.indexOf(variableName) < 0
    );
  }

  deleteNewVariables() {
    const variableNames = this.getNewVariableNames();

    variableNames.forEach(variableName => {
      delete window[variableName];
    });
  }

  eraseContext() {
    this.deleteNewVariables();
  }

  evaluate(code) {
    try {
      return window.eval(code);
    } catch (error) {
      try {
        return window.eval(`(${code})`);
      } catch (errorAsExpression) {
        throw error;
      }
    }
  }
}