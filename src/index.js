import { h, app } from 'hyperapp';
import 'app.css';

const SingleEvaluationResult = ({ value }) =>
  <p class="single-evaluation-result">{"" + value}</p>

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
    (<div>
      <section class="editing-area">
        <textarea onkeyup={actions.updateCode}>{state.codeToEvaluate}</textarea>
      </section>
      <button onclick={actions.evaluate}>Evaluate</button>
      <section class="evaluation-results">
        <EvaluationResults evaluationResults={state.evaluationResults} />
      </section>
    </div>),
  actions: {
    evaluate: state => {
      const { codeToEvaluate, evaluationResults } = state;
      const currentEvaluationResult = eval(codeToEvaluate);

      return {
        codeToEvaluate,
        evaluationResults: evaluationResults.concat(currentEvaluationResult)
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