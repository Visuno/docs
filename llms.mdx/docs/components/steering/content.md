# Steering (/docs/components/steering)

Steering shows a run you can nudge while it works: its `steps`, the log of what you told it and
what it said back, and a message box. A message waits for the step in progress, then the agent
takes it up from the next one — so you change its course without starting over. When your steer
touches work already done, the agent raises an amber heads-up with `actions` (like *Leave it* or
*Redo the Pro card*) and settles on an `answer` once you choose.

<Preview>
  <SteeringExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { Steering, type SteerStep, type SteerMessage } from './steering/Steering';

const [steps, setSteps] = useState<SteerStep[]>([
  { id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: 'done' },
  { id: 'pro', title: 'Update the Pro card', detail: 'Setting the accent to violet', status: 'running' },
  { id: 'team', title: 'Update the Team card', status: 'queued' },
]);
const [messages, setMessages] = useState<SteerMessage[]>([]);

<Steering
  title="Redesign the pricing page"
  steps={steps}
  messages={messages}
  onSend={(text) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'you', text, state: 'queued' }])
  }
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [SteeringComponent] -->
steps: SteerStep[] = [
  { id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: 'done' },
  { id: 'pro', title: 'Update the Pro card', detail: 'Setting the accent to violet', status: 'running' },
  { id: 'team', title: 'Update the Team card', status: 'queued' },
];
messages: SteerMessage[] = [];

<Steering
  title="Redesign the pricing page"
  [steps]="steps"
  [messages]="messages"
  (sendMessage)="queue($event)"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/steering.dart';

Steering(
  title: 'Redesign the pricing page',
  steps: const [
    SteerStep(id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: SteerStepStatus.done),
    SteerStep(id: 'pro', title: 'Update the Pro card', detail: 'Setting the accent to violet', status: SteerStepStatus.running),
    SteerStep(id: 'team', title: 'Update the Team card', status: SteerStepStatus.queued),
  ],
  messages: messages,
  onSend: (text) => setState(() => messages = [...messages, SteerMessage(id: text, from: SteerFrom.you, text: text, state: SteerMessageState.queued)]),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | The run's goal, like "Redesign the pricing page". |
| `steps` | `SteerStep[]` | The steps of the run, each `queued`, `running` or `done`. |
| `messages` | `SteerMessage[]` | What you sent and what the agent said back, in order. |
| `onSend` | `(text) => void` | Called with the text when a message is sent. Add it to `messages` as `queued`, then mark it `applied` once taken up. |
| `value` | `string` | The message being written. Leave it out to let the box keep its own draft. |
| `onValueChange` | `(value) => void` | Called as the draft changes. |
| `placeholder` | `string` | Defaults to "Steer the agent while it works", and "The run has finished" once every step is done. |
| `status` | `string` | The line under the title. Defaults to "Step 2 of 4", or "Done". |
| `seconds` | `number` | Seconds to show as `m:ss`. Leave it out to let the clock count until every step is done. |
| `summary` | `string \| false` | Shown once every step is done. Defaults to "Done in 0:14 · 1 change from you"; `false` hides it. |
| `SteerStep` | `{ id; title; detail?; status; fromYou? }` | A step; `fromYou` tags one your steer added. |
| `SteerMessage` | `{ id; from; text; state?; warn?; actions?; answer? }` | A log line; the agent's can carry an amber `warn`, `actions` and an `answer`. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The card
sits on a surface with the panel shadow; the running glyph spins in the accent, a done step turns
the tick green, your messages sit in a chip bubble on the right, and the agent's heads-up tints
amber until you answer it. All colours, radii and spacing come from the theme tokens, so in Soft the
card, pills and message box are rounder.
