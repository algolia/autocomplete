export type AutocompleteEnvironment =
  | Window
  | {
      [prop: string]: unknown;
      addEventListener: Window['addEventListener'];
      removeEventListener: Window['removeEventListener'];
      setTimeout: Window['setTimeout'];
      clearTimeout: Window['clearTimeout'];
      document: Window['document'];
      location: {
        assign: Location['assign'];
      };
      open: Window['open'];
      // In React Native, `navigator` is polyfilled and doesn't have all
      // properties traditionally exposed in the browser.
      // https://github.com/facebook/react-native/blob/8bd3edec88148d0ab1f225d2119435681fbbba33/Libraries/Core/setUpNavigator.js
      navigator?: Partial<Window['navigator']>;
    };
