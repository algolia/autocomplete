/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { createTagsPlugin, Tag } from '@algolia/autocomplete-plugin-tags';
import { h, render } from 'preact';
import qs from 'qs';

import {
  FilterHeader,
  PanelLayout,
  PostfixItem,
  PrefixItem,
  QueryItem,
  TagItem,
} from './components';
import { items } from './items';
import { AutocompleteItem, NotificationFilter } from './types';
import { getAlltags, groupBy, splitQuery } from './utils';

import '@algolia/autocomplete-theme-classic';

const queryParameters = qs.parse(location.search, { ignoreQueryPrefix: true });

const tagsPlugin = createTagsPlugin<AutocompleteItem, NotificationFilter>({
  initialTags: Object.entries(queryParameters).flatMap(([token, values]) =>
    (values as string[]).map((value) => ({
      token,
      value,
      label: `${token}:${value}`,
    }))
  ),
  getTagsSubscribers() {
    return [
      {
        sourceId: 'postfixes',
        getTag({ item }) {
          return {
            label: `${item.token}:${item.label}`,
            token: item.token,
            value: item.label,
          };
        },
      },
    ];
  },
  transformSource() {
    return undefined;
  },
  onChange({ tags }) {
    onTagsChange(tags);
  },
});

autocomplete<AutocompleteItem>({
  container: '#autocomplete',
  placeholder: 'Filter notifications',
  openOnFocus: true,
  defaultActiveItemId: 0,
  plugins: [tagsPlugin],
  detachedMediaQuery: 'none',
  getSources({ query, state }) {
    const [prefix, postfix] = splitQuery(query);
    const prefixes = items.filter(({ token }) => token.startsWith(prefix));

    const allTags = getAlltags(state.context.tagsPlugin?.tags || [], query);
    const showQuerySource = allTags.length > 0 && prefixes.length > 0;
    const showPrefixesSource = typeof postfix !== 'string';
    const showPostfixesSource = typeof postfix === 'string';

    const querySource = {
      sourceId: 'query',
      onSelect() {
        const params = Object.fromEntries(
          Object.entries(
            groupBy(allTags, ({ token }) => token)
          ).map(([key, entries]) => [key, entries.map(({ value }) => value)])
        );

        window.location.assign(
          [window.location.origin, qs.stringify(params)].join('?')
        );
      },
      getItems() {
        return [{}] as Array<Tag<NotificationFilter>>;
      },
      templates: {
        item() {
          return (
            <QueryItem query={allTags.map(({ label }) => label).join(' ')} />
          );
        },
      },
    };
    const prefixesSource = {
      sourceId: 'prefixes',
      onSelect({ item, setQuery, setIsOpen, refresh }) {
        setQuery(`${item.token}:`);
        setIsOpen(true);

        refresh();
      },
      getItems() {
        if (query.length === 0) {
          return items;
        }

        const filtered = items.filter(({ token }) => token.startsWith(prefix));

        return filtered.length > 0 ? filtered : items;
      },
      templates: {
        header() {
          return <FilterHeader />;
        },
        item({ item }) {
          return <PrefixItem item={item} />;
        },
      },
    };
    const postfixesSource = {
      sourceId: 'postfixes',
      onSelect({ setQuery }) {
        setQuery('');
      },
      getItems() {
        const [tag] = items.filter(({ token }) => token.startsWith(prefix));

        if (!tag) {
          return [];
        }

        return tag.postfixes
          .map(({ label }) => ({ token: tag.token, label }))
          .filter(({ label }) => label.startsWith(postfix));
      },
      templates: {
        header() {
          return <FilterHeader />;
        },
        item({ item }) {
          return <PostfixItem item={item} />;
        },
      },
    };

    return [
      showQuerySource && querySource,
      showPrefixesSource && prefixesSource,
      showPostfixesSource && postfixesSource,
    ].filter(Boolean);
  },
  render({ sections, state }, root) {
    const [prefix] = splitQuery(state.query);
    const prefixes = items.filter(({ token }) => token.startsWith(prefix));

    render(
      <PanelLayout state={state}>
        {prefixes.length === 0 && (
          <div className="aa-UnsupportedFilter">
            Sorry, we don't support the <strong>{state.query}</strong> filter
            yet.
          </div>
        )}
        {sections}
      </PanelLayout>,
      root
    );
  },
});

onTagsChange(tagsPlugin.data.tags);

const searchInput: HTMLInputElement = document.querySelector(
  '.aa-Autocomplete .aa-Input'
);

searchInput.addEventListener('keydown', (event) => {
  if (
    event.key === 'Backspace' &&
    searchInput.selectionStart === 0 &&
    searchInput.selectionEnd === 0
  ) {
    const newTags = tagsPlugin.data.tags.slice(0, -1);
    tagsPlugin.data.setTags(newTags);
  }
});

function onTagsChange(tags: Array<Tag<NotificationFilter>>) {
  requestAnimationFrame(() => {
    const container = document.querySelector('.aa-InputWrapperPrefix');
    const oldTagsContainer = document.querySelector('.aa-Tags');

    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('aa-Tags');

    render(
      tags.length > 0 ? (
        <div className="aa-TagsList">
          {tags.map((tag) => (
            <TagItem key={tag.label} {...tag} />
          ))}
        </div>
      ) : null,
      tagsContainer
    );

    if (oldTagsContainer) {
      container.replaceChild(tagsContainer, oldTagsContainer);
    } else {
      container.appendChild(tagsContainer);
    }
  });
}
