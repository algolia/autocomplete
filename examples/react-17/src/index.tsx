import React from 'react';
import ReactDOM from 'react-dom';

import '@algolia/autocomplete-theme-classic';

import './index.css';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
