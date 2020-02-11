import { storiesOf } from '@storybook/html';

import { withPlayground } from '../.storybook/decorators';
import { render } from '../.storybook/vue-helper';

storiesOf('Vue', module).add(
  'Default',
  withPlayground(({ container }) => {
    render({
      container,
      template: `<p>This is {{name}}.</p>`,
      data() {
        return {
          name: 'Autocomplete-vue',
        };
      },
    });

    return container;
  })
);
