import React from 'react';
import { ErrorIcon } from './icons';

export function ErrorScreen() {
  return (
    <div className="DocSearch-ErrorScreen">
      <div className="DocSearch-Screen-Icon">
        <ErrorIcon />
      </div>
      <p className="DocSearch-Title">Unable to fetch results</p>
      <p className="DocSearch-Help">
        You might want to check your network connection.
      </p>
    </div>
  );
}
