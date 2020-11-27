type Effect = () => void;
type EffectFn = () => Effect;
type CleanupFn = () => void;
type EffectWrapper = {
  runEffect(fn: EffectFn): void;
  cleanupEffects(): void;
};

export function createEffectWrapper(): EffectWrapper {
  let cleanups: CleanupFn[] = [];

  function runEffect(fn: EffectFn) {
    const effectCleanup = fn();
    cleanups.push(effectCleanup);
  }

  return {
    runEffect,
    cleanupEffects() {
      const currentCleanups = cleanups;
      cleanups = [];
      currentCleanups.forEach((cleanup) => {
        cleanup();
      });
    },
  };
}
