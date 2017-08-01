import { h, app } from 'hyperapp';
import 'app.css';

app({
  state: "Hello.",
  view: state => <h1>{state}</h1>
});