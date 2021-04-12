import Layout from '@theme/Layout';
import React from 'react';

import { sandboxes } from '../../data/sandboxes';

import styles from './styles.module.css';

const TITLE = 'Sandboxes';
const DESCRIPTION = 'Check out sandboxes using Autocomplete';

function Showcase() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="container margin-vert--lg">
        <div className="text--center margin-bottom--xl">
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
        </div>
        <div className="row">
          {sandboxes.map((sandbox) => (
            <div key={sandbox.name} className="col col--4 margin-bottom--lg">
              <div className="card">
                {sandbox.preview && (
                  <div className="card__image">
                    <a
                      href={sandbox.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <img src={sandbox.preview} alt={sandbox.name} />
                    </a>
                  </div>
                )}

                <div className="card__body">
                  <div className="avatar">
                    <div className="avatar__intro margin-left--none">
                      <h4 className="avatar__name">{sandbox.name}</h4>
                      <ul className={styles.tagList}>
                        {sandbox.tags.map((tag) => (
                          <li key={tag}>
                            <span className={styles.tag}>{tag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card__footer">
                  <div className="button-group button-group--block">
                    {sandbox.url && (
                      <a
                        className="button button--small button--secondary button--block"
                        href={sandbox.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        See
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default Showcase;
