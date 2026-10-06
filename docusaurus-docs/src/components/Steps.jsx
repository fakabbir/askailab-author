import React from "react";

export default function Steps({ children }) {
  return <ol className="carbon-steps">{children}</ol>;
}

export function Step({ title, children }) {
  return (
    <li className="carbon-step">
      <div className="carbon-step__body">
        {title ? <div className="carbon-step__title">{title}</div> : null}
        <div className="carbon-step__content">{children}</div>
      </div>
    </li>
  );
}
