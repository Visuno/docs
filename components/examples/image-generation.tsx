'use client';
import { useCallback, useEffect, useRef } from 'react';
import {
  ImageGeneration,
  type GeneratedImage,
  type GenerateRequest,
  type GenerationUpdate,
  type ImageStylePreset,
} from '@visuno/image-generation/ImageGeneration';

/**
 * Live example for the Image generation docs page, in the shape of the component's
 * own demo on the upstream site. A prompt with style chips, a shape and how many
 * pictures; pressing Generate makes them resolve out of grain — Composing, Adding
 * detail, Upscaling — reporting progress a step at a time through `onGenerate`. The
 * third picture of the first run times out, to show Retry. Beside it, a gallery of
 * earlier pictures (newest first) and a few style presets. Uses the real Visuno
 * component. Honours prefers-reduced-motion by handing each picture its result at
 * once instead of stepping the progress (the component then fades it in).
 */

// a gradient of a picture's colours stands in for the photo a real model would make
const PICS: Record<string, { ratio: number; placeholder: string; alt: string }> = {
  'yellow-wall': { ratio: 3 / 4, placeholder: 'linear-gradient(165deg,#ffec2e 0 55%,#f2c94a 70%,#5b80bd)', alt: 'A laughing woman in a denim jacket and yellow sunglasses against a bright yellow wall' },
  'green-reach': { ratio: 3 / 4, placeholder: 'radial-gradient(circle at 62% 40%,#e2cf3a 0 9%,transparent 17%),linear-gradient(#5aa34c,#3f9b50)', alt: 'A man in a green T-shirt and yellow bucket hat reaching towards the camera' },
  'magenta-pose': { ratio: 3 / 4, placeholder: 'linear-gradient(140deg,#c534a8,#8a2399 50%,#2b102c)', alt: 'A woman in a black dress posing under pink light against a violet backdrop' },
  'white-blazer': { ratio: 3 / 4, placeholder: 'radial-gradient(ellipse at 50% 72%,#f3efe8 0 20%,transparent 38%),linear-gradient(#ea6a38,#c9532f)', alt: 'A man in a white blazer standing against a rust orange wall' },
  'pink-dream': { ratio: 4 / 5, placeholder: 'linear-gradient(#cdbbe8,#e6a9cb 55%,#b981c4)', alt: 'A pink cloud floating over a lavender field beside a still pink lake' },
  'pink-tower': { ratio: 2 / 3, placeholder: 'linear-gradient(90deg,#f6cdb7 0 34%,#3f95c9 34%)', alt: 'The corner of a peach building against a clear blue sky' },
  'clay-loops': { ratio: 4 / 3, placeholder: 'radial-gradient(circle at 52% 50%,#e9bb5e 0 11%,transparent 21%),linear-gradient(135deg,#b56fd8,#e28bd2 50%,#7f93a4)', alt: 'A 3D render of looping pink clay shapes on a violet background' },
  'light-leak': { ratio: 4 / 3, placeholder: 'linear-gradient(120deg,#1f160a,#bd722c 45%,#ecc66b 60%,#3b2b17)', alt: 'A close-up of a face in shadow with a rainbow of light across one eye' },
  'framing-hands': { ratio: 3 / 2, placeholder: 'linear-gradient(90deg,#2152c5,#ff6b4e 50%,#c9a8e8)', alt: 'A woman in a coral suit framing the camera with her fingers' },
  'fruit-bowl': { ratio: 1, placeholder: 'radial-gradient(circle at 50% 74%,#2aa8e2 0 17%,transparent 28%),radial-gradient(circle at 52% 46%,#a02e40 0 21%,transparent 38%),linear-gradient(#0d0d0d,#151515)', alt: 'Red apples and grapes in a bright blue bowl against black' },
};

const img = (key: string, prompt: string, styles: string[]): GeneratedImage => ({
  key,
  alt: PICS[key].alt,
  placeholder: PICS[key].placeholder,
  ratio: PICS[key].ratio,
  prompt,
  styles,
});

