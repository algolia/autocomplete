# @docsearch/css

Style package for [DocSearch](http://docsearch.algolia.com/), the best search experience for docs.

## Installation

In a JavaScript environment:

```sh
yarn add @docsearch/css@alpha
# or
npm install @docsearch/css@alpha
```

## Usage

### Import all styles

#### In CSS

```html
<link rel="stylesheet" href="https://unpkg.com/browse/@docsearch/css" />
```

#### In JavaScript

```js
import '@docsearch/css';
```

### Lazy-load styles

```js
import '@docsearch/css/dist/_variables.css';
import '@docsearch/css/dist/button.css';

// When needed
import '@docsearch/css/dist/modal.css';
```
