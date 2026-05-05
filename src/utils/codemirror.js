import {EditorView, basicSetup} from "codemirror"
import {css} from "@codemirror/lang-css"

export const view = new EditorView({
  parent: document.getElementById('code'),
  doc: `/* Insert your CSS rules *\/`,
  extensions: [basicSetup, css()],
})