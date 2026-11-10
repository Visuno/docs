# Step Loader (/docs/components/step-loader)

A step loader shows an agent's work as named steps. The step running now sits beside a small
loader; a track below fills as steps finish; and the row expands to the full list, each line
switching to its `done` text once complete. When `current` reaches the number of steps, every step
is done and the row shows the `doneLabel`.

<Preview>
  <StepLoaderExample />
</Preview>

## Usage [#usage]

<Tabs items={['Vanilla', 'React', 'Angular', 'Flutter']}>

<Tab value="Vanilla">

```html
<!-- include core.css + step-loader.css -->
<div class="stl dm">
  <button class="stl-row" aria-expanded="false">
    <span class="stl-g"></span>
    <span class="stl-t"><span class="stl-lab shim">Reading Figma frames</span></span>
    <span class="stl-n num">1/4</span>
    <svg class="i xs stl-chev"><use href="#i-chev-d" /></svg>
  </button>
  <div class="stl-track"><i></i><i></i><i></i><i></i></div>
  <div class="fold shut stl-fold"><div><ol class="stl-list"></ol></div></div>
</div>
```

</Tab>

<Tab value="React">

```tsx
import { StepLoader } from './step-loader/StepLoader';

const steps = [
  { label: 'Reading Figma frames', done: 'Read 4 frames' },
  { label: 'Generating components', done: 'Made 6 components' },
  { label: 'Writing tests' },
];

<StepLoader steps={steps} current={1} loader="radar" />
<StepLoader steps={steps} current={steps.length} doneLabel="Ready for review" />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [StepLoaderComponent] -->
<dm-step-loader [steps]="steps" [current]="1" loader="radar" />
<dm-step-loader [steps]="steps" [current]="steps.length" doneLabel="Ready for review" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/step_loader.dart';

StepLoader(
  steps: const [
    Step('Reading Figma frames', done: 'Read 4 frames'),
    Step('Generating components', done: 'Made 6 components'),
    Step('Writing tests'),
  ],
  current: 1,
  loader: StepLoaderGlyph.radar,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `steps` | `{ label: string; done?: string }[]` | The steps. `label` shows while running, `done` once finished (falls back to `label`). |
| `current` | `number` | Index of the step running now. `steps.length` or more means every step is done. |
| `loader` | `radar \| dots \| ring \| bars` | The loader glyph beside the running step. `radar` by default. |
| `doneLabel` | `string` | Label once every step is done. `Ready for review` by default. |
| `open` / `defaultOpen` | `boolean` | Whether the full list is open. Leave `open` out to let the row toggle it. |
| `onOpenChange` | `callback` | Fires when the row opens or closes the list. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
track and loader take the accent color from the active theme; in Soft the row and track are softer
and more rounded than in Blueprint.
