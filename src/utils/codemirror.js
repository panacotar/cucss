import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { css } from "@codemirror/lang-css";

const lightTheme = EditorView.theme({
  "&": {
    color: "var(--text)",
    backgroundColor: "var(--code-bg)",
  },
  ".cm-content": {
    caretColor: "var(--text)",
  },
  ".cm-gutters": {
    backgroundColor: "color-mix(in srgb, var(--code-bg) 75%, var(--panel))",
    color: "var(--muted)",
    border: "none",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
  },
  ".cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "color-mix(in srgb, var(--primary) 25%, transparent)",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--primary) 25%, transparent)",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

const darkTheme = EditorView.theme(
  {
    "&": {
      color: "var(--text)",
      backgroundColor: "var(--code-bg)",
    },
    // ".ͼc": {
    //   color: "#fff",
    // },
    // ".ͼd": {
    //   color: "#a6d6c3"
    // }
  },
  { dark: true },
);

const themeCompartment = new Compartment();

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

export const view = new EditorView({
  parent: document.getElementById("code"),
  doc: `/* Insert your CSS rules *\/`,
  extensions: [basicSetup, css(), themeCompartment.of(prefersDark() ? darkTheme : lightTheme)],
});

const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
function applyThemeFromMql() {
  view.dispatch({
    effects: themeCompartment.reconfigure(mql?.matches ? darkTheme : lightTheme),
  });
}

if (mql?.addEventListener) mql.addEventListener("change", applyThemeFromMql);
else if (mql?.addListener) mql.addListener(applyThemeFromMql);
