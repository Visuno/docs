# Badge (/docs/components/badge)

A badge is a compact label. Its `tone` picks the color (neutral, the accent tint, the three
states, or one of eight tag colors). Two sizes, an optional dot or icon before the label, and an
optional remove button after it.

<Preview>
  <BadgeExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { Badge } from './badge/Badge';

<Badge tone="success">Live</Badge>
<Badge tone="success" dot>Running</Badge>
<Badge tone="accent" size="sm">Pro</Badge>
<Badge tone="warning" onRemove={() => drop()}>Production</Badge>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [BadgeComponent] -->
<Badge tone="success">Live</Badge>
<Badge tone="success" [dot]="true" [live]="true">Running</Badge>
<Badge tone="accent" size="sm">Pro</Badge>
<Badge tone="warning" [removable]="true" (remove)="drop()">Production</Badge>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/badge.dart';

const Badge('Live', tone: BadgeTone.success),
const Badge('Running', tone: BadgeTone.success, dot: true),
const Badge('Pro', tone: BadgeTone.accent, size: BadgeSize.sm),
Badge('Production', tone: BadgeTone.warning, onRemove: drop),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `tone` | `neutral \| accent \| success \| warning \| danger \| blue \| violet \| green \| orange \| red \| yellow \| pink \| teal` | Color as text on its own tint. Neutral by default. |
| `size` | `sm \| md` | `sm` is 20px tall, `md` is 24px (the default). |
| `dot` | `boolean` | A dot in the badge's color before the label. |
| `icon` | `IconName` | An icon before the label. |
| `onRemove` / `remove` | `callback` | Shows a remove button after the label. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the badge is squared off and set in small caps with a hairline in its own color; in Soft
it is a pill.
