# Segmented Control (/docs/components/segmented-control)

A segmented control picks one of a few options. A white knob slides to the picked one. As `tabs`
(the default) it switches a panel; as a `radio` group it sets an option. The arrow keys move along
and pick, and Home and End jump to the ends. The `label` is required and names the group for screen
readers.

<Preview>
  <SegmentedControlExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { SegmentedControl } from './segmented-control/SegmentedControl';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const [range, setRange] = useState('day');

<SegmentedControl label="Range" options={options} value={range} onValueChange={setRange} />
<SegmentedControl label="Density" as="radio" options={options} defaultValue="week" />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [SegmentedControlComponent] -->
<SegmentedControl label="Range" [options]="options"
  [value]="range" (valueChange)="range = $event" />
<SegmentedControl label="Density" as="radio" [options]="options" defaultValue="week" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/segmented_control.dart';

SegmentedControl(
  label: 'Range',
  options: const [
    SegmentOption('day', label: 'Day'),
    SegmentOption('week', label: 'Week'),
    SegmentOption('month', label: 'Month'),
  ],
  value: range,
  onValueChange: (v) => setState(() => range = v),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `options` | `{ value: string; label: ReactNode }[]` | The choices, in order, left to right. |
| `value` / `defaultValue` | `string` | The picked value. Pass `value` with `onValueChange` for a controlled control. |
| `onValueChange` | `(value: string) => void` | Fires with the new value when the pick changes. |
| `label` | `string` | Names the group for screen readers, like `View`. Required. |
| `as` | `tabs \| radio` | `tabs` (the default) when it switches a panel, `radio` when it sets an option. |
| `id` | `string` | Ties the tabs to their panel: give the panel an id of the form "id-panel" and point its aria-labelledby at "id-value". Defaults to a generated id. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
track and sliding knob take the active theme's surface and accent colors; in Blueprint the control
is squared off, in Soft it is a pill with a rounder knob.
