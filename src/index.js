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

app({
  state: {
    codeToEvaluate: '',
    evaluationResults: []
  },
  view: (state, actions) => 
    (<section class="app-container">
      <section class="editing-area">
        <CodeEditor code={state.codeToEvaluate} onkeyup={actions.updateCode}></CodeEditor>
        <button class="editor-button" onclick={actions.evaluate}>Evaluate</button>
      </section>
      <EvaluationResults evaluationResults={state.evaluationResults} />
    </section>),
  actions: {
    evaluate: state => {
      const { codeToEvaluate, evaluationResults } = state;
      const currentEvaluationResult = eval(`(${codeToEvaluate})`);

      return {
        codeToEvaluate,
        evaluationResults: evaluationResults.concat([currentEvaluationResult])
      };
    },
    updateCode: (state, actions, event) => {
      const { codeToEvaluate, evaluationResult } = state;

      return {
        codeToEvaluate: event.target.value,
        evaluationResult
      }
    }
  }
});