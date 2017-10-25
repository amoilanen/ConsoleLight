import { h } from 'hyperapp';

import './button.css';

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

export default Button;