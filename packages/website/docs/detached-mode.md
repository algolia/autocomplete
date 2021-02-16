---
id: detached-mode
title: Detached Mode
---

Detached Mode turns the dropdown display into a full screen, modal experience.

import Draft from './partials/draft.md'

<Draft />

<!-- When the [`detachedMediaQuery`](autocomplete-js#detachedMediaQuery) value is met, Autocomplete turns into detached mode. This mode replaces the regular dropdown for a fully immersive experience, as seen on native devices. -->

## What is Detached

Autocomplete Detached aims at reproducing native experiences on the device you're using. It doesn't display a native input with results in a dropdown, but a search button with results in a modal. This allows a more immersive experience where the full viewport is used to display results.

| ![Regular](/img/screenshot.png) | ![Detached](/img/screenshot-detached-full.png) |
| --- | --- |
| <div align="center">Regular</div> | <div align="center">Detached</div> |

You can enable Detached mode on small screens, on touch devices, or always enable it, as seen on [DocSearch 3](https://docsearch.algolia.com) and the [Algolia Documentation Search](https://www.algolia.com/doc).

## Detached full screen design

Autocomplete's default behavior enables Detached mode when the screen is below 500px wide. You can customize this behavior with the [`detachedMediaQuery`](autocomplete-js#detachedMediaQuery) option.

![Detached](/img/screenshot-detached-full.png)

## Detached modal design

Once you're Detached, you can choose to enable the modal design, which shows the website in the background covered by an overlay. You can set when to enable this design with the `--aa-detached-modal-media-query` CSS variable, which defaults to `(min-width: 500px)`.

![Modal](/img/screenshot-detached-modal.png)

## Bailing out of Detached Mode

To disable Detached Mode, you can pass `detachedMediaQuery: ''`.
