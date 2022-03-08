import { isSamsung } from '../isSamsung';

describe('isSamsung', () => {
  describe('Android', () => {
    describe('Samsung mobile/tablet', () => {
      test('returns true with a Samsung Galaxy S9 (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36';

        expect(isSamsung(ua)).toEqual(true);
      });

      test('returns true with a Samsung Galaxy S10 (Mobile - Samsung Browser) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G977N Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.2 Chrome/67.0.3396.87 Mobile Safari/537.36';

        expect(isSamsung(ua)).toEqual(true);
      });

      test('returns true with a Samsung Galaxy S20 (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36';

        expect(isSamsung(ua)).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab S3 (Tablet - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36';

        expect(isSamsung(ua)).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab A (Tablet - Samsung Browser) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36';

        expect(isSamsung(ua)).toEqual(true);
      });
    });

    describe('Other Android mobile/tablet', () => {
      test('returns false with a Xiaomi Mi A2 (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 10; Mi A2 Lite) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.58 Mobile Safari/537.36';

        expect(isSamsung(ua)).toEqual(false);
      });

      test('returns false with an HTC One X (Mobile - Android Browser) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; U; Android 4.2.2; ru-by; HTC One X Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 YandexSearch/7.16';

        expect(isSamsung(ua)).toEqual(false);
      });

      test('returns false with a Huawei P30 Pro (Mobile - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 9; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.90 Mobile Safari/537.36';

        expect(isSamsung(ua)).toEqual(false);
      });

      test('returns false with a Google Pixel C (Tablet - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36';

        expect(isSamsung(ua)).toEqual(false);
      });

      test('returns false with a Huawei MediaPad 10 Link (Tablet - Chrome) user agent', () => {
        const ua =
          'Mozilla/5.0 (Linux; Android 4.1.2; MediaPad 10 LINK Build/HuaweiMediaPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.122 Safari/537.36';

        expect(isSamsung(ua)).toEqual(false);
      });
    });
  });

  describe('iOS/iPadOS', () => {
    test('returns false with an iPhone XS (Mobile - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1';

      expect(isSamsung(ua)).toEqual(false);
    });

    test('returns false with an iPad Air (Tablet - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1';

      expect(isSamsung(ua)).toEqual(false);
    });
  });

  describe('Windows', () => {
    test('returns false with a Windows 10 (Desktop - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4280.88 Safari/537.36';

      expect(isSamsung(ua)).toEqual(false);
    });

    test('returns false with a Windows 10 (Desktop - Firefox) user agent', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0 Config/93.2.6681.82';

      expect(isSamsung(ua)).toEqual(false);
    });
  });

  describe('macOS', () => {
    test('returns false with a macOS (Desktop - Chrome) user agent', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4919.0 Safari/537.36';

      expect(isSamsung(ua)).toEqual(false);
    });

    test('returns false with a macOS (Desktop - Firefox) user agent', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:99.0) Gecko/20100101 Firefox/99.0';

      expect(isSamsung(ua)).toEqual(false);
    });
  });
});
