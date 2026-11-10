# Context meter (/docs/components/context-meter)

A context meter is a pill with a ring that shows how full the context window is. It opens a panel
with one bar split by kind, a legend whose rows list what is in each part, and a Compact button
that summarises older turns to free room. The ring turns orange past a warning share, and a message
line fades in with a warning or a result.

<Preview>
  <ContextMeterExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { ContextMeter } from './context-meter/ContextMeter';

<ContextMeter
  limit={200000}
  parts={[
    { key: 'files', label: 'Files', tokens: 56200, items: 'PricingCard.tsx 18.2k, tokens.css 6.1k' },
    { key: 'tools', label: 'Tool output', tokens: 41800 },
    { key: 'chat', label: 'Chat', tokens: 32100 },
  ]}
  onCompact={async () => summarise()}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ContextMeterComponent] -->
<ContextMeter
  [limit]="200000"
  [parts]="parts"
  (compact)="summarise()"
></ContextMeter>

// parts: ContextPart[] = [
//   { key: 'files', label: 'Files', tokens: 56200, items: 'PricingCard.tsx 18.2k, tokens.css 6.1k' },
//   { key: 'tools', label: 'Tool output', tokens: 41800 },
//   { key: 'chat', label: 'Chat', tokens: 32100 },
// ];
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/context_meter.dart';

ContextMeter(
  limit: 200000,
  parts: const [
    ContextPart(key: 'files', label: 'Files', tokens: 56200, items: 'PricingCard.tsx 18.2k, tokens.css 6.1k'),
    ContextPart(key: 'tools', label: 'Tool output', tokens: 41800),
    ContextPart(key: 'chat', label: 'Chat', tokens: 32100),
  ],
  onCompact: () async => summarise(),
)
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `parts` | `ContextPart[]` | What fills the context. Each has a `key`, a `label`, its `tokens`, an optional `color`, and optional `items` shown on hover. |
| `limit` | `number` | The size of the context window, in tokens, like 200000. |
| `warnAt` | `number` | From this share of the limit (0 to 1) the ring turns orange. Defaults to 0.85. |
| `message` | `string` | A line under the legend. Crossfades when it changes. |
| `messageTone` | `warn \| ok` | warn shows it in orange with a warning sign, ok in green with a check. |
| `compacted` | `boolean` | Set once compacted: the button turns into Undo. |
| `hint` | `string` | The quiet line beside the button. Defaults to "Summarises older turns". |
| `open` | `boolean` | Whether the panel is open. Leave it out to let the pill toggle it. |
| `onCompact` / `compact` | `callback` | Called by Compact. Return a promise and the button spins until it settles. |
| `onUndo` / `undo` | `callback` | Called by Undo once compacted. |
| `onOpenChange` / `openChange` | `callback` | Fires when the panel opens or shuts. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the pill, the bar and the panel are squared off; in Soft they are rounded. The ring takes
the accent mark and the warning mark past the warning share, and the bar segments take the part
palette (blue, teal, violet, grey) from the tokens unless a part sets its own color.
