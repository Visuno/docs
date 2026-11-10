# Thinking States (/docs/components/thinking-states)

A thinking state is a small animated mark beside a status line. Pick one of ten marks with
`variant`; give it `steps` and, with more than one, they take turns every `interval` unless you
drive the index with `current`. An elapsed-seconds counter sits at the end of the line and counts
by itself unless you set `seconds` or hide it with `seconds={false}`.

The marks are `orbit` (a light running round a ring, the line shimmering), `morph` (a rectangle,
circle and triangle in turn), `scan` (a column sweeping rows of dots), `stream` (dots filling in,
the line typed out behind a caret), `matrix` (a dot grid twinkling at random), `stack` (pages
shuffling to the front), `pulse` (a core breathing with sonar rings growing out of it), `wave`
(bars rising and falling in a travelling waveform), `bounce` (three dots hopping in turn) and
`spiral` (dots lighting up along an inward spiral toward the centre).

<Preview>
  <ThinkingStatesExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { ThinkingStates } from './thinking-states/ThinkingStates';

const steps = ['Thinking', 'Reading 3 files', 'Planning the change'];

<ThinkingStates variant="orbit" steps={steps} />
<ThinkingStates variant="stream" steps={steps} interval={2600} />
<ThinkingStates variant="scan" steps={steps} seconds={false} />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ThinkingStatesComponent] -->
<ThinkingStates variant="orbit" [steps]="steps" />
<ThinkingStates variant="stream" [steps]="steps" [interval]="2600" />
<ThinkingStates variant="scan" [steps]="steps" [seconds]="false" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/thinking_states.dart';

const steps = ['Thinking', 'Reading 3 files', 'Planning the change'];

ThinkingStates(variant: ThinkingVariant.orbit, steps: steps),
ThinkingStates(variant: ThinkingVariant.stream, steps: steps, interval: 2600),
ThinkingStates(variant: ThinkingVariant.scan, steps: steps, seconds: false),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `variant` | `orbit \| morph \| scan \| stream \| matrix \| stack \| pulse \| wave \| bounce \| spiral` | Which indicator to draw. `orbit` by default. |
| `steps` | `string[]` | The status lines. With more than one they take turns unless `current` is set. |
| `current` | `number` | Index of the line to show. Leave it out to let the lines take turns by themselves. |
| `interval` | `number` | Milliseconds each line shows for when they take turns. `2600` by default. |
| `seconds` | `number \| false` | Seconds shown at the end of the line. Counts by itself when left out; `false` hides it. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
marks and the typed line use the active theme's accent and text colors; the counter is set in the
numeric style. Motion is paused for readers who prefer reduced motion — the line is shown whole
rather than typed.
