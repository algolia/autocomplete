export function defaultRenderer({ root, sections }) {
  for (const section of sections) {
    root.appendChild(section);
  }
}
