type Effect = () => void;
type EffectWrapper = {
  runEffect(fn: () => Effect): void;
  cleanEffects(): void;
};

export function createEffectWrapper(): EffectWrapper {
  let effects: Effect[] = [];

  const runEffect: EffectWrapper['runEffect'] = (fn: () => Effect) => {
    const unsubscribe = fn();

    function cleanUp() {
      unsubscribe();
      effects = effects.filter((x) => x !== unsubscribe);
    }

    effects.push(cleanUp);
  };

  function cleanEffects() {
    effects.forEach((cleanUp) => cleanUp());
  }

  return {
    runEffect,
    cleanEffects,
  };
}
