import { createReactiveWrapper } from '../createReactiveWrapper';

describe('createReactiveWrapper', () => {
  test('runs the reactive values', () => {
    const { reactive, runReactives } = createReactiveWrapper();
    let lastValue = -1;
    const computeValue = jest.fn(() => {
      lastValue++;
      return lastValue;
    });
    const computeValue2 = jest.fn(() => 0);

    const callResult = reactive(computeValue);
    expect(computeValue).toHaveBeenCalledTimes(1);
    expect(callResult.value).toEqual(0);

    const callResult2 = reactive(computeValue2);
    expect(computeValue2).toHaveBeenCalledTimes(1);
    expect(callResult2.value).toEqual(0);

    runReactives();

    expect(computeValue).toHaveBeenCalledTimes(2);
    expect(callResult.value).toEqual(1);

    expect(computeValue2).toHaveBeenCalledTimes(2);
    expect(callResult2.value).toEqual(0);
  });
});
