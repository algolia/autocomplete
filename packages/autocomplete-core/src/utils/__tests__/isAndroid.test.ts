import { isAndroid } from '../isAndroid';

describe('isAndroid', () => {
  describe('Android', () => {
    describe('Mobile/tablet with Chrome', () => {
      test('returns true with a Samsung S9 (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36';

        expect(isAndroid(ua)).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab S3 (Tablet - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36';

        expect(isAndroid(ua)).toEqual(true);
      });
    });

    describe('Mobile/tablet with Firefox', () => {
      test('returns true with an Android 8 (Mobile - Firefox) user agent', () => {
        const ua =
          'Mozilla/5.0 (Android 8.0.0; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0';

        expect(isAndroid(ua)).toEqual(true);
      });

      test('returns true with a Android 9 (Tablet - Firefox) user agent', () => {
        const ua =
          'Mozilla/5.0 (Android 9; Tablet; rv:97.0) Gecko/97.0 Firefox/97.0';

        expect(isAndroid(ua)).toEqual(true);
      });
    });
  });

  describe('iOS/iPadOS', () => {
    describe('Mobile/tablet with Chrome', () => {
      test('returns false with an iPhone XS (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1';

        expect(isAndroid(ua)).toEqual(false);
      });

      test('returns false with an iPad Air (Tablet - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1';

        expect(isAndroid(ua)).toEqual(false);
      });
    });

    describe('Mobile/tablet with Safari', () => {
      test('returns false with an iPhone (Mobile - Safari) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/605.1.15 i-filter/sbm-safety/2.00.04.0004';

        expect(isAndroid(ua)).toEqual(false);
      });

      test('returns false with an iPad (Tablet - Safari) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPad; CPU OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/98.0.1108.62 Version/15.0 Mobile/15E148 Safari/604.1';

        expect(isAndroid(ua)).toEqual(false);
      });
    });

    describe('Mobile/tablet with Firefox', () => {
      test('returns false with an iPhone (Mobile - Firefox) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15';

        expect(isAndroid(ua)).toEqual(false);
      });

      test('returns false with an iPad (Tablet - Firefox) user agent', () => {
        const ua =
          'Mozilla/5.0 (iPad; CPU OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15';

        expect(isAndroid(ua)).toEqual(false);
      });
    });
  });

  describe('Windows', () => {
    test('returns false with a Windows 10 (Desktop - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4280.88 Safari/537.36';

      expect(isAndroid(ua)).toEqual(false);
    });

    test('returns false with a Windows 10 (Desktop - Firefox) user agent', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0 Config/93.2.6681.82';

      expect(isAndroid(ua)).toEqual(false);
    });
  });

  describe('macOS', () => {
    test('returns false with a macOS (Desktop - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4919.0 Safari/537.36';

      expect(isAndroid(ua)).toEqual(false);
    });

    test('returns false with a macOS (Desktop - Firefox) user agent', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:99.0) Gecko/20100101 Firefox/99.0';

      expect(isAndroid(ua)).toEqual(false);
    });
  });
});
