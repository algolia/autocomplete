/** @jsxRuntime classic */
/** @jsx h */
import { AutocompletePlugin } from '@algolia/autocomplete-js';
import { h } from 'preact';
import qs from 'qs';

type GitHubRepository = {
  full_name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  owner: {
    avatar_url: string;
  };
};

type CreateGithubReposPluginProps = {
  accept?: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
};

function debouncePromise<TParams extends unknown[], TResponse>(
  fn: (...params: TParams) => Promise<TResponse>,
  time: number
) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function (...args: TParams) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise<TResponse>((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

const debouncedFetch = debouncePromise(fetch, 300);

const baseUrl = `https://api.github.com/search/repositories`;

export function createGitHubReposPlugin(
  options: CreateGithubReposPluginProps = {}
): AutocompletePlugin<GitHubRepository, undefined> {
  return {
    getSources({ query }) {
      const queryParameters = qs.stringify({ ...options, q: query });
      const endpoint = [baseUrl, queryParameters].join('?');

      return debouncedFetch(endpoint)
        .then((response) => response.json())
        .then((repositories) => {
          return [
            {
              sourceId: 'githubPlugin',
              getItems() {
                return repositories.items || [];
              },
              getItemUrl({ item }) {
                return item.html_url;
              },
              templates: {
                item({ item }) {
                  const stars = new Intl.NumberFormat('en-US').format(
                    item.stargazers_count
                  );

                  return (
                    <div className="aa-ItemWrapper">
                      <div className="aa-ItemContent">
                        <div className="aa-ItemIcon aa-ItemIcon--alignTop">
                          <img
                            src={item.owner.avatar_url}
                            alt={item.full_name}
                            width="40"
                            height="40"
                          />
                        </div>
                        <div className="aa-ItemContentBody">
                          <div className="aa-ItemContentTitle">
                            <div style={{ display: 'flex' }}>
                              <div style={{ fontWeight: 700 }}>
                                {item.full_name}
                              </div>
                              <div
                                style={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  marginLeft: 'var(--aa-spacing-half)',
                                  position: 'relative',
                                  top: '1px',
                                }}
                              >
                                <svg
                                  aria-label={`${stars} stars`}
                                  style={{
                                    display: 'block',
                                    width: 'calc(var(--aa-spacing-half) * 2)',
                                    height: 'calc(var(--aa-spacing-half) * 2)',
                                    color: '#ffa724',
                                  }}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>{' '}
                                <span
                                  aria-hidden="true"
                                  style={{
                                    color: 'var(--aa-content-text-color)',
                                    fontSize: '0.8em',
                                    lineHeight: 'normal',
                                  }}
                                >
                                  {stars}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="aa-ItemContentDescription">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <div className="aa-ItemActions">
                        <button
                          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                          type="button"
                          title="Select"
                          style={{ pointerEvents: 'none' }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"
                          >
                            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                },
              },
            },
          ];
        });
    },
  };
}
