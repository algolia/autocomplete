/** @jsx h */
import { AutocompletePlugin } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

type CreateTagPluginProps<TItem> = {
  sourceIds?: string[];
  getTagLabel({ item }: { item: TItem }): any;
  onTag({ item }: { item: TItem }): void;
};

export function createTagPlugin<TItem extends {}>({
  getTagLabel,
  onTag,
  sourceIds,
}: CreateTagPluginProps<TItem>): AutocompletePlugin<TItem> {
  const tagContainer = document.createElement('div');
  const tags = [];

  return {
    subscribe({ onSelect, refresh, setQuery }) {
      window.requestAnimationFrame(() => {
        const inputWrapperPrefix = document.querySelector<HTMLDivElement>(
          '.aa-InputWrapperPrefix'
        );
        inputWrapperPrefix.appendChild(tagContainer);

        const input = document.querySelector<HTMLInputElement>('.aa-Input');

        input?.addEventListener('keydown', (event) => {
          if (
            tags.length > 0 &&
            input.selectionStart === 0 &&
            event.key === 'Backspace'
          ) {
            tags.splice(tags[tags.length - 1], 1);
            refresh();
          }
        });
      });

      onSelect((params) => {
        if (!sourceIds.includes(params.source.sourceId)) {
          return;
        }

        tags.push(getTagLabel(params));
        setQuery('');
        refresh();
        onTag(params);
      });
    },
    onStateChange({ refresh }) {
      render(
        <ul className="aa-InputTagList">
          {tags.map((tag, index) => (
            <li key={index} className="aa-InputTagItem">
              <AutocompleteTag
                label={tag}
                onRemove={() => {
                  tags.splice(tags.indexOf(tag), 1);
                  refresh();
                  document
                    .querySelector<HTMLInputElement>('.aa-Input')
                    ?.focus();
                }}
              />
            </li>
          ))}
        </ul>,
        tagContainer
      );
    },
  };
}

type AutocompleteTagProps = {
  label: any;
  onRemove(): void;
};

function AutocompleteTag({ label, onRemove }: AutocompleteTagProps) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove();
      }}
      className="aa-InputTagButton"
    >
      <span className="aa-InputTagLabel">{label}</span>
      <span className="aa-InputTagRemoveIcon">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
          <path
            clipRule="evenodd"
            d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z"
            fillRule="evenodd"
          />
        </svg>
      </span>
    </button>
  );
}
