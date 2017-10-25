import { h, app } from 'hyperapp';
import 'app.css';
import 'foundation-icons/foundation-icons.css';
import CodeEditor from 'editor';
import Button from 'widgets/button';
import { LogLevel, default as Logger }from 'logger';

const SingleEvaluationResult = ({ value }) => {
  const { level, data } = value;

  let formattedDataLines;

  if (typeof data === 'string') {
    formattedDataLines = data.split('\n');
  } else if (Object.prototype.toString.call(data) === '[object Array]') {
    formattedDataLines = [`[ ${data.join(', ')} ]`];
  } else {
    formattedDataLines = ['' + JSON.stringify(data, null, 2)];
  }

  const className = `single-evaluation-result single-evaluation-result-${level}`;

  return (<p class={className}>{formattedDataLines.map(formattedDataLine =>
      <pre>{formattedDataLine}</pre>
    )}</p>);
};

const EvaluationResults = ({ evaluationResults }) => {

  const scrollToBottom = element => {
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  };

  return (<section
    class="evaluation-results"
    updateWhenChanges={evaluationResults.length}
    onupdate={scrollToBottom}
    >
    {evaluationResults.map(result => <SingleEvaluationResult value={result} />)}
  </section>);
};

const evaluateJsCode = code => {
  try {
    return eval(code);
  } catch (error) {
    try {
      return eval(`(${code})`);
    } catch (errorAsExpression) {
      throw error;
    }
  }
};

const emit = app({
  state: {
    codeToEvaluate: '',
    evaluationResults: []
  },
  view: (state, actions) => 
    (<section class="app-container">
      <section class="editing-area">
        <CodeEditor code={state.codeToEvaluate} onkeyup={actions.updateCode}></CodeEditor>
        <section class="editing-area-buttons">
          <Button iconName="play" tooltip="Run" onclick={actions.evaluate}></Button>
          <Button iconName="prohibited" tooltip="Clear" onclick={actions.clear}></Button>
        </section>
      </section>
      <EvaluationResults evaluationResults={state.evaluationResults} />
    </section>),
  actions: {
    evaluate: (state, actions) => {
      const { evaluationResults, codeToEvaluate } = state;

      try {
        const currentEvaluationResult = evaluateJsCode(codeToEvaluate);

        actions.log({
          data: currentEvaluationResult
        });
      } catch (evaluationError) {
        actions.log({
          level: LogLevel.ERROR,
          data: evaluationError.stack
        });
      }
    },
    clear: (state, actions) => {
      return {
        evaluationResults: []
      };
    },
    updateCode: (state, actions, event) => {
      const editor = event.target.editor;
      const codeToEvaluate = editor.getValue();

      return {
        codeToEvaluate
      };
    },
    log: (state, actions, {level = LogLevel.LOG, data}) => {
      const { evaluationResults } = state;

      return {
        evaluationResults: evaluationResults.slice().concat([{
          level,
          data
        }])
      };
    }
  },
  events: {
    log: (state, actions, {level, data}) => {
      actions.log({level, data});
    }
  }
});

window.console = new Logger(emit);