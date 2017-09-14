import { h, app } from 'hyperapp';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'app.css';
import 'codemirror/lib/codemirror.css';
import 'foundation-icons.css';

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

const Button = ({ iconName, tooltip, onclick }) => {

  const TOOLTIP_DELAY_MS = 500;

  const state = {};

  const onMouseEnterListener = event => {
    const element = event.target;

    state.shouldShowTooltip = true;
    setTimeout(() => {
      if (state.shouldShowTooltip) {
        element.classList.add('button--tooltip-shown');
      }
    }, TOOLTIP_DELAY_MS);
  };

  const onMouseLeaveListener = event => {
    const element = event.target;
    state.shouldShowTooltip = false;
    element.classList.remove('button--tooltip-shown');
  };

  const addTooltipListeners = element => {
    element.addEventListener('mouseenter', onMouseEnterListener);
    element.addEventListener('mouseleave', onMouseLeaveListener);
  };

  const removeTooltipListeners = element => {
    element.removeEventListener('mouseenter', onMouseEnterListener);
    element.removeEventListener('mouseleave', onMouseLeaveListener);
  };

  return (<span class="button" tooltip={tooltip} onclick={onclick} oncreate={addTooltipListeners} onremove={removeTooltipListeners}>
    <span class={`button-icon button-icon-${iconName}`}>
      <i class={`fi-${iconName}`}></i>
    </span>
  </span>);
};

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
        <section class="editing-area-buttons">
          <Button iconName="play" tooltip="Run" onclick={actions.evaluate}></Button>
        </section>
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