import React from 'react';

import { Autocomplete } from './Autocomplete';

import './App.css';

export function App() {
  return (
    <div className="max-w-2xl mx-auto">
      <Autocomplete
        placeholder="Jot something down"
        debug={true}
        autoFocus={true}
      />
    </div>
  );
}