// what each style draws from in this demo
const SETS: Record<string, string[]> = {
  Editorial: ['yellow-wall', 'green-reach', 'magenta-pose', 'white-blazer'],
  Poster: ['pink-tower', 'fruit-bowl', 'clay-loops', 'pink-dream'],
  Surreal: ['pink-dream', 'clay-loops', 'light-leak', 'framing-hands'],
  '35mm': ['light-leak', 'framing-hands', 'fruit-bowl', 'yellow-wall'],
};

const GALLERY: GeneratedImage[] = [
  img('pink-dream', 'A pink cloud over a lavender field and a still lake', ['Surreal']),
  img('framing-hands', 'Woman framing the camera with her hands, coral suit', ['Editorial']),
  img('pink-tower', 'Peach building corner against a clear blue sky', ['Poster']),
  img('clay-loops', 'Soft clay loops in pink and lilac, 3D', ['Surreal', 'Poster']),
  img('light-leak', 'Close-up with a rainbow light leak across the eye', ['35mm']),
  img('fruit-bowl', 'Apples and grapes in a blue bowl on black', ['35mm']),
];

const PRESETS: ImageStylePreset[] = [
  { key: 'studio', label: 'Studio editorial', description: 'Bold backdrop, studio light', styles: ['Editorial'], image: img('framing-hands', '', []) },
  { key: 'block', label: 'Colour block', description: 'Flat colour, strong shapes', styles: ['Poster'], image: img('pink-tower', '', []) },
  { key: 'dream', label: 'Dreamscape', description: 'Soft pastel, impossible places', styles: ['Surreal'], image: img('pink-dream', '', []) },
  { key: 'film', label: 'Film portrait', description: 'Grain and light leaks', styles: ['35mm', 'Editorial'], image: img('light-leak', '', []) },
  { key: 'soft3d', label: 'Soft 3D', description: 'Clay forms in pastel light', styles: ['Surreal', 'Poster'], image: img('clay-loops', '', []) },
  { key: 'still', label: 'Still life', description: 'Objects on black, hard light', styles: ['35mm'], image: img('fruit-bowl', '', []) },
];

const PACE = [1, 0.8, 1.12, 0.9];
const STEPS = 30;

export function ImageGenerationExample() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runs = useRef(0);

  const onGenerate = useCallback(
    (request: GenerateRequest, update: (slot: number, u: GenerationUpdate) => void) => {
      const reduce =
        typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      const id = ++runs.current;
      const first = request.styles[0] ?? 'Editorial';
      const set = SETS[first] ?? SETS.Editorial;
      const n = request.retry != null ? 1 : request.count;

      for (let i = 0; i < n; i++) {
        const slot = request.retry ?? i;
        const key = request.variationOf?.key ?? set[slot % set.length];
        const picture = img(`${id}-${slot}-${key}`, request.prompt, request.styles);
        const fails = id === 1 && request.retry == null && i === 2;
        const ms = reduce ? 0 : 200 * PACE[slot % 4];

        if (reduce) {
          const t = setTimeout(() => update(slot, { progress: 1, image: picture }), 30);
          timers.current.push(t);
          continue;
        }
        for (let step = 1; step <= STEPS; step++) {
          if (fails && step === 17) {
            const t = setTimeout(() => update(slot, { error: 'The model timed out' }), ms * step + 260 + i * 180);
            timers.current.push(t);
            break;
          }
          const t = setTimeout(
            () => update(slot, { progress: step / STEPS, image: step > 1 ? picture : undefined }),
            ms * step + 260 + i * 180,
          );
          timers.current.push(t);
        }
      }
    },
    [],
  );

  // stop any pending steps when the example unmounts
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div style={{ width: '100%' }}>
      <ImageGeneration
        title="Spring lookbook"
        defaultPrompt="Editorial portrait on a bold colour backdrop, studio light"
        defaultSelectedStyles={['Editorial']}
        gallery={GALLERY}
        presets={PRESETS}
        onGenerate={onGenerate}
      />
    </div>
  );
}
