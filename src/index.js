import { h, app } from 'hyperapp';
import 'app.css';
import 'foundation-icons.css';
import CodeEditor from 'editor';

const LogLevel = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

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
    updateCode: (state, actions, event) => {
      const { codeToEvaluate } = state;
      const editor = event.target.editor;
      const newCodeToEvaluate = editor.getValue();

      return {
        codeToEvaluate: newCodeToEvaluate
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

window.console = {
  log(arg) {
    emit('log', {
      level: LogLevel.LOG,
      data: arg
    });
  },
  error(arg) {
    emit('log', {
      level: LogLevel.ERROR,
      data: arg
    });
  },
  warn(arg) {
    emit('log', {
      level: LogLevel.WARN,
      data: arg
    });
  },
  info(arg) {
    emit('log', {
      level: LogLevel.INFO,
      data: arg
    });
  }
};