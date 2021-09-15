import React from 'react';

import { Autocomplete } from './Autocomplete';

import './App.css';

export const App = () => {
  return (
    <div className="container">
      <Autocomplete
        placeholder="What's up?"
        defaultActiveItemId={0}
        debug={true}
      />
    </div>
  );
};
