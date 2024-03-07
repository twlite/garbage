import React from 'react';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <h1>Top level</h1>
      <Component {...pageProps} />
      <h1>Bottom level</h1>
    </div>
  );
}
