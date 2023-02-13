# Autocomplete Redirect URL example

This example helps you quickly bootstrap a basic Autocomplete with redirect functionality enabled.

<p align="center"><img src="capture.png?raw=true" alt="A capture of the Autocomplete redirect URL example" /></p>

## Demo

[Access the demo](https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/redirect-url)

## How to run this example locally

### 1. Clone this repository

```sh
git clone git@github.com:algolia/autocomplete.git
```

### 2. Install the dependencies and run the server

```sh
yarn
yarn workspace @algolia/autocomplete-example-redirect-url start
```

Alternatively, you may use npm:

```sh
cd examples/redirect-url
npm install
npm start
```

Open <http://localhost:1234> to see your app.

Typing “algolia” or "Apple - AirPods - White" in the app's input presents a redirect item at the top of the drop-down menu. Either submitting the form or selecting the redirect item will execute the redirect to the corresponding URL that was configured for its rule.

## Additional resources
Learn [how to get started with Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/getting-started/) or [how to configure the Redirect URL plugin](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-redirect-url) in the Algolia documentation.
