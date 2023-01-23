export interface Redirect {
  url: string;
}

export interface RedirectState {
  sourceId: string;
  data: Array<Redirect>;
}
