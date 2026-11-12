export type AutocompleteDom = {
  inputWrapper: HTMLDivElement;
  input: HTMLInputElement;
  root: HTMLDivElement;
  form: HTMLFormElement;
  label: HTMLLabelElement;
  submitButton: HTMLButtonElement;
  clearButton: HTMLButtonElement;
  loadingIndicator: HTMLDivElement;
  panel: HTMLDivElement;
  resultsAnnouncer?: HTMLDivElement;
  detachedContainer: HTMLDivElement;
  detachedOverlay: HTMLDivElement;
  detachedSearchButtonQuery: HTMLDivElement;
  detachedSearchButtonPlaceholder: HTMLDivElement;
};
