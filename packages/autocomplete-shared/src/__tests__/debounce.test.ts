/* eslint-disable jest/no-done-callback */

import { debounce } from '../debounce';

describe('debounce', () => {
  test('calls the function after time', (done) => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 50);

    debouncedFn('hello');
    expect(fn).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(0);
    }, 40);

    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('hello');
      done();
    }, 50);
  });

  test('does not immediately call the function when time is 0', (done) => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 0);

    debouncedFn('hello');
    expect(fn).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('hello');
      done();
    }, 0);
  });

  test('subsequent debounced calls delay the last call', (done) => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 10);

    debouncedFn('hello1');
    expect(fn).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      debouncedFn('hello2');
      expect(fn).toHaveBeenCalledTimes(0);
    }, 8);

    setTimeout(() => {
      debouncedFn('hello3');
      expect(fn).toHaveBeenCalledTimes(0);
    }, 10);

    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('hello3');
      done();
    }, 40);
  });
});
