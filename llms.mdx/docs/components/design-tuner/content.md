# Design tuner (/docs/components/design-tuner)

A live preview beside a few sliders, with a button that hands the tuning to the agent. Drag a
slider — or arrow-key it — to tweak the sample card by hand, or press **Tune with agent** and it
walks each value to a target, turns the row it is moving accent, and drops a note on what it
changed. Each slider sets a `--vo-<key>` variable on the preview, so the card reshapes live.

<Preview>
  <DesignTunerExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { DesignTuner, type TunerParam } from './design-tuner/DesignTuner';

<DesignTuner
  title="Pricing card"
  status="Edited by you"
  actionLabel="Tune with agent"
  onValuesChange={(values) => console.log(values)}
  onTune={() => startAgentTune()}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [DesignTunerComponent] -->
<DesignTuner
  title="Pricing card"
  actionLabel="Tune with agent"
  (valuesChange)="onValues($event)"
  (tune_)="startAgentTune()"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/design_tuner.dart';

DesignTuner(
  title: 'Pricing card',
  onValuesChange: (values) => debugPrint('$values'),
  onTune: startAgentTune,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `params` | `TunerParam[]` | The sliders. Defaults to radius, padding, spacing and shadow for the sample card. |
| `values` | `Record<string, number>` | The value of each slider by key. Leave it out to let the sliders keep their own. |
| `onValuesChange` | `(values) => void` | Fires with the values by key whenever a slider or the agent moves one. |
| `title` | `string` | What is being tuned, like `"Pricing card"`. |
| `status` | `string` | Quiet line beside the title, like `"Edited by you"` or `"Agent is tuning"`. |
| `active` | `string` | Key of the slider the agent is moving now; its value turns the accent colour. |
| `tuning` | `boolean` | The agent is tuning: the button thinks and stops taking clicks. |
| `note` | `ReactNode` | What the agent changed and why, shown above the button. |
| `actionLabel` | `string` | The button's label, like `"Tune with agent"` or `"Tune again"`. |
| `onTune` | `() => void` | Fires when the agent-tune button is pressed. |

A `TunerParam` is `{ key, label, min, max, value, unit?, decimals? }`: `key` names the `--vo-<key>`
variable the preview reads, `unit` is appended to whole numbers (like `px`), and `decimals` shows
and sets the value with that many decimals instead of rounding.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
preview sits on a chip-tinted stage; the slider fill and knob, the accent CTA and the agent's note
all draw from the theme tokens, and the sample card's own radius, padding, spacing and shadow are
exactly what the sliders drive. The agent respects `prefers-reduced-motion`, snapping to the tuned
values instead of walking them.
