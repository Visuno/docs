# Error recovery (/docs/components/error-recovery)

A run that hit an error, with the steps around it and a choice of how the agent should carry on.
Each `step` carries a `state` — `done`, `fail`, `run`, `wait`, `skip` or `hand` — that picks its
glyph, and an optional `note` under it that crossfades when it changes. The `options` are the ways
the agent can continue; pick one and press Continue, and the choices fold away.

<Preview>
  <ErrorRecoveryExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { ErrorRecovery, type RecoveryStep } from './error-recovery/ErrorRecovery';

const steps: RecoveryStep[] = [
  { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
  { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: lost edit access' },
  { label: 'Post the summary in #sales', state: 'wait' },
];

<ErrorRecovery
  title="Sync the pipeline to Sheets"
  status="Stopped at step 2"
  steps={steps}
  options={[
    { value: 'retry', label: 'Ask for edit access, then retry' },
    { value: 'skip', label: 'Skip it and post the summary' },
    { value: 'hand', label: 'Hand it over to Maya' },
  ]}
  onContinue={(value) => carryOn(value)}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ErrorRecoveryComponent] -->
steps: RecoveryStep[] = [
  { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
  { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: lost edit access' },
  { label: 'Post the summary in #sales', state: 'wait' },
];
options = [
  { value: 'retry', label: 'Ask for edit access, then retry' },
  { value: 'skip', label: 'Skip it and post the summary' },
  { value: 'hand', label: 'Hand it over to Maya' },
];

<ErrorRecovery
  title="Sync the pipeline to Sheets"
  status="Stopped at step 2"
  [steps]="steps"
  [options]="options"
  (continue)="carryOn($event)"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/error_recovery.dart';

ErrorRecovery(
  title: 'Sync the pipeline to Sheets',
  status: 'Stopped at step 2',
  steps: const [
    RecoveryStep(label: 'Pull 1,240 deals from the CRM', state: RecoveryStepState.done, note: 'Done in 8s'),
    RecoveryStep(label: 'Write to the Pipeline 2026 sheet', state: RecoveryStepState.fail, note: 'Error 403: lost edit access'),
    RecoveryStep(label: 'Post the summary in #sales', state: RecoveryStepState.wait),
  ],
  options: const [
    RecoveryOption(value: 'retry', label: 'Ask for edit access, then retry'),
    RecoveryOption(value: 'skip', label: 'Skip it and post the summary'),
    RecoveryOption(value: 'hand', label: 'Hand it over to Maya'),
  ],
  onContinue: (value) => carryOn(value),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | What the agent was doing, like "Sync the pipeline to Sheets". |
| `status` | `string` | Where the run stands, like "Stopped at step 2". Crossfades when it changes. |
| `steps` | `RecoveryStep[]` | The steps around the failure. Each has a `label`, a `state` and an optional `note`. |
| `step.state` | `done \| fail \| run \| wait \| skip \| hand` | Picks the glyph: a check, a red alert, a spinner, a quiet dot, a struck-through skip or a hand-off. |
| `step.note` | `string` | The quiet line under the step, like "Done in 8s" or the error. Crossfades when it changes. |
| `question` | `string` | The question above the choices. Defaults to "How should the agent continue?". |
| `options` | `RecoveryOption[]` | The ways the agent can carry on, each a `{ value, label }`. |
| `value` / `defaultValue` | `string` | The chosen option, controlled or uncontrolled. Defaults to the first option. |
| `onValueChange` | `(value) => void` | Called when a different choice is picked. |
| `onContinue` | `(value) => void` | Called with the chosen option when Continue is pressed. |
| `continueLabel` | `string` | The label on the confirm button. Defaults to "Continue". |
| `open` / `defaultOpen` | `boolean` | Whether the choices show. Leave it out and they fold away once Continue is pressed. |
| `onOpenChange` | `(open) => void` | Called when the choices fold open or closed. |
| `bare` | `boolean` | Sits flat in a chat thread (the default). Set `false` to give it a card of its own. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The step
glyphs take their colour from the theme tokens — a green check, a red alert, a plum hand-off — and
the rail between steps, the selected choice and the Continue pill all draw from the same tokens, so
the whole block reads against either background; in Soft the choices and the pill are rounder.
