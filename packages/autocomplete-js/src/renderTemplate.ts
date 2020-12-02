type RenderTemplateProps = {
  template: string | void;
  element: HTMLElement;
  parent: HTMLElement | DocumentFragment;
};

/**
 * Renders the template in the element and append the element to its parent.
 *
 * If the template is a string, we update the HTML of the root to this string.
 * If the template is empty, it means that users manipulated the root element
 * DOM programatically (e.g., attached events, used a renderer like Preact), so
 * we only add the element to its parent.
 */
export function renderTemplate({
  template,
  element,
  parent,
}: RenderTemplateProps) {
  if (typeof template === 'string') {
    element.innerHTML = template;
  }

  parent.appendChild(element);
}
