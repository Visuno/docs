# Plan review (/docs/components/plan-review)

The plan an agent posts before it starts work: each step is a line you can rewrite, skip (it stays,
struck through) or add to. The footer's **Approve plan** hands it off; from there the numbers turn
into a spinner, a check, or a retry clock, and a step can open a quiet line under it reporting what it
found or what it waits on. In `review` the steps are editable; in `running` the agent works through
them; in `done` the footer offers **See changes**.

<Preview>
  <PlanReviewExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { PlanReview, type PlanReviewStep } from './plan-review/PlanReview';

const [steps, setSteps] = useState<PlanReviewStep[]>([
  { id: '1', text: 'Read the pricing frames and the brand tokens' },
  { id: '2', text: 'Compare against the three competitor pages' },
  { id: '3', text: 'Simplify the plan cards to one CTA each' },
]);

<PlanReview
  title="Plan: redesign the pricing page"
  steps={steps}
  onStepsChange={setSteps}
  phase="review"
  onApprove={run}
  onRequestChanges={askForChanges}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [PlanReviewComponent] -->
steps: PlanReviewStep[] = [
  { id: '1', text: 'Read the pricing frames and the brand tokens' },
  { id: '2', text: 'Compare against the three competitor pages' },
  { id: '3', text: 'Simplify the plan cards to one CTA each' },
];

<PlanReview
  title="Plan: redesign the pricing page"
  [steps]="steps"
  phase="review"
  (stepsChange)="steps = $event"
  (approve)="run()"
  (requestChanges)="askForChanges()"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/plan_review.dart';

List<PlanReviewStep> steps = const [
  PlanReviewStep(id: '1', text: 'Read the pricing frames and the brand tokens'),
  PlanReviewStep(id: '2', text: 'Compare against the three competitor pages'),
  PlanReviewStep(id: '3', text: 'Simplify the plan cards to one CTA each'),
];

PlanReview(
  title: 'Plan: redesign the pricing page',
  steps: steps,
  phase: PlanPhase.review,
  onStepsChange: (next) => setState(() => steps = next),
  onApprove: run,
  onRequestChanges: askForChanges,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | Like "Plan: redesign the pricing page". |
| `steps` | `PlanReviewStep[]` | The steps. Leave it out (with `defaultSteps`) to let the person edit, skip and add steps on their own. |
| `defaultSteps` | `PlanReviewStep[]` | The initial steps when uncontrolled. |
| `onStepsChange` | `(steps) => void` | Emitted whenever the list changes (edit, skip, add). |
| `phase` | `review \| running \| done` | `review` (steps editable), `running` (agent works through them) or `done`. |
| `status` | `string` | The line under the title. Defaults to how many steps are left in and roughly how long they take. |
| `note` | `string` | The quiet line in the footer. Defaults to a hint for each phase. |
| `meta` | `ReactNode` | Quiet text at the end of the header, like an elapsed time "0:04". |
| `onApprove` | `() => void` | The **Approve plan** button, in `review`. |
| `onRequestChanges` | `() => void` | The **Ask for changes** button, in `review`. |
| `onStop` | `() => void` | The **Stop** button, in `running`. |
| `onSeeChanges` | `() => void` | The **See changes** button, in `done`. |
| `bare` | `boolean` | Sits flat in a chat thread (the default). Set `false` to give it a card of its own. |
| `step.skipped` | `boolean` | Left out of the plan; it stays in the list, struck through. |
| `step.edited` | `boolean` | Marks a step the person rewrote. |
| `step.state` | `run \| retry \| done` | `run` while the agent works on it, `retry` while it waits out a problem, `done` once it has. |
| `step.detail` | `string` | The line the step reports under it. Opens and crossfades when it changes. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). It sits
flat in a chat thread by default; set `bare={false}` for a card of its own. The step numbers, the
running tint, the amber retry and the green done mark all come from the theme tokens, so each state
reads at a glance, and in Soft the rows and buttons are rounder.
