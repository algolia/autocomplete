#!/usr/bin/env node
'use strict';
/* eslint-disable no-console */
const execa = require('execa');
const NetlifyAPI = require('netlify');

const client = new NetlifyAPI(process.env.NETLIFY_API_KEY);

function logStdOut(opts) {
  console.log(opts.stdout);
}

if (!process.env.NETLIFY_API_KEY || !process.env.NETLIFY_SITE_ID) {
  throw new Error(
    'Both NETLIFY_API_KEY and NETLIFY_SITE_ID are required. ' +
      'They can be found on ' +
      'https://app.netlify.com/sites/autocompletejs-playgrounds/settings/general' +
      ' and https://app.netlify.com/account/applications'
  );
}

execa('yarn', ['build'])
  .then(logStdOut)
  .then(() => execa('rm', ['-rf', 'netlify-dist']))
  .then(() => execa('mkdir', ['-p', 'netlify-dist/examples']))
  .then(() => execa('cp', ['-r', 'examples', 'netlify-dist']))
  .then(() => execa('mv', ['netlify-dist/examples/index.html', 'netlify-dist']))
  .then(() => execa('find', ['netlify-dist']))
  .then(logStdOut)
  .then(() =>
    execa('sed', [
      '-i',
      '',
      's|href="../|href="./|g',
      'netlify-dist/index.html'
    ])
  )
  .then(() => execa('mkdir', ['-p', 'netlify-dist/test']))
  .then(() =>
    execa('cp', [
      'test/playground.css',
      'test/playground.html',
      'test/playground_angular.html',
      'test/playground_jquery.html',
      'netlify-dist/test'
    ])
  )
  .then(() => execa('cp', ['-r', 'dist', 'netlify-dist']))
  .then(() =>
    execa('sed', [
      '-i',
      '',
      's|https://cdn.jsdelivr.net/autocomplete.js/0|../dist|g',
      'netlify-dist/examples/basic.html',
      'netlify-dist/examples/basic_angular.html',
      'netlify-dist/examples/basic_jquery.html'
    ])
  )
  .then(() =>
    client.deploy(process.env.NETLIFY_SITE_ID, 'netlify-dist', {
      draft: true,
      message: process.env.TRAVIS_COMMIT_MESSAGE || ''
    })
  )
  .then(({deploy: {id, name, deploy_ssl_url: url}}) =>
    console.log(
      '🕸 site is available at ' +
        url +
        '\n\n' +
        'Deploy details available at https://app.netlify.com/sites/' +
        name +
        '/deploys/' +
        id
    )
  );
