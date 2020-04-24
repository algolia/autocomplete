/* eslint-disable import/no-unresolved */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { DocSearchButton } from '@francoischalifour/docsearch-react/button';

let DocSearch = null;

function SearchBar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const scrollY = useRef(0);
  const { siteConfig = {} } = useDocusaurusContext();
  const history = useHistory();

  const {
    indexName,
    appId = 'BH4D9OD16A',
    apiKey,
    searchParameters,
  } = siteConfig.themeConfig.algolia;

  const load = useCallback(
    function load() {
      if (isLoaded === true) {
        return Promise.resolve();
      }

      return Promise.all([
        import('@francoischalifour/docsearch-react/modal'),
        import('@francoischalifour/docsearch-react/style'),
      ]).then(([{ DocSearchModal }]) => {
        DocSearch = DocSearchModal;
        setIsLoaded(true);
      });
    },
    [isLoaded, setIsLoaded]
  );

  const onOpen = useCallback(
    function onOpen() {
      load().then(() => {
        scrollY.current = window.scrollY;
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
      window.scrollTo(0, scrollY.current);
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
      <Head>
        <link
          rel="preconnect"
          href={`https://${appId}-dsn.algolia.net`}
          crossOrigin
        />
      </Head>

      <DocSearchButton onClick={onOpen} />

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
            transformItems={items => {
              return items.map(item => {
                return {
                  ...item,
                  url: item.url.replace('#__docusaurus', ''),
                };
              });
            }}
            hitComponent={Hit}
          />,
          document.body
        )}
    </>
  );
}

function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>;
}

export default SearchBar;
