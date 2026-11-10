# Thinking (/docs/components/thinking)

A thinking trace is the reasoning log an agent writes as it works. Each step arrives on a line that
spins while it runs and turns into a green check once it finishes, with what it found written under
it and how long it took at its right. The header counts seconds while it runs; once the last step
lands it becomes a summary of the work and the trace folds itself away.

<Preview>
  <ThinkingExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { Thinking } from './thinking/Thinking';

<Thinking
  running={running}
  title="Checking the pricing page"
  summary="3 cards to fix, 2 changes planned"
  steps={[
    { label: 'Measure the plan cards', state: 'done', result: '3 cards are off the 8px grid', time: '1.4s' },
    { label: 'Plan the fix', state: 'running' },
  ]}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ThinkingComponent] -->
<Thinking
  [running]="running"
  title="Checking the pricing page"
  summary="3 cards to fix, 2 changes planned"
  [steps]="steps"
></Thinking>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/thinking.dart';

Thinking(
  running: running,
  title: 'Checking the pricing page',
  summary: '3 cards to fix, 2 changes planned',
  steps: const [
    ThinkingStep(label: 'Measure the plan cards', state: ThinkingStepState.done, result: '3 cards are off the 8px grid', time: '1.4s'),
    ThinkingStep(label: 'Plan the fix', state: ThinkingStepState.running),
  ],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `steps` | `ThinkingStep[]` | The steps the agent has taken so far. Each has a `label`, a `state` of `running`, `retry` or `done`, an optional `result` and `time`. |
| `running` | `boolean` | Spins, counts seconds and keeps the trace open while true. |
| `seconds` | `number` | Seconds to show. Leave it out to let it count while running. |
| `title` | `string` | The header while it runs, like "Checking the pricing page". |
| `summary` | `string` | The header once it is done. Defaults to the number of steps. |
| `collapseWhenDone` | `boolean` | Folds the trace away a moment after it finishes. |
| `open` / `defaultOpen` | `boolean` | Whether the trace is open. Leave `open` out to let the header toggle it. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
running step turns in the accent with a soft halo, finished steps and the rail between them turn
green, and a slow step waits in amber. In Blueprint the marks are squared off and the result writes
in with a plain fade instead of a blur.
