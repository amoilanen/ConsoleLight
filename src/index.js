import { h, app } from 'hyperapp';
import 'app.css';
import 'foundation-icons/foundation-icons.css';
import CodeEditor from 'editor';
import Evaluator from 'evaluator';
import Button from 'widgets/button';
import { LogLevel, extendBrowserConsole } from 'logger';
import 'utils/array';
import Output from 'output';

const evaluator = new Evaluator();

const state = {
  codeToEvaluate: '',
  evaluationResults: []
};

const actions = {
  evaluate: () => (state, actions) => {
    const { evaluationResults, codeToEvaluate } = state;

    try {
      const currentEvaluationResult = evaluator.evaluate(codeToEvaluate);

      actions.log({
        data: [ currentEvaluationResult ]
      });
    } catch (evaluationError) {
      actions.log({
        level: LogLevel.ERROR,
        data: [ evaluationError.stack ]
      });
    }
  },
  clear: () => (state, actions) => {
    return {
      evaluationResults: []
    };
  },
  eraseContext: () => {
    evaluator.eraseContext();
  },
  updateCode: event => (state, actions) => {
    const editor = event.target.editor;
    const codeToEvaluate = editor.getValue();

    return {
      codeToEvaluate
    };
  },
  log: ({level = LogLevel.LOG, data}) => (state, actions) => {
    const { evaluationResults } = state;

    return {
      evaluationResults: evaluationResults.slice().concat([{
        level,
        data
      }])
    };
  }
};

const view = (state, actions) => 
    (<section class="app-container">
      <section class="editing-area">
        <CodeEditor code={state.codeToEvaluate} onkeyup={actions.updateCode}></CodeEditor>
        <section class="editing-area-buttons">
          <Button iconName="play" tooltip="Run" onclick={actions.evaluate}></Button>
          <Button iconName="prohibited" tooltip="Clear" onclick={actions.clear}></Button>
          <Button iconName="trash" tooltip="Erase context" onclick={actions.eraseContext}></Button>
        </section>
      </section>
      <Output evaluationResults={state.evaluationResults} />
    </section>);

const { log } = app(state, actions, view, document.body)

extendBrowserConsole(log);