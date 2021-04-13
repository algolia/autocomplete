import Layout from '@theme/Layout';
import React from 'react';

import { showcase } from '../../data/showcase';

const TITLE = 'Showcase';
const DESCRIPTION =
  'See the awesome experiences people built with Autocomplete';

function Showcase() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="container margin-vert--lg">
        <div className="text--center margin-bottom--xl">
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
        </div>
        <div className="row">
          {showcase.map((project) => (
            <div key={project.name} className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__image">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img src={project.preview} alt={project.name} />
                  </a>
                </div>
                <div className="card__body">
                  <div className="avatar">
                    <div className="avatar__intro margin-left--none">
                      <h4 className="avatar__name">{project.name}</h4>
                      <small className="avatar__subtitle">
                        {project.description}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card__footer">
                  <div className="button-group button-group--block">
                    {project.url && (
                      <a
                        className="button button--small button--secondary button--block"
                        href={project.url}
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
