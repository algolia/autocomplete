/** @jsxRuntime classic */
/** @jsx createElement */

export const defaultTemplates = {
  item({ createElement, state }) {
    return (
      <div className="aa-ItemWrapper">
        <div className="aa-ItemContent">
          <div className="aa-ItemContentBody">
            <div className="aa-ItemContentTitle">
              {state.query}
            </div>
          </div>
        </div>
        <div className="aa-ItemActions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    );
  },
};
