# Number field (/docs/components/number-field)

Type a number, or step it with the minus and plus buttons (hold to repeat). Give it a `min`, `max`
and `step`, an optional `unit`, and it clamps an out-of-range value and says so — "Set to 100 (max)".

<Preview>
  <NumberFieldExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { NumberField } from '@visuno/number-field/NumberField';

<NumberField label="Quantity" value={qty} min={1} max={99} onChange={setQty} />
<NumberField label="Opacity" defaultValue={60} min={0} max={100} step={5} unit="%" />
<NumberField label="Seats" defaultValue={10} min={1} max={50} size="sm" />
<NumberField label="Locked" value={8} disabled />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [NumberFieldComponent] -->
<NumberField label="Quantity" [value]="qty" [min]="1" [max]="99"
  (valueChange)="qty = $event"></NumberField>
<NumberField label="Opacity" [defaultValue]="60" [min]="0" [max]="100"
  [step]="5" unit="%"></NumberField>
<NumberField label="Seats" [defaultValue]="10" [min]="1" [max]="50" size="sm"></NumberField>
<NumberField label="Locked" [value]="8" [disabled]="true"></NumberField>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/number_field.dart';

NumberField(label: 'Quantity', value: qty, min: 1, max: 99, onChanged: (v) => setQty(v)),
const NumberField(label: 'Opacity', defaultValue: 60, min: 0, max: 100, step: 5, unit: '%'),
const NumberField(label: 'Seats', defaultValue: 10, min: 1, max: 50, size: NumberFieldSize.sm),
const NumberField(label: 'Locked', value: 8, disabled: true),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `value` | `number` | The current value (controlled). Leave out for an uncontrolled field. |
| `defaultValue` | `number` | The starting value when uncontrolled. Defaults to `min`, else 0. |
| `min` / `max` | `number` | The limits. Out-of-range input is clamped, with a brief note. |
| `step` | `number` | How much the buttons and the arrow keys change the value. 1 by default. |
| `unit` | `string` | A unit shown after the number, like `px`, `%` or `GB`. |
| `label` | `string` | A label above the field. |
| `size` | `sm \| md` | `sm` is compact, `md` (the default) roomier. |
| `disabled` | `boolean` | Greys the field out and blocks input. |
| `onChange` / `valueChange` | `callback` | Called with the clamped value whenever it changes. |

Type freely, then it settles on blur or Enter; the up and down arrow keys step by `step`, and the
minus/plus buttons repeat while held.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The field,
its hairline and the steppers all draw from the shared `--vo-*` tokens; the number is set in the
tabular-numerals face so digits don't jitter as they change.
