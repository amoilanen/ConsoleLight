import { h, app } from 'hyperapp';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'app.css';
import 'codemirror/lib/codemirror.css';

const editorDefaultOptions = {
  mode: 'javascript',
  lineNumbers: true,
  matchBrackets: true,
  continueComments: 'Enter',
  extraKeys: {'Ctrl-Q': 'toggleComment'}
};

const setOptions = (editor, options) =>
  Object.keys(options).forEach(optionKey => {
    const optionValue = options[optionKey];

    editor.setOption(optionKey, optionValue);
  });

const CodeEditor = ({code, onkeyup}) =>
  <section class="code-editor">
    <div
      onkeyup={onkeyup}
      oncreate={element => {
        const editor = CodeMirror(node => element.appendChild(node))

        setOptions(editor, Object.assign({}, editorDefaultOptions, {
          'value': code
        }));
        element.editor = editor;
        element.querySelector('textarea').editor = editor;
      }}
      onupdate={element => {
        element.editor.setOption('value', code);
      }}>
    </div>
  </section>;

const SingleEvaluationResult = ({ value }) =>
  <p class="single-evaluation-result">{"" + JSON.stringify(value, null, 2)}</p>

const EvaluationResults = ({ evaluationResults }) =>
  <section class="evaluation-results">
    {evaluationResults.map(result => <SingleEvaluationResult value={result} />)}
  </section>

const Button = ({ iconName, tooltip, onclick }) =>
  <span class="button" alt={tooltip} onclick={onclick}>
    <span class={`button-icon button-icon-${iconName}`}></span>
  </span>

const evaluateJsCode = code => {
  try {
    return eval(code);
  } catch (e) {
    try {
      return eval(`(${code})`);
    } catch (e) {
      console.log(e);
    }
  }
};

app({
  state: {
    codeToEvaluate: '',
    evaluationResults: []
  },
  view: (state, actions) => 
    (<section class="app-container">
      <section class="editing-area">
        <CodeEditor code={state.codeToEvaluate} onkeyup={actions.updateCode}></CodeEditor>
        <Button iconName="run" tooltip="Run" onclick={actions.evaluate}></Button>
      </section>
      <EvaluationResults evaluationResults={state.evaluationResults} />
    </section>),
  actions: {
    evaluate: state => {
      const { codeToEvaluate, evaluationResults } = state;
      const currentEvaluationResult = evaluateJsCode(codeToEvaluate);

      return {
        codeToEvaluate,
        evaluationResults: evaluationResults.concat([currentEvaluationResult])
      };
    },
    updateCode: (state, actions, event) => {
      const { codeToEvaluate, evaluationResult } = state;
      const editor = event.target.editor;
      const newCodeToEvaluate = editor.getValue();

      return {
        codeToEvaluate: newCodeToEvaluate,
        evaluationResult
      }
    }
  }
});