import { h } from 'hyperapp';

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

const OneLineSummaryDisplayedValue = ( { value, prefix }) => {
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

  return (<div class="displayed-value-one-line-summary">
    <span>{prefix ? `${prefix}: ` : ''}</span>
    <pre>{formattedValue}</pre>
  </div>);
}

const DisplayedValue = ({ value, prefix }) => {
  if (!isArray(value) && !isObject(value)) {
    return <OneLineSummaryDisplayedValue value={value} prefix={prefix} />;
  }

  const state = {
    expandedState: 'collapsed'
  };

  const toggle = event => {
    if (state.expandedState === 'expanded') {
      state.expandedState = 'collapsed';
    } else {
      state.expandedState = 'expanded';
    }

    const { expandedState } = state;

    const containerElement = event.currentTarget;
    containerElement.setAttribute('class', `${expandedState}-displayed-value`);

    const iconElement = containerElement.querySelector('.displayed-value-icon');
    iconElement.setAttribute('class', `${expandedState}-displayed-value-icon displayed-value-icon`);
    const expandedStateIcon = expandedState === 'expanded' ? EXPANDED_ICON : COLLAPSED_ICON;
    iconElement.innerHTML = expandedStateIcon;

    const childrenContainer = containerElement.querySelector('.displayed-value-children');
    childrenContainer.setAttribute('class', `${expandedState}-displayed-value-children displayed-value-children`);

    event.stopPropagation();
  };

  const COLLAPSED_ICON = '\u25B6';
  const EXPANDED_ICON = '\u25BC';

  const expandedState = state.expandedState;
  const expandedStateIcon = expandedState === 'expanded' ? EXPANDED_ICON : COLLAPSED_ICON;

  const childrenValues = Object.keys(value).map(propertyName => {
    const propertyValue = value[propertyName];

    return <div class="child-displayed-value">
      <DisplayedValue value={propertyValue} prefix={propertyName} />
    </div>;
  });

  return (<div class={`${expandedState}-displayed-value`} onclick={toggle}>
    <span class={`${expandedState}-displayed-value-icon displayed-value-icon`}>{expandedStateIcon}</span>
    <OneLineSummaryDisplayedValue value={value} prefix={prefix} />
    <div class={`${expandedState}-displayed-value-children displayed-value-children`}>
      {childrenValues}
    </div>
  </div>);
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

export default Output;