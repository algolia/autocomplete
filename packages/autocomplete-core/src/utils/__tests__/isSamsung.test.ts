import { isSamsung } from '../isSamsung';

describe('isSamsung', () => {
  describe('Samsung', () => {
    describe('Chrome', () => {
      test('returns true with a Samsung Galaxy S20 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Galaxy S4 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 5.0.1; SAMSUNG-SGH-I337 Build/LRX22C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.93 Mobile Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab S3 (tablet) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Chromebook (desktop) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 9; Samsung Chromebook Plus (V2) Build/R94-14150.64.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Firefox', () => {
      test('returns true with a Samsung GT-I9250 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Android 4.0.3; Mobile; Galaxy Nexus; rv:13.0) Gecko/13.0 Firefox/13.0'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung GT-I9000 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Android 2.1.0; Mobile; GT-I9000; rv:95.0) Gecko/95.0 Firefox/95.0'
          )
        ).toEqual(true);
      });
    });

    describe('Samsung Browser', () => {
      test('returns true with a Samsung Galaxy S10 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G977N Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.2 Chrome/67.0.3396.87 Mobile Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab A (tablet) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Galaxy S9 (mobile) with "Desktop mode" enabled user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/21.0 Chrome/110.0.5481.154 Safari/537.36'
          )
        ).toEqual(true);
      });
    });
  });

  describe('HTC', () => {
    describe('Chrome', () => {
      test('returns false with an HTC One X (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 4.0.3; HTC One X Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
          )
        ).toEqual(false);
      });

      test('returns false with an HTC One (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 4.3; HTC One Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.99 Mobile Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Firefox', () => {
      test('returns false with an HTC 0P9C2 (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; Android 6.0; HTC_0P9C2 Build/MRA58K; rv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Rocket/2.5.1(20460) Chrome/57.0.2987.126 Mobile Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Android Browser', () => {
      test('returns false with an HTC Desire (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; U; Android 2.2; en-de; HTC_Desire Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
          )
        ).toEqual(false);
      });

      test('returns false with an HTC One X (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Linux; U; Android 4.2.2; ru-by; HTC One X Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 YandexSearch/7.16'
          )
        ).toEqual(false);
      });
    });
  });

  describe('Apple', () => {
    describe('Chrome', () => {
      test('returns false with an iPhone XS (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1'
          )
        ).toEqual(false);
      });

      test('returns false with an iPad Air (tablet) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'
          )
        ).toEqual(false);
      });

      test('returns false with a macOS (desktop) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4919.0 Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Firefox', () => {
      test('returns false with an iPhone (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15'
          )
        ).toEqual(false);
      });

      test('returns false with an iPad (tablet) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPad; CPU OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15'
          )
        ).toEqual(false);
      });

      test('returns false with a macOS (desktop) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:99.0) Gecko/20100101 Firefox/99.0'
          )
        ).toEqual(false);
      });
    });

    describe('Safari', () => {
      test('returns false with an iPhone (mobile) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/605.1.15 i-filter/sbm-safety/2.00.04.0004'
          )
        ).toEqual(false);
      });

      test('returns false with an iPad (tablet) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (iPad; CPU OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/98.0.1108.62 Version/15.0 Mobile/15E148 Safari/604.1'
          )
        ).toEqual(false);
      });

      test('returns false with an macOS (desktop) user agent', () => {
        expect(
          isSamsung(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
          )
        ).toEqual(false);
      });
    });
  });

  test('returns false with an empty user agent', () => {
    expect(isSamsung('')).toEqual(false);
  });
});
