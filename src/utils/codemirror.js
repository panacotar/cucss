import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { css } from "@codemirror/lang-css";
// import { lightTheme, darkTheme } from "./codemirror-themes.js";

const themeCompartment = new Compartment();

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

export const view = new EditorView({
  parent: document.getElementById("code"),
  doc: `/* Insert your CSS rules *\/`,
  extensions: [basicSetup, css()],
});
