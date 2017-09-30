import { h } from 'hyperapp';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import 'editor.css';

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

const CodeEditor = ({ code, onkeyup }) =>
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

export default CodeEditor;