import { createAutocomplete } from '../../createAutocomplete';

function defer<TValue>(fn: () => TValue, timeout: number) {
  return new Promise<TValue>((resolve) => {
    setTimeout(() => resolve(fn()), timeout);
  });
}

describe('concurrency', () => {
  test('Resolves the responses in order', async () => {
    const deferValue = [
      [{ label: 'Label 1' }],
      [{ label: 'Label 2' }],
      [{ label: 'Label 3' }],
    ];
    const deferTimeouts = [100, 300, 200];
    let deferCount = -1;

    const getSources = jest.fn(() => {
      deferCount++;

      return [
        {
          getItems() {
            // return deferValue[deferCount];
            return defer(
              () => deferValue[deferCount],
              deferTimeouts[deferCount]
            );
          },
        },
      ];
    });
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      getSources,
      onStateChange,
    });

    const { onChange } = autocomplete.getInputProps({ inputElement: null });
    onChange({ currentTarget: { value: 'a' } });
    onChange({ currentTarget: { value: 'ab' } });

    await autocomplete.refresh();
    jest.runAllTimers();

    const { state } = onStateChange.mock.calls[
      onStateChange.mock.calls.length - 1
    ][0];

    expect(state).toMatchInlineSnapshot(`
      Object {
        "collections": Array [
          Object {
            "items": Array [
              Object {
                "__autocomplete_id": 0,
                "label": "Label 3",
              },
            ],
            "source": Object {
              "getItemInputValue": [Function],
              "getItemUrl": [Function],
              "getItems": [Function],
              "onHighlight": [Function],
              "onSelect": [Function],
            },
          },
        ],
        "completion": null,
        "context": Object {},
        "isOpen": false,
        "query": "ab",
        "selectedItemId": null,
        "status": "idle",
      }
    `);

    // expect(state).toEqual(
    //   expect.objectContaining({
    //     collections: [
    //       expect.objectContaining({
    //         items: [{ __autocomplete_id: 0, label: 'Label 3' }],
    //       }),
    //     ],
    //   })
    // );

    // expect(onStateChange).toHaveBeenLastCalledWith(
    //   expect.objectContaining({
    //     state: expect.objectContaining({
    //       collections: [
    //         expect.objectContaining({
    //           items: [{ __autocomplete_id: 0, label: 'Label 3' }],
    //         }),
    //       ],
    //     }),
    //   })
    // );

    // expect(true).toBe(true);
  });
});
