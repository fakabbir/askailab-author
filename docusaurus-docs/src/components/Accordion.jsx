import React, { useState } from "react";

export default function AccordionGroup({ children }) {
  return <div className="carbon-accordion-group">{children}</div>;
}

export function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`carbon-accordion${open ? " carbon-accordion--open" : ""}`}>
      <button
        type="button"
        className="carbon-accordion__button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="carbon-accordion__title">{title}</span>
        <svg className="carbon-accordion__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      {open ? <div className="carbon-accordion__panel">{children}</div> : null}
    </div>
  );
}
