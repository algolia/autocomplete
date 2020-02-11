type StoryFn = ({
  container,
  dropdownContainer,
}: {
  container: HTMLElement;
  dropdownContainer: HTMLElement;
}) => void;

export function withPlayground(storyFn: StoryFn) {
  return () => {
    const root = document.createElement('div');
    const container = document.createElement('div');
    const dropdownContainer = document.createElement('div');

    root.appendChild(container);
    root.appendChild(dropdownContainer);

    storyFn({
      container,
      dropdownContainer,
    });

    return root;
  };
}
