---
id: basic-options
title: Basic configuration options
---

:::note Draft

This page needs to cover:

- There are only two required params to create an autocomplete:
  - You need to provide a selector for the **container** you want autocomplete to appear in.
  - You need to define where to get the items to display using **getSources** (or a **plug-in** which provides **getSources**). Check our **Sources** core concept for more information.
- Beyond this, there are many parameters you can use to customize the experience and help you with development. Here are some commonly used ones:
  - Use **placeholder** to define the text that appears in the input when a user hasn’t typed anything.
  - Use **autoFocus** to focus on the search box when the page is loaded and **openOnFocus** to display items as soon as a user selects the autocomplete (without typing anything).
  - Use the **onStateChange** hook to call a function whenever the state changes (see our **State** core concept for more info).
  - Use **`debug: true`** to keep the autocomplete panel with items open, even when the blur event occurs. (This is only meant to be used during development. See our **Debugging guide** for more info.)
- Check out the **API reference** for a full list of params.

:::
