import { h, app } from 'hyperapp';
import 'app.css';

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
        <textarea onkeyup={actions.updateCode}>{state.codeToEvaluate}</textarea>
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