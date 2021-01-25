type AutocompleteNavigator = {
  navigate(...args: any[]): void;
  navigateNewTab(...args: any[]): void;
  navigateNewWindow(...args: any[]): void;
};

export function createNavigator(
  navigator?: Partial<AutocompleteNavigator>
): AutocompleteNavigator {
  return {
    navigate: jest.fn(),
    navigateNewTab: jest.fn(),
    navigateNewWindow: jest.fn(),
    ...navigator,
  };
}
