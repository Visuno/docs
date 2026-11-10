# Eval results (/docs/components/eval-results)

An eval suite's latest run: one bar segment per case, the pass count against the run before, and
the cases — all of them, or only the failed ones. The `Run evals` button spins while the suite runs
and the count reads `Running 3 of 8`. A failed case opens to show what was `expected` and what it
`got`, with a `fix` button that reruns just that case.

<Preview>
  <EvalResultsExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { EvalResults, type EvalCase } from './eval-results/EvalResults';

const cases: EvalCase[] = [
  { id: 'seat', name: 'Names the Pro seat limit', status: 'pass', time: '0.6s' },
  {
    id: 'price',
    name: 'Prices match the billing table',
    status: 'fail',
    time: '0.9s',
    expected: '$24 a seat, billed yearly',
    got: '$29 a seat, billed yearly',
    source: 'Billing table, Pro row',
    fix: { label: 'Use $24 and rerun', onClick: rerun },
  },
];

<EvalResults
  title="Pricing copy evals"
  subtitle="Copy agent · 8 cases · run 2h ago"
  cases={cases}
  previousPassed={8}
  onRun={run}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [EvalResultsComponent] -->
cases: EvalCase[] = [
  { id: 'seat', name: 'Names the Pro seat limit', status: 'pass', time: '0.6s' },
  { id: 'price', name: 'Prices match the billing table', status: 'fail', time: '0.9s',
    expected: '$24 a seat, billed yearly', got: '$29 a seat, billed yearly',
    source: 'Billing table, Pro row', fix: { label: 'Use $24 and rerun', onClick: rerun } },
];

<EvalResults
  title="Pricing copy evals"
  subtitle="Copy agent · 8 cases · run 2h ago"
  [cases]="cases"
  [previousPassed]="8"
  (run)="run()"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/eval_results.dart';

final cases = <EvalCase>[
  const EvalCase(id: 'seat', name: 'Names the Pro seat limit', status: EvalStatus.pass, time: '0.6s'),
  EvalCase(
    id: 'price',
    name: 'Prices match the billing table',
    status: EvalStatus.fail,
    time: '0.9s',
    expected: '\$24 a seat, billed yearly',
    got: '\$29 a seat, billed yearly',
    source: 'Billing table, Pro row',
    fix: EvalFix(label: 'Use \$24 and rerun', onClick: rerun),
  ),
];

EvalResults(
  title: 'Pricing copy evals',
  subtitle: 'Copy agent · 8 cases · run 2h ago',
  cases: cases,
  previousPassed: 8,
  onRun: run,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | The suite's name, like "Pricing copy evals". |
| `subtitle` | `string` | The line under the title, like "Copy agent · 8 cases · run 2h ago". Crossfades when it changes. |
| `cases` | `EvalCase[]` | One per case: `id`, `name`, `status`, and (for a failure) `time`, `expected`, `got`, `source`, `fix`. |
| `onRun` | `() => void` | Adds the run button. |
| `running` | `boolean` | Whether the whole suite is running: the button spins and the count reads "Running 3 of 8". |
| `runLabel` | `string` | The run button's label. Defaults to "Run evals". |
| `previousPassed` | `number` | How many passed the run before. Once the run settles, a tag compares with it. |
| `filter` / `defaultFilter` | `all \| fail` | Which cases show: all of them, or only the failed ones. |
| `open` / `defaultOpen` | `string[]` | Ids of the failed cases that are open. Leave it out to let each one open itself. |

| `EvalCase` | Type | Description |
| --- | --- | --- |
| `status` | `queued \| running \| pass \| fail` | How the case did; picks its glyph and bar colour. |
| `time` | `string` | How long it took, like "0.9s", shown once it has a result. |
| `expected` / `got` / `source` | `string` | For a failed case: what should have come back, what did, and where the answer comes from. |
| `fix` | `{ label; onClick }` | A white button under a failed case's details, like "Use $24 and rerun". |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The panel
sits on a surface with the card shadow; pass and fail take the `--vo-ok` and `--vo-bad` tokens for
their glyphs and bar segments, and a failed case tints with `--vo-bad-bg`, so it all reads against
the stage. In Soft the panel, pills and segmented control are rounder.
