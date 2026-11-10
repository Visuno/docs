# Date Picker (/docs/components/date-picker)

A date picker is a field that opens a calendar. Quick picks (**Today**, **Tomorrow**, **In a week**)
sit under a box that understands plain English — type "next friday" or "in 2 weeks" and it picks the
day straight away. The arrow keys move the focus a day or a week, across months too.

Pass **`range`** and the same component becomes a range picker: two months side by side with
ready-made ranges (last 7 days, last 30 days, this quarter), a live preview of the span as you hover,
and **Apply**.

<Preview>
  <DatePickerExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { DatePicker } from './date-picker/DatePicker';

const [day, setDay] = useState<Date | null>(null);

// single day
<DatePicker value={day} onValueChange={setDay} />

// range mode: two months, presets, Apply
const [range, setRange] = useState({ start: null, end: null });
<DatePicker range rangeValue={range} onRangeChange={setRange} onApply={r => save(r)} />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [DatePickerComponent] -->
<DatePicker [value]="day" (valueChange)="day = $event" />

<DatePicker range [rangeValue]="range"
  (rangeChange)="range = $event" (apply)="save($event)" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/date_picker.dart';

DatePicker(
  value: day,
  onValueChange: (d) => setState(() => day = d),
),

DatePicker(
  range: true,
  rangeValue: range,
  onRangeChange: (r) => setState(() => range = r),
  onApply: (r) => save(r),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `range` | `boolean` | Pick a start and end across two months instead of a single day. |
| `value` / `defaultValue` | `Date \| null` | The picked day (single mode). Pass `value` with `onValueChange` for a controlled field. |
| `onValueChange` | `(date: Date \| null) => void` | Fires with the picked day (single mode). |
| `rangeValue` / `defaultRangeValue` | `{ start: Date \| null; end: Date \| null }` | The picked range (range mode). |
| `onRangeChange` | `(range) => void` | Fires with the range as it is built (range mode). |
| `onApply` | `(range: { start: Date; end: Date }) => void` | Fires when **Apply** is pressed (range mode). |
| `month` / `defaultMonth` | `Date` | The month on show, as its first day. In range mode this is the left calendar. |
| `presets` | `{ label: string; days: number }[]` | Quick picks under the text box (single mode). |
| `rangePresets` | `{ key, label, range }[]` | The side list of ready-made ranges (range mode). |
| `parse` | `(text, today) => Date \| null` | Turns typed text into a day. Defaults to plain English (single mode). |
| `today` | `Date` | The day marked with a dot. Pass one when rendering on a server. |
| `weekStartsOn` | `0 \| 1` | `1` starts weeks on Monday (the default), `0` on Sunday. |
| `locale` | `string` | Used for the month name, weekday letters and the default format. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The field,
popover and calendar take the active theme's surface and field-line colors; the picked day and the
range span use the accent. Field radius follows `--vo-r-field` (squared off in Blueprint, rounder in
Soft). All driven by the shared `--vo-*` tokens.
