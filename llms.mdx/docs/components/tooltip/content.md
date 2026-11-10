# Tooltip (/docs/components/tooltip)

A tooltip is the label that waits a moment under a toolbar button, then follows the pointer
instantly as it moves between them. Buttons come in `groups` with a line between, each with a `tip`
and an optional shortcut (`kbd`). Avatars at the end get a richer card instead — a person's name,
role and what they are doing now, with an agent shown by its thinking dots.

<Preview>
  <TooltipExample />
</Preview>

## Usage [#usage]

<Tabs items={['Vanilla', 'React', 'Angular', 'Flutter']}>

<Tab value="Vanilla">

```html
<!-- include core.css + tooltip.css -->
<div class="dm-ttp">
  <div class="dm-ttp-bar dm-panel">
    <button class="dm-ib" aria-label="Undo" data-tip="Undo" data-kbd="⌘Z">↶</button>
    <button class="dm-ib" aria-label="Redo" data-tip="Redo" data-kbd="⌘⇧Z">↷</button>
    <span class="dm-ttp-sep"></span>
    <button class="dm-ib" aria-label="Ask agent" data-tip="Ask the agent" data-kbd="⌘J">✦</button>
    <span class="dm-ttp-sep"></span>
    <span class="dm-ttp-avs">
      <button class="dm-ttp-av" aria-label="Mira Chen">MC</button>
    </span>
  </div>
</div>
```

</Tab>

<Tab value="React">

```tsx
import { Tooltip } from './tooltip/Tooltip';

const groups = [
  [
    { key: 'undo', icon: 'undo', label: 'Undo', kbd: '⌘Z' },
    { key: 'ask', icon: 'spark', label: 'Ask agent', tip: 'Ask the agent', kbd: '⌘J' },
  ],
  [{ key: 'share', icon: 'users', label: 'Share', tip: 'Share with your team' }],
];

const people = [
  { key: 'mira', initials: 'MC', color: 'var(--dm-av-l)', name: 'Mira Chen', role: 'Design lead', status: 'Editing Pricing, frame 2' },
  { key: 'agent', initials: 'AI', color: 'var(--dm-av-p)', name: 'Visuno agent', role: 'Assistant', status: 'Drafting release notes', working: true },
];

<Tooltip groups={groups} people={people} note="Hover a button for its tip." />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [TooltipComponent] -->
<dm-tooltip
  [groups]="groups"
  [people]="people"
  note="Hover a button for its tip."
></dm-tooltip>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/tooltip.dart';

Tooltip(
  groups: [
    [
      TooltipTool(key: 'undo', icon: IconName.undo, label: 'Undo', kbd: '⌘Z'),
      TooltipTool(key: 'ask', icon: IconName.spark, label: 'Ask agent', tip: 'Ask the agent', kbd: '⌘J'),
    ],
    [TooltipTool(key: 'share', icon: IconName.users, label: 'Share', tip: 'Share with your team')],
  ],
  people: const [
    TooltipPerson(key: 'mira', initials: 'MC', color: 'var(--dm-av-l)', name: 'Mira Chen', role: 'Design lead', status: 'Editing Pricing, frame 2'),
    TooltipPerson(key: 'agent', initials: 'AI', color: 'var(--dm-av-p)', name: 'Visuno agent', role: 'Assistant', status: 'Drafting release notes', working: true),
  ],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `groups` | `TooltipTool[][]` | The toolbar's buttons, in groups with a line between. Each tool is `{ key, icon, label, tip?, kbd?, onClick? }`. |
| `people` | `TooltipPerson[]` | Avatars at the end. Each is `{ key, initials, color, name, role, status, working? }`; hovering one shows a card. |
| `note` | `ReactNode` | A quiet line under the toolbar. |
| `cardDelay` | `number` | How long a person card waits before it shows. Defaults to `300`. |
| `openTip` | `string \| null` | Shows this tool's tip by key, as if hovered. Leave it out to let the pointer decide. |
| `openCard` | `string \| null` | Shows this person's card by key, as if hovered. |

A tool's `tip` overrides its `label` in the tooltip, so set it only when the tip should say more
than the button's name; the `kbd` shortcut is shown after it. A person's `working: true` swaps the
green status dot for the agent's thinking dots.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the bar and card are squared off with hairline borders; in Soft they are rounded panels.
The tooltip itself and the avatar colours (`--dm-av-*`) come from the theme, so they stay legible on
either background.
