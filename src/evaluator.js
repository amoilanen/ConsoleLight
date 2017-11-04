
const getDefinedVariableNames = () =>
  [].slice.call(Object.keys(window));

export default class Evaluator {

  constructor() {
    this.evaluationScope = {};
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
    this.evaluationScope = {};
    this.deleteNewVariables();
  }

  evaluate(code) {
    try {
      return eval.call(this.evaluationScope, code);
    } catch (error) {
      try {
        return eval.call(this.evaluationScope, `(${code})`);
      } catch (errorAsExpression) {
        throw error;
      }
    }
  }
}