# Run cost (/docs/components/run-cost)

A run cost shows the credits a run has used against its budget, as a number and a meter. A cap
marks where the agent pauses, drawn as a line across the bar; when the spend reaches it the status
turns amber and the run pauses. The breakdown under the bar shows the tokens and tool calls behind
the number, and the button starts, stops, resumes or raises the cap by status.

<Preview>
  <RunCostExample />
</Preview>

## Usage [#usage]

<Tabs items={['Vanilla', 'React', 'Angular', 'Flutter']}>

<Tab value="Vanilla">

```html
<!-- include core.css + run-cost.css -->
<div class="rc panel">
  <div class="rc-h"><span class="muted">Credits used</span><span class="rc-st tag"><span class="dot"></span><span class="rc-stt">Idle</span></span></div>
  <div class="rc-big"><span class="rc-n num">0</span><span class="muted"> / 2,000</span></div>
  <div class="rc-track"><div class="rc-fill"></div><div class="rc-cap" data-tip="The agent pauses here"></div></div>
  <div class="rc-f">
    <label class="rc-cap-t"><button class="toggle" role="switch" aria-checked="true"></button><span>Pause at 90%</span></label>
    <button class="pill primary sm rc-go">Start run</button>
  </div>
</div>
```

</Tab>

<Tab value="React">

```tsx
import { RunCost } from './run-cost/RunCost';

<RunCost
  used={1620}
  budget={2000}
  capAt={90}
  status="running"
  rows={[
    { label: 'Input tokens', value: 14200 },
    { label: 'Output tokens', value: 3600 },
    { label: 'Tool calls', value: 7 },
  ]}
  onAction={() => stop()}
  onCapChange={(on) => setCap(on)}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [RunCostComponent] -->
<dm-run-cost
  [used]="1620"
  [budget]="2000"
  [capAt]="90"
  status="running"
  [rows]="rows"
  (action)="stop()"
  (capChange)="cap = $event"
></dm-run-cost>

// rows: RunCostRow[] = [
//   { label: 'Input tokens', value: 14200 },
//   { label: 'Output tokens', value: 3600 },
//   { label: 'Tool calls', value: 7 },
// ];
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/run_cost.dart';

RunCost(
  used: 1620,
  budget: 2000,
  capAt: 90,
  status: RunCostStatus.running,
  rows: const [
    RunCostRow('Input tokens', 14200),
    RunCostRow('Output tokens', 3600),
    RunCostRow('Tool calls', 7),
  ],
  onAction: stop,
  onCapChange: (on) => setCap(on),
)
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `used` | `number` | Credits used so far. |
| `budget` | `number` | The whole budget, like 2000. |
| `capAt` | `number` | Where the agent pauses, as a percentage of the budget. Defaults to 90. |
| `capOn` | `boolean` | Whether the cap is on. Leave it out to let the switch change it. |
| `status` | `idle \| running \| stopped \| paused \| spent` | running is blue, paused amber, spent red. |
| `statusLabel` | `string` | Words in the status tag. Defaults by status. |
| `rows` | `RunCostRow[]` | The breakdown under the bar; each row has a `label` and a `value`. |
| `actionLabel` | `string` | Words on the button. Defaults by status. |
| `title` | `string` | Defaults to "Credits used". |
| `bare` | `boolean` | Sits flat in a chat thread (the default). Set false to give it a card of its own. |
| `onAction` / `action` | `callback` | Called by the button. |
| `onCapChange` / `capChange` | `callback` | Fires when the cap switch changes. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the bar, the tag and the toggle are squared off; in Soft they are rounded. The fill takes
the accent mark while running and the warning mark once paused at the cap, and the status tag tints
to match its state, all from the tokens.
