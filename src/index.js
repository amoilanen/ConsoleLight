import { h, app } from 'hyperapp';
import 'app.css';

app({
  state: {
    codeToEvaluate: '',
    evaluationResult: null
  },
  view: (state, actions) => 
    (<div>
      <section class="editing-area">
        <textarea onkeyup={actions.updateCode}>{state.codeToEvaluate}</textarea>
      </section>
      <button onclick={actions.evaluate}>Evaluate</button>
      <section class="evaluation-results">
        <span>{state.evaluationResult}</span>
      </section>
    </div>),
  actions: {
    evaluate: state => {
      const { codeToEvaluate, evaluationResult } = state;

      return {
        codeToEvaluate,
        evaluationResult: eval(codeToEvaluate)
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