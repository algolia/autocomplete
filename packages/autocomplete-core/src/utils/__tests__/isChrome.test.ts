import { isChrome } from '../isChrome';

describe('isChrome', () => {
  describe('Android', () => {
    describe('Chrome', () => {
      test('returns true with a Samsung Galaxy S20 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Samsung Galaxy Tab S3 (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Firefox', () => {
      test('returns false with an Android 8 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Android 8.0.0; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0'
          )
        ).toEqual(false);
      });

      test('returns false with an Android 9 (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Android 9; Tablet; rv:97.0) Gecko/97.0 Firefox/97.0'
          )
        ).toEqual(false);
      });
    });

    describe('Samsung Browser', () => {
      test('returns false with a Samsung Galaxy S10 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G977N Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.2 Chrome/67.0.3396.87 Mobile Safari/537.36'
          )
        ).toEqual(false);
      });

      test('returns false with a Samsung Galaxy Tab A (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Android Browser', () => {
      test('returns false with an HTC One X (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; U; Android 4.2.2; ru-by; HTC One X Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 YandexSearch/7.16'
          )
        ).toEqual(false);
      });

      test('returns false with an Asus TF201 (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Transformer Prime TF201 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
          )
        ).toEqual(false);
      });
    });
  });

  describe('Apple', () => {
    describe('Chrome', () => {
      test('returns true with an iPhone XS (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1'
          )
        ).toEqual(true);
      });

      test('returns true with an iPad Air (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'
          )
        ).toEqual(true);
      });

      test('returns true with a macOS (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4919.0 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Chromium (same as Chrome)', () => {
      test('returns true with a macOS (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4934.0 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Safari', () => {
      test('returns false with an iPhone (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/605.1.15 i-filter/sbm-safety/2.00.04.0004'
          )
        ).toEqual(false);
      });

      test('returns false with an iPad (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPad; CPU OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/98.0.1108.62 Version/15.0 Mobile/15E148 Safari/604.1'
          )
        ).toEqual(false);
      });

      test('returns false with an macOS (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
          )
        ).toEqual(false);
      });
    });

    describe('Firefox', () => {
      test('returns false with an iPhone (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15'
          )
        ).toEqual(false);
      });

      test('returns false with an iPad (tablet) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (iPad; CPU OS 12_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/97.0 Mobile/15E148 Safari/605.1.15'
          )
        ).toEqual(false);
      });

      test('returns false with a macOS (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:99.0) Gecko/20100101 Firefox/99.0'
          )
        ).toEqual(false);
      });
    });
  });

  describe('Windows', () => {
    describe('Chrome', () => {
      test('returns true with a Windows 7 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
          )
        ).toEqual(true);
      });

      test('returns true with a Windows 10 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4280.88 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Chromium', () => {
      test('returns false with a Windows 10 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/60.0.3112.78 Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Firefox', () => {
      test('returns false with a Windows 10 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0 Config/93.2.6681.82'
          )
        ).toEqual(false);
      });

      test('returns false with a Windows Phone 8.1 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Mobile; Windows Phone 8.1; ARM; Touch; NOKIA; Lumia 520) Gecko/20100101 Firefox/47.0.1'
          )
        ).toEqual(false);
      });
    });

    describe('Edge', () => {
      test('returns false with a Windows 10 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.36'
          )
        ).toEqual(false);
      });

      test('returns false with a Windows Phone 10 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950 Dual SIM) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586'
          )
        ).toEqual(false);
      });
    });

    describe('IE11', () => {
      test('returns false with a Windows 10 (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
          )
        ).toEqual(false);
      });

      test('returns false with a Windows Phone 8.1 (mobile) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 925; Orange) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537'
          )
        ).toEqual(false);
      });
    });
  });

  describe('Linux', () => {
    describe('Chrome', () => {
      test('returns true with a Ubuntu (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
          )
        ).toEqual(true);
      });
    });

    describe('Chromium', () => {
      test('returns false with a Ubuntu (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/76.0.3809.100 Chrome/76.0.3809.100 Safari/537.36'
          )
        ).toEqual(false);
      });
    });

    describe('Firefox', () => {
      test('returns false with a Ubuntu (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94'
          )
        ).toEqual(false);
      });
    });

    describe('Edge', () => {
      test('returns false with a Ubuntu (desktop) user agent', () => {
        expect(
          isChrome(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.31 Safari/537.36 Edg/94.0.992.14'
          )
        ).toEqual(false);
      });
    });
  });
});
