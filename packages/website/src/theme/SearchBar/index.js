/* eslint-disable import/no-unresolved */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import { SearchButton } from 'docsearch-react';

let DocSearch = null;

function SearchBar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const { siteConfig = {} } = useDocusaurusContext();
  const history = useHistory();

  const {
    indexName,
    appId,
    apiKey,
    searchParameters,
  } = siteConfig.themeConfig.algolia;

  const load = useCallback(
    function load() {
      if (isLoaded === true) {
        return Promise.resolve();
      }

      return Promise.all([
        import('docsearch-react'),
        import('docsearch-react/dist/esm/style.css'),
      ]).then(([{ DocSearch: DocSearchComp }]) => {
        DocSearch = DocSearchComp;
        setIsLoaded(true);
      });
    },
    [isLoaded, setIsLoaded]
  );

  const onOpen = useCallback(
    function onOpen() {
      load().then(() => {
        setIsShowing(true);
        document.body.classList.add('DocSearch--active');
      });
    },
    [load, setIsShowing]
  );

  const onClose = useCallback(
    function onClose() {
      setIsShowing(false);
      document.body.classList.remove('DocSearch--active');
    },
    [setIsShowing]
  );

  useEffect(() => {
    function onKeyDown(event) {
      if (
        (event.key === 'Escape' && isShowing) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();

        if (isShowing) {
          onClose();
        } else {
          onOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isShowing, onOpen, onClose]);

  return (
    <>
      <SearchButton onClick={onOpen} />

      {isLoaded &&
        isShowing &&
        createPortal(
          <DocSearch
            appId={appId}
            apiKey={apiKey}
            indexName={indexName}
            searchParameters={searchParameters}
            onClose={onClose}
            navigator={{
              navigate({ suggestionUrl }) {
                history.push(suggestionUrl);
              },
            }}
          />,
          document.body
        )}
    </>
  );
}

export default SearchBar;
