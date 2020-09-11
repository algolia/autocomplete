/**
 * Renders the template in the root element.
 *
 * If the template is a string, we update the HTML of the root to this string.
 * If the template is empty, it means that users manipulated the root element
 * DOM programatically (e.g., attached events, used a renderer like Preact), so
 * this needs to be a noop.
 */
export function renderTemplate(template: string | void, root: HTMLElement) {
  if (typeof template === 'string') {
    root.innerHTML = template;
  }
}
