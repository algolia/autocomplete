---
id: getting-started
title: Getting Started
---

:::note Draft

This page needs to cover:

- These docs provide a few ways to learn how to use Autocomplete:
  - Read about **Core Concepts**—here you can learn more about underlying principles, like **Sources** and **State**.
  - Follow our **Guides** to understand how to build common UX patterns.
  - Refer to **API reference**.
  - [Maybe v2] Play in the **Playground** where you can select components of your autocomplete and we provide you with the code.
- Keep reading for a simple sample implementation
- Installation
  - JS
  - Core
- A basic example
  - Commented code snippet on a basic example (only using query-suggestions plug-in) with resulting UI and links to various **Core Concepts.**

:::

This page is an overview of the Autocomplete documentation and related resources.

Autocomplete is a JavaScript library for **building autocomplete search experiences**.

## Features

- Displays suggestions as you type
- Provides autocompletion
- Supports custom templates for UI flexibility
- Works well with RTL languages
- Triggers custom hooks to plug your logic
- Plugs easily to Algolia's realtime search engine

## What is Autocomplete

## Installation

Autocomplete is available on the [npm](https://www.npmjs.com/) registry.

### JavaScript

```bash
yarn add @algolia/autocomplete-js@alpha
# or
npm install @algolia/autocomplete-js@alpha
```

If you do not wish to use a package manager, you can use standalone endpoints:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@algolia/autocomplete-js@alpha"></script>
```

### Headless

```bash
yarn add @algolia/autocomplete-core@alpha
# or
npm install @algolia/autocomplete-core@alpha
```

If you do not wish to use a package manager, you can use standalone endpoints:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-core@alpha"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@algolia/autocomplete-core@alpha"></script>
```
