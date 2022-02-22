import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const t1: string = 'All files in the folder `./src/apps` and in all files in subfolders of that folder are:';
const l1: string = `Confidential proprietary information of TrueBlocks, LLC
Copyright (c) 2016, 2021 TrueBlocks, LLC (https://trueblocks.io)`;

const t2: string = 'All remaining files other than above (and unless otherwise noted) are GPL3.0 and:';
const l2: string = `TrueBlocks - fully-decentralized data from blockchains
Copyright (c) 2016, 2020 TrueBlocks, LLC (https://trueblocks.io)`;

const t3: string = 'The code in the file: `./src/libs/utillib/biguint.cpp` is:';
const l3: string = `Derived, with heavy modifications, from Big Integer Library
(https://mattmccutchen.net/bigint/index.html), from which we quote,
"I, Matt McCutchen, the sole author of the original Big Integer
Library, waive my copyright to it, placing it in the public domain.
The library comes with absolutely no warranty."`;

const t4: string = 'The code in the file `./src/libs/utillib/memmap.cpp` is';
const l4: string = `Copyright (c) 2013 Stephan Brumme. All rights Reserved.
Author: Stephan Brumme Rudolf-Breitscheid-Str.
226 14482 Potsdam, Germany
http://create.stephan-brumme.com/disclaimer.html
Page accessed: October 21, 2017 - 11:13:20 PM EST

License:
Unless otherwise noted, all source code and its sub-pages
is licensed similar to the zlib license: This software is
provided as-is, without any express or implied warranty.
In no event will the author be held liable for any damages
arising from the use of this software. Permission is granted
to anyone to use this software for any purpose, including
commercial applications, and to alter it and redistribute
it freely, subject to the following restrictions:
o - The origin of this software must not be misrepresented;
      you must not claim that you wrote the original software.
o - If you use this software in a product, an acknowledgment
      in the product documentation would be appreciated but is
      not required.
o - Altered source versions must be plainly marked as such,
      and must not be misrepresented as being the original software.

Notice:
This source code has been modified by TrueBlocks, LLC to
conform to formatting preferences, improve performance,
as well as other minor changes.`;

export const Licensing = () => (
  <>
    <ReactMarkdown>#### Licensing Terms</ReactMarkdown>

    <ReactMarkdown>{t1}</ReactMarkdown>
    <SyntaxHighlighter>{l1}</SyntaxHighlighter>

    <ReactMarkdown>{t2}</ReactMarkdown>
    <SyntaxHighlighter>{l2}</SyntaxHighlighter>

    <ReactMarkdown>#### Otherwise Noted</ReactMarkdown>

    <ReactMarkdown>{t3}</ReactMarkdown>
    <SyntaxHighlighter>{l3}</SyntaxHighlighter>

    <ReactMarkdown>{t4}</ReactMarkdown>
    <SyntaxHighlighter>{l4}</SyntaxHighlighter>
  </>
);
