# Icon (/docs/components/icon)

Draw an icon by its `name`, or pass your own `path` / SVG for a glyph the set does not have. Icons
use `currentColor`, so they take the colour of the surrounding text; `size` ranges from `xs` to `xl`.

<IconExample />

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { VisunoIcon } from '@visuno/icon/VisunoIcon';

<VisunoIcon name="chevron-right" />
<VisunoIcon name="circle-check" size="l" style={{ color: 'var(--vo-ok)' }} />
<VisunoIcon name="rocket" label="Launch" />        {/* labelled, announced as an image */}

{/* your own glyph — a custom path or children on the 24×24 grid */}
<VisunoIcon path="M5 9h14M5 15h14" />
<VisunoIcon label="Custom"><path d="M4 12h16M12 4v16" /></VisunoIcon>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [VoIconComponent] -->
<Icon name="chevron-right"></Icon>
<Icon name="circle-check" size="l"></Icon>
<Icon name="rocket" label="Launch"></Icon>

<!-- your own glyph -->
<Icon path="M5 9h14M5 15h14"></Icon>
<Icon svg="<path d='M4 12h16M12 4v16' />"></Icon>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/icon.dart';

const VoIcon('chevron-right'),
const VoIcon('circle-check', size: VoIconSize.l, color: Color(0xFF16A34A)),
const VoIcon('rocket', label: 'Launch'),

// your own glyph
const VoIcon.custom(path: 'M5 9h14M5 15h14'),
const VoIcon.custom(svg: "<path d='M4 12h16M12 4v16' />"),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | A canonical icon name (e.g. `chevron-right`, `circle-check`). Any of ~5,200 resolves. Optional when you pass `path` or SVG. |
| `size` | `xs \| s \| m \| l \| xl` | Rendered size: 12 · 14 · 16 (default) · 18 · 24 px. |
| `path` | `string` | A custom SVG path (`d` of one `<path>`) drawn on the 24×24 grid. |
| `svg` / `children` | `markup / nodes` | Custom SVG shapes for a glyph the set does not have. Takes precedence over `name`. |
| `label` | `string` | An accessible label. With it the icon is announced as an image; without it it is decorative (hidden from assistive tech). |
| `color` (Flutter) / `style` (web) | `Color / CSS` | Tint the icon. By default it inherits `currentColor` from the surrounding text. |

Only the ~113 names the library itself uses are compiled into each bundle; every other name resolves
on demand on the web. On Angular and Flutter, names outside the compiled set are drawn by passing
`path` or `svg`, so any of the ~5,200 icons — and your own — render everywhere.

## Theming [#theming]

An icon has no colour of its own: it strokes with `currentColor`, so it matches the text it sits in
and switches with light and dark (`data-theme="dark"`) automatically. Set a colour by styling the
element (web) or the `color` parameter (Flutter). The 24×24 grid, 1.75 stroke width and round caps
are shared across all four frameworks, so the same glyph looks identical in each.
