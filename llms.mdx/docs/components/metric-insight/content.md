# Metric insight (/docs/components/metric-insight)

A metric with its trend line, a one-line read on why it moved, and a breakdown of what moved it.
A range switch (`7d` / `30d` / `90d`) re-rolls the big number and the change tag and redraws the
line in place; the pointer reads off the nearest point; a marker sits where a release happened; and
**Why did it move?** opens a breakdown of the drivers behind the change. Set `explaining` while you
fetch those drivers and the button shows the agent "Looking into it".

<Preview>
  <MetricInsightExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { MetricInsight, type MetricRange } from './metric-insight/MetricInsight';

const ranges: MetricRange[] = [
  { key: '7', label: '7d', points: [22.8, 24.6, 25.9, 26.3], value: 26.3, change: 3.5, insight: 'Up all week.' },
  {
    key: '30', label: '30d', points: [18.2, 19.0, 23.4, 26.3], value: 26.3, change: 8.1,
    insight: 'Jumped after the pricing page update on Sep 18.',
    marker: { at: 0.58, label: 'Sep 18' },
  },
];

<MetricInsight
  label="Trial to paid"
  ranges={ranges}
  defaultRange="30"
  drivers={[{ label: 'Annual plan shown first', percent: 54 }]}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [MetricInsightComponent] -->
ranges: MetricRange[] = [
  { key: '7', label: '7d', points: [22.8, 24.6, 25.9, 26.3], value: 26.3, change: 3.5, insight: 'Up all week.' },
  { key: '30', label: '30d', points: [18.2, 19.0, 23.4, 26.3], value: 26.3, change: 8.1,
    insight: 'Jumped after the pricing page update on Sep 18.', marker: { at: 0.58, label: 'Sep 18' } },
];

<MetricInsight
  label="Trial to paid"
  [ranges]="ranges"
  defaultRange="30"
  [drivers]="[{ label: 'Annual plan shown first', percent: 54 }]"
  (rangeChange)="onRange($event)"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/metric_insight.dart';

MetricInsight(
  label: 'Trial to paid',
  defaultRange: '30',
  ranges: const [
    MetricRange(key: '7', label: '7d', points: [22.8, 24.6, 25.9, 26.3], value: 26.3, change: 3.5, insight: 'Up all week.'),
    MetricRange(
      key: '30', label: '30d', points: [18.2, 19.0, 23.4, 26.3], value: 26.3, change: 8.1,
      insight: 'Jumped after the pricing page update on Sep 18.',
      marker: MetricMarker(at: 0.58, label: 'Sep 18'),
    ),
  ],
  drivers: const [MetricDriver(label: 'Annual plan shown first', percent: 54)],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `label` | `string` | The metric's name, like "Trial to paid". |
| `ranges` | `MetricRange[]` | The ranges to switch between. |
| `range` | `string` | The range on show, by key. Leave it out to let the switch pick it. |
| `defaultRange` | `string` | The range the switch starts on. Defaults to the first. |
| `onRangeChange` | `(key) => void` | Fires when the range changes. |
| `format` | `(value) => string` | Formats the large number and the hovered point. Defaults to one decimal and a `%`. |
| `formatChange` | `(change) => string` | Formats the change. Defaults to `"+8.1 pts"`. |
| `drivers` | `MetricDriver[]` | What moved the number, under "Why did it move?". Leave it out to hide the button. |
| `explaining` | `boolean` | Shows "Looking into it" and keeps the breakdown shut while you fetch the drivers. |
| `open` | `boolean` | Whether the breakdown is open. Leave it out to let the button toggle it. |
| `defaultOpen` | `boolean` | Whether the breakdown starts open. Defaults to `false`. |
| `onOpenChange` | `(open) => void` | Fires when the breakdown is toggled. |
| `MetricRange` | `{ key; label; points: number[]; value; change; insight; marker?: { at; label } }` | One range: its switch label, its values (oldest first), the number and change, the one-line insight, and an optional chart marker (`at` is 0 to 1 across). |
| `MetricDriver` | `{ label; percent; color? }` | One contributor to the change. `percent` is its share, 0 to 100. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The card
sits on a surface with the panel shadow; the line, the area fill and the marker all take the accent
mark, the change tag tints green or red from the theme's `ok`/`bad` tokens, and the driver bars take
their own colours (or the accent), so the whole thing reads against the stage in either mode.
