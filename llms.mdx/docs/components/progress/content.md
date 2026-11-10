# Progress (/docs/components/progress)

Progress shows a long run three ways at once: a ring for the whole run, a segment per step, and a
bar for how far the step in hand has got. The `state` colours it — grey while indeterminate or
paused, the accent while running, red with a Retry on error, green when complete — and the controls
follow (Pause, Resume, Run again). An optional `meter` underneath warns in words as it fills.

<Preview>
  <ProgressExample />
</Preview>

## Usage [#usage]

<Tabs items={['Vanilla', 'React', 'Angular', 'Flutter']}>

<Tab value="Vanilla">

```html
<!-- include core.css + progress.css -->
<div class="dm-prg dm-panel" data-s="run">
  <div class="dm-prg-h">
    <span class="dm-prg-ring"><span class="dm-prg-pc dm-num">42%</span></span>
    <div class="dm-prg-t">
      <b>Indexing the docs</b>
      <span class="dm-muted dm-prg-vt">Step 2 of 4, embedding</span>
    </div>
    <span class="dm-tag dm-prg-st dm-run">Running</span>
    <button class="dm-ib dm-prg-btn" aria-label="Pause">⏸</button>
  </div>
  <div class="dm-prg-seg"><i><b></b></i><i><b></b></i></div>
  <div class="dm-prg-lin"><i style="width: 42%"></i></div>
</div>
```

</Tab>

<Tab value="React">

```tsx
import { Progress } from './progress/Progress';

const steps = [
  { label: 'Reading files', unit: 'Files', total: 2000 },
  { label: 'Embedding', unit: 'Chunks', total: 5400 },
  { label: 'Writing', unit: 'Shards', total: 16 },
];

<Progress
  title="Indexing the docs"
  state="running"
  steps={steps}
  step={1}
  stepProgress={0.4}
  meter={{ label: 'Credits this month', value: 8558, max: 10000, warnAt: 0.75, note: 'Resets Dec 1' }}
  onPause={pause}
  onResume={resume}
  onRetry={retry}
  onRestart={restart}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ProgressComponent] -->
<dm-progress
  title="Indexing the docs"
  state="running"
  [steps]="steps"
  [step]="1"
  [stepProgress]="0.4"
  [meter]="meter"
  (pause)="onPause()"
  (resume)="onResume()"
  (retry)="onRetry()"
  (restart)="onRestart()"
></dm-progress>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/progress.dart';

Progress(
  title: 'Indexing the docs',
  state: ProgressState.running,
  steps: const [
    ProgressStep(label: 'Reading files', unit: 'Files', total: 2000),
    ProgressStep(label: 'Embedding', unit: 'Chunks', total: 5400),
  ],
  step: 1,
  stepProgress: 0.4,
  meter: const ProgressMeter(
    label: 'Credits this month', value: 8558, max: 10000, warnAt: 0.75, note: 'Resets Dec 1',
  ),
  onPause: pause,
  onResume: resume,
  onRetry: retry,
  onRestart: restart,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | The run's name, like "Indexing the docs". |
| `state` | `indeterminate \| running \| paused \| error \| complete` | Colours the run and picks the control shown. |
| `steps` | `ProgressStep[]` | The steps, each `{ label, unit, total }`. |
| `step` | `number` | The step in hand, from `0`. |
| `stepProgress` | `number` | How far the step in hand has got, `0` to `1`. |
| `valueText` | `string` | The line under the title. Defaults to "Step 3 of 5, …". |
| `error` | `string` | What failed, shown over the bar while `state` is `error`. |
| `onPause` / `onResume` / `onRetry` / `onRestart` | `callback` | The controls, wired to the matching state. |
| `meter` | `ProgressMeter` | A meter under the run, with thresholds that warn in words. |

A `ProgressMeter` is `{ label, value, max, unit?, warnAt?, dangerAt?, dangerLabel?, note? }`: it
reads "On track" until `value / max` crosses `warnAt` ("Running low") and then `dangerAt` (the
`dangerLabel`, or "Almost out").

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the ring, segments and bar are squared off with hairline tracks; in Soft they are rounded
with a softer fill. The state colours and the meter's warn and danger bands come from the theme, so
they read correctly on either background.
