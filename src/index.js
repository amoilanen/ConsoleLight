import { h, app } from 'hyperapp';
import 'app.css';
import 'foundation-icons/foundation-icons.css';
import CodeEditor from 'editor';
import Evaluator from 'evaluator';
import Button from 'widgets/button';
import { LogLevel, extendBrowserConsole } from 'logger';
import 'utils/array';

const evaluator = new Evaluator();

const isArray = value =>
  Object.prototype.toString.call(value) === '[object Array]';

const isObject = value =>
  typeof value === 'object' && value != null;

const isString = value =>
  typeof value === 'string';

const formatAsShortened = value => {
  if (isArray(value)) {
    return `Array(${value.length})`;
  } else if (isString(value)) {
    return `"${value}"`;
  } else if (isObject(value)) {
    return '{...}';
  } else {
    return value;
  }
};

const ShortDisplayedValue = ( { value, prefix }) => {
  let formattedValue;

  if (isString(value)) {
    formattedValue = formatAsShortened(value);
  } else if (isArray(value)) {
    const displayedElements = value.map(elem => formatAsShortened(elem));

    formattedValue = `(${value.length}) [ ${displayedElements.join(', ')} ]`;
  } else if (value instanceof RegExp) {
    formattedValue = value.toString()
  } else if (isObject(value)) {
    const displayedProps = Object.keys(value).map(propName => {
      const displayedPropValue = formatAsShortened(value[propName]);

      return `${propName}: ${displayedPropValue}`;
    });
    formattedValue = `{${displayedProps.join(', ')}}`
  } else if (value === undefined || value === null) {
    formattedValue = '' + value;
  } else {
    formattedValue = value;
  }

  return (<div class="short-displayed-value">
    <span>{prefix ? `${prefix}: ` : ''}</span>
    <pre>{formattedValue}</pre>
  </div>);
}

const ExpandableDisplayedValue = ({ value, prefix }) => {

  const COLLAPSED_ICON = '\u25B6';
  const EXPANDED_ICON = '\u25BC';

  const state = {
    isExpanded: true
  };

  //TODO: Make interactive, can be collapsed/expanded by clicking the short value or icon
  if (!state.isExpanded) {
    return (<div class="collapsed-value">
      <span class="expandable-value-state-icon">{COLLAPSED_ICON}</span>
      <ShortDisplayedValue value={value} prefix={prefix} />
    </div>);
  } else {
    const displayedProperties = Object.keys(value).map(propertyName => {
      const propertyValue = value[propertyName];

      return <div class="child-displayed-value">
        <DisplayedValue value={propertyValue} prefix={propertyName} />
      </div>;
    });

    return (<div class="expanded-value">
      <span class="collapsed-state-icon">{EXPANDED_ICON}</span>
      <ShortDisplayedValue value={value} prefix={prefix} />
      {displayedProperties}
    </div>);
  }
}

const DisplayedValue = ({ value, prefix }) => {
  if (isArray(value)) {
    return <ExpandableDisplayedValue value={value} prefix={prefix} />;
  } else if (isObject(value)) {
    return <ExpandableDisplayedValue value={value} prefix={prefix} />;
  }

  return <ShortDisplayedValue value={value} prefix={prefix} />;
};

const Output = ({ evaluationResults }) => {

  const scrollToBottom = element => {
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  };

  return (<section
    class="output"
    updateWhenChanges={evaluationResults.length}
    onupdate={scrollToBottom}
    >
    {evaluationResults.flatMap(result =>
      result.data.map(datum => {
        const className = `displayed-value displayed-value-${result.level}`;

        return <p class={className}>
          <DisplayedValue value={datum} />
        </p>;
      })
    )}
  </section>);
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
          <Button iconName="trash" tooltip="Erase context" onclick={actions.eraseContext}></Button>
        </section>
      </section>
      <Output evaluationResults={state.evaluationResults} />
    </section>),
  actions: {
    evaluate: (state, actions) => {
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
    clear: (state, actions) => {
      return {
        evaluationResults: []
      };
    },
    eraseContext: () => {
      evaluator.eraseContext();
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

extendBrowserConsole(emit);