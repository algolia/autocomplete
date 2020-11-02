import { recentIcon, resetIcon } from './icons';

export type GetTemplatesParams = {
  onRemove(id: string): void;
};

export function getTemplates({ onRemove }: GetTemplatesParams) {
  return {
    item({ item, root }) {
      const content = document.createElement('div');
      content.className = 'aa-ItemContent';
      const icon = document.createElement('div');
      icon.className = 'aa-ItemSourceIcon';
      icon.innerHTML = recentIcon;
      const title = document.createElement('div');
      title.className = 'aa-ItemTitle';
      title.innerText = item.query;
      content.appendChild(icon);
      content.appendChild(title);

      const removeButton = document.createElement('button');
      removeButton.className = 'aa-ItemActionButton';
      removeButton.type = 'button';
      removeButton.innerHTML = resetIcon;
      removeButton.title = 'Remove';

      root.appendChild(content);
      root.appendChild(removeButton);

      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        onRemove(item.id);
      });
    },
  };
}
