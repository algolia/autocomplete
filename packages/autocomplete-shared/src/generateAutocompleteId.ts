let autocompleteId = 0;

export function generateAutocompleteId() {
  return `autocomplete-${autocompleteId++}`;
}
