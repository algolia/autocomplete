import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getPanelProps', () => {
  test('forwards the remaining props', () => {
    const { getPanelProps } = createPlayground(createAutocomplete, {});
    const panelProps = getPanelProps({ customProps: {} });

    expect(panelProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('prevents default event behavior when onMouseDown', () => {
    const { getPanelProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const panelProps = getPanelProps({});
    const event = { ...new MouseEvent('mousedown'), preventDefault: jest.fn() };

    panelProps.onMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  test('sets the activeItemId to defaultActiveItemId when onMouseLeave', () => {
    const onStateChange = jest.fn();
    const { getPanelProps } = createPlayground(createAutocomplete, {
      onStateChange,
      id: 'autocomplete',
      defaultActiveItemId: 0,
    });
    const panelProps = getPanelProps({});

    panelProps.onMouseLeave();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });
});
