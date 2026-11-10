# Grid (/docs/components/grid)

A grid is a layout primitive for arranging cards or any other components. Give it a fixed column
count with `cols`, or set `fit` to pack as many columns as fit at a minimum width (`min`) so it
reflows on its own with no breakpoints. `gap` sets the gutter. A child spans more than one column
with `span` (`2`, `3`, `4`) or the full row with `span="full"`. The grid is its own container, so it
collapses to one column when it gets narrow — whatever the page around it does.

<Preview>
  <GridExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { Grid, GridItem } from './grid/Grid';

<Grid cols={3} gap={4}>
  <GridItem span={2}>spans two</GridItem>
  <div>…</div>
  <div>…</div>
</Grid>

<Grid fit min="200px">
  <div>…</div>
  <div>…</div>
</Grid>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [GridComponent, GridItemDirective] -->
<Grid [cols]="3" [gap]="4">
  <div gridItem="2">spans two</div>
  <div>…</div>
  <div>…</div>
</Grid>

<Grid [fit]="true" min="200px">
  <div>…</div>
  <div>…</div>
</Grid>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/grid.dart';

VoGrid(
  cols: 3,
  gap: 16,
  children: [
    VoGridItem(span: 2, child: cell('spans two')),
    cell('…'),
    cell('…'),
  ],
),

VoGrid(
  fit: true,
  min: 200,
  children: [cell('…'), cell('…')],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `cols` | `number` | A fixed column count. Ignored when `fit` is set. `3` by default. |
| `fit` | `boolean` | Pack as many columns as fit at `min` width, reflowing with no column count. |
| `min` | `string` | Minimum column width when `fit` is set. `200px` by default. |
| `gap` | `1–8 \| string` | The gutter: a core spacing step or a raw CSS length. `4` by default. |
| `span` (on a child) | `2 \| 3 \| 4 \| full` | Make a child span more than one column, or the full row. |

In React and Flutter a spanning child is wrapped in `GridItem` / `VoGridItem`; in Angular it carries
the `gridItem` directive.

## Theming [#theming]

The grid is pure layout — it adds no color, shadow or border of its own, so the children it holds
(cards, charts, tables) carry the look. Spacing flows through the shared `--vo-s-*` tokens. It works
unchanged in light and dark and in both the Soft and Blueprint styles.
