/* eslint-disable import/no-unresolved */

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import {
  DocSearchButton,
  useDocSearchKeyboardEvents,
} from '@francoischalifour/docsearch-react';

let DocSearchModal = null;

function SearchBar() {
  const { siteConfig = {} } = useDocusaurusContext();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const {
    indexName,
    appId = 'BH4D9OD16A',
    apiKey,
    searchParameters,
  } = siteConfig.themeConfig.algolia;

  const load = useCallback(function load() {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([
      import('@francoischalifour/docsearch-react/modal'),
      import('@francoischalifour/docsearch-react/style'),
    ]).then(([{ DocSearchModal: DocSearchModalComponent }]) => {
      DocSearchModal = DocSearchModalComponent;
    });
  }, []);

  const onOpen = useCallback(
    function onOpen() {
      load().then(() => {
        setIsOpen(true);
      });
    },
    [load, setIsOpen]
  );

  const onClose = useCallback(
    function onClose() {
      setIsOpen(false);
    },
    [setIsOpen]
  );

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

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

      {isOpen &&
        createPortal(
          <DocSearchModal
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
            transformItems={(items) => {
              return items.map((item) => {
                const url = new URL(item.url);

                return {
                  ...item,
                  url: item.url
                    .replace(url.origin, '')
                    .replace('#__docusaurus', ''),
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
