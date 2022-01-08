import React from 'react';
import ReactMarkdown from 'react-markdown';

const documentation: string = `
#### Documentation

* All of our documentation is on [this site](https://trueblocks.io).
* Introductory text is [here](https://trueblocks.io/docs/).
* Documentation about our command line tool **chifra** is [here](https://trueblocks.io/docs/using/introducing-chifra/).
* Help for the TrueBlocks Account Explorer (this application) is [here](https://trueblocks.io/docs/explorer/).
* Our blog is [here](https://trueblocks.io/blog/).
`;

export const Documentation = () => (
  <div style={{ width: '50%' }}>
    <ReactMarkdown>{documentation}</ReactMarkdown>
  </div>
);
