import React from 'react';

import { Autocomplete } from './Autocomplete';
import './App.css';

export function App() {
  return (
    <div className="container">
      <Autocomplete placeholder="Search" openOnFocus={true} />
    </div>
  );
}
