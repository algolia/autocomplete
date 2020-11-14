type Effect = () => void;
type EffectWrapper = {
  effects: Effect[];
  triggerEffect(fn: () => Effect): void;
};

export function createEffectWrapper(): EffectWrapper {
  let effects: Effect[] = [];

  const triggerEffect: EffectWrapper['triggerEffect'] = (fn: () => Effect) => {
    const unsubscribe = fn();

    function cleanUp() {
      unsubscribe();
      effects = effects.filter((x) => x !== unsubscribe);
    }

    effects.push(cleanUp);
  };

  return {
    effects,
    triggerEffect,
  };
}
