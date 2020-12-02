/* eslint-disable no-console */

describe('toWarnDev', () => {
  describe('usage', () => {
    test('fails with incorrect type of message', () => {
      expect(() => {
        // @ts-ignore:next-line
        expect(() => {}).toWarnDev(false);
      }).toThrowErrorMatchingInlineSnapshot(
        `"toWarnDev() requires a parameter of type string but was given boolean."`
      );
    });
  });

  describe('without message', () => {
    test('does not fail if called', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarnDev();
      }).not.toThrow();
    });

    test('fails if not called', () => {
      expect(() => {
        expect(() => {}).toWarnDev();
      }).toThrowErrorMatchingInlineSnapshot(`"No warning recorded."`);
    });
  });

  describe('with message', () => {
    test('does not fail with correct message', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarnDev('warning');
      }).not.toThrow();
    });

    test('fails if a warning is not correct', () => {
      expect(() => {
        expect(() => {
          console.warn('warning');
        }).toWarnDev('another warning');
      }).toThrow(/Unexpected warning recorded./);
    });
  });
});
