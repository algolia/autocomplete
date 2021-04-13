// See https://github.com/facebook/docusaurus/blob/bfea8d632d0f4b858597983ab389d664a728dc93/packages/docusaurus-module-type-aliases/src/index.d.ts

declare module '@theme/*' {
  const component: any;
  export default component;
}

declare module '@docusaurus/*';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
