/** @jsxFactory react */

import fs from 'node:fs';
import { extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';

const Markup = (Component, props, App) => {
  return (
    <html>
      <head>
        <title>My Webpage</title>
      </head>
      <body>
        {App ? (
          <App
            {...{
              Component,
              pageProps: props,
            }}
          />
        ) : (
          <Component {...props} />
        )}
      </body>
    </html>
  );
};

const appRegex = /^_app\.[tj]sx?$/;

async function compile() {
  const files = fs
    .readdirSync(join(process.cwd(), 'pages'), {
      withFileTypes: true,
    })
    .sort((a, b) => {
      if (a.name.startsWith('_')) return -1;
      if (b.name.startsWith('_')) return 1;
      return 0;
    });

  let app;

  for (const file of files) {
    if (file.isDirectory()) continue;

    const { name, path } = file;
    const importPath = pathToFileURL(join(path, name)).toString();
    const { default: Component } = await import(importPath);

    if (appRegex.test(name)) {
      app = Component;
      continue;
    }

    const markup = renderToString(Markup(Component, {}, app));

    const outputName = name.replace(extname(name), '');
    fs.writeFileSync(
      join(process.cwd(), 'output', outputName.concat('.html')),
      markup
    );
  }
}

await compile();
