type Effect = () => void;
type EffectWrapper = {
  runEffect(fn: () => Effect): void;
  cleanEffects(): void;
};

export function createEffectWrapper(): EffectWrapper {
  let effects: Effect[] = [];

  return {
    runEffect(fn) {
      const cleanupEffect = fn();

      function cleanup() {
        cleanupEffect();
        effects = effects.filter((x) => x !== cleanupEffect);
      }

      effects.push(cleanup);
    },
    cleanEffects() {
      effects.forEach((cleanup) => {
        cleanup();
      });
    },
  };
}
