# Source stack (/docs/components/source-stack)

An answer with its sources folded into one quiet pill. Open the pill to see each source as a row —
its favicon, where it came from and a small bar for how much it counted — and use the filter chips
to pick by `kind` (`web`, `file`, `figma`, …). Each source takes a `title`, a `host`, a `relevance`
from 0 to 1, a `mark` for the favicon square and its `color`; give one an `onOpen` and it grows an
open button on hover. Leave `open` and `filter` out to let the pill and chips drive themselves.

<Preview>
  <SourceStackExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { SourceStack, type StackSource } from './source-stack/SourceStack';

const sources: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: 0.92, mark: 'B', color: 'var(--vo-pb)', onOpen: () => open(url) },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: 0.84, mark: 'CSV', color: 'var(--vo-pm)' },
];

<SourceStack sources={sources}>
  Annual plans convert about 18% better when the monthly price is shown crossed out.
</SourceStack>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [SourceStackComponent] -->
sources: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: 0.92, mark: 'B', color: 'var(--vo-pb)', onOpen: () => this.open(url) },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: 0.84, mark: 'CSV', color: 'var(--vo-pm)' },
];

<SourceStack
  [sources]="sources"
  message="Annual plans convert about 18% better when the monthly price is shown crossed out."
  (openChange)="onOpenChange($event)"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/source_stack.dart';

SourceStack(
  message: 'Annual plans convert about 18% better when shown crossed out.',
  sources: [
    StackSource(kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: 0.92, mark: 'B', color: c.accentMark, onOpen: () => open(url)),
    StackSource(kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: 0.84, mark: 'CSV', color: c.fg2),
  ],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `children` / `message` | `ReactNode` / `string` | The answer the sources back up, shown above the pill. |
| `sources` | `StackSource[]` | The sources, drawn as rows when the stack is open. |
| `filters` | `SourceFilter[]` | The chips above the list. Defaults to All, Web, Files and Figma. |
| `filter` | `string` | The chosen filter. Leave it out to let the chips switch it. |
| `defaultFilter` | `string` | The filter to start on when uncontrolled. Defaults to `all`. |
| `onFilterChange` | `(filter) => void` | Called when a chip is picked. |
| `open` | `boolean` | Whether the list is open. Leave it out to let the pill toggle it. |
| `defaultOpen` | `boolean` | Whether it starts open when uncontrolled. Defaults to `false`. |
| `onOpenChange` | `(open) => void` | Called when the pill toggles the list. |
| `source.kind` | `string` | What kind of source it is; the chips pick by this, like `web`, `file` or `figma`. |
| `source.title` | `string` | The source's name. |
| `source.host` | `string` | Where it came from, like `baymard.com` or `Drive`. |
| `source.relevance` | `number` | 0 to 1, drawn as a small bar. |
| `source.mark` | `string` | One to three letters in the favicon square, like `B` or `CSV`. |
| `source.color` | `string` | The favicon colour, any CSS colour. |
| `source.onOpen` | `() => void` | Adds an open button that shows on hover. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The pill
and rows ride the shared `--vo-*` tokens; the filter chips are white with a dimmed edge that steps up
on the picked one, and the relevance bars fill with `--vo-accent-mark`. In Soft the chips and rows are
rounder. The entrance stagger and the one-time auto-open are skipped under reduced motion.
