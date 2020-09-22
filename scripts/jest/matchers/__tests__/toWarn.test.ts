/* eslint-disable no-console */

describe('toWarn', () => {
  describe('usage', () => {
    test('fails with incorrect type of message', () => {
      expect(() => {
        // @ts-ignore:next-line
        expect(() => {}).toWarn(false);
      }).toThrowErrorMatchingInlineSnapshot(
        `"toWarn() requires a parameter of type string but was given boolean."`
      );
    });
  });

  describe('without message', () => {
    test('does not fail if called', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarn();
      }).not.toThrow();
    });

    test('fails if not called', () => {
      expect(() => {
        expect(() => {}).toWarn();
      }).toThrowErrorMatchingInlineSnapshot(`"No warning recorded."`);
    });
  });

  describe('with message', () => {
    test('does not fail with correct message', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarn('warning');
      }).not.toThrow();
    });

    test('fails if a warning is not correct', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarn('another warning');
      }).toThrow(/Unexpected warning recorded./);
    });
  });
});
