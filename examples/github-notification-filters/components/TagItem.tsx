/** @jsxRuntime classic */
/** @jsx h */
import { Tag } from '@algolia/autocomplete-plugin-tags';
import { h } from 'preact';

export function TagItem({ label, remove }: Tag) {
  return (
    <div className="aa-Tag">
      <span className="aa-TagLabel">{label}</span>
      <button
        className="aa-TagRemoveButton"
        onClick={() => remove()}
        title="Remove this tag"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18"></path>
          <path d="M6 6L18 18"></path>
        </svg>
      </button>
    </div>
  );
}
