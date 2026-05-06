import { useState } from "react";
import "./CodeScreen.css";

const DISMISS_KEY = "codescreen-dismissed";

function CodeScreen() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage may be unavailable (private mode, quota); the in-memory
      // state still hides it for this session.
    }
  };

  if (!visible) return null;

  return (
    <div className="codescreen-wrapper">
      <div className="codescreen">
        <div className="codescreen-topbar">
          <div className="codescreen-dots">
            <button
              type="button"
              className="dot dot-red"
              onClick={dismiss}
              aria-label="Close code preview"
            ></button>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="codescreen-filename">alexander.js</span>
          <div className="codescreen-tabs">
            <span className="tab-inactive">index.html</span>
            <span className="tab-active">alexander.js</span>
          </div>
        </div>
        <div className="codescreen-body">
          <div className="codescreen-lines">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
            <span>11</span>
          </div>
          <div className="codescreen-code">
            <div className="code-line line-1">
              <span className="c-keyword">const</span>{" "}
              <span className="c-var">developer</span>{" "}
              <span className="c-op">=</span>{" "}
              <span className="c-bracket">{"{"}</span>
            </div>
            <div className="code-line line-2">
              <span className="c-indent"></span>
              <span className="c-prop">name</span>
              <span className="c-op">:</span>{" "}
              <span className="c-string">"Alexander Dovbush"</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-3">
              <span className="c-indent"></span>
              <span className="c-prop">school</span>
              <span className="c-op">:</span>{" "}
              <span className="c-string">"Technion"</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-4">
              <span className="c-indent"></span>
              <span className="c-prop">skills</span>
              <span className="c-op">:</span>{" "}
              <span className="c-bracket">[</span>
            </div>
            <div className="code-line line-5">
              <span className="c-indent2"></span>
              <span className="c-string">"Java"</span>
              <span className="c-op">,</span>{" "}
              <span className="c-string">"C#"</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-6">
              <span className="c-indent2"></span>
              <span className="c-string">"Python"</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-7">
              <span className="c-indent2"></span>
              <span className="c-string">"JavaScript"</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-8">
              <span className="c-indent2"></span>
              <span className="c-string">"React"</span>
            </div>
            <div className="code-line line-9">
              <span className="c-indent"></span>
              <span className="c-bracket">]</span>
              <span className="c-op">,</span>
            </div>
            <div className="code-line line-10">
              <span className="c-indent"></span>
              <span className="c-prop">coding</span>
              <span className="c-op">:</span>{" "}
              <span className="c-bool">true</span>
            </div>
            <div className="code-line line-11">
              <span className="c-bracket">{"}"}</span>
              <span className="c-op">;</span>
              <span className="cursor">|</span>
            </div>
          </div>
        </div>
        <div className="codescreen-statusbar">
          <span>JavaScript</span>
          <span>UTF-8</span>
          <span>Ln 11, Col 3</span>
        </div>
      </div>
    </div>
  );
}

export default CodeScreen;
