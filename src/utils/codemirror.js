import { EditorView, basicSetup } from 'codemirror';
import { keymap } from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import { Compartment } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
// import { lightTheme, darkTheme } from "./codemirror-themes.js";

const themeCompartment = new Compartment();

function prefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
}

const doc = `/* Insert your CSS rules */`;

export const view = new EditorView({
  parent: document.getElementById('code'),
  doc,
  extensions: [
    basicSetup,
    keymap.of([indentWithTab]),
    css()
  ],
});
