import React from 'react';

export const NotFound404 = ({ location }) => (
  <div className="container">
    <div className="mt-5">
      <h1>Whoops, route not found</h1>
    </div>
    <p>Cannot find content for {location.pathname}</p>
  </div>
);
