# Artifact card (/docs/components/artifact-card)

A file the agent made, shown four ways with the same behaviour: a `compact` row, a `preview` card
with its first page, an `inline` chip inside a message, or a `stack` of its versions. Each plays a
writing state while `state` is `writing` — the meta line shows `status` and the actions hold back —
then settles when it turns `ready`. From there you can open the file in a reader, switch between its
`versions`, Copy its content and Download it.

<Preview>
  <ArtifactCardExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { ArtifactCard, type ArtifactVersion } from './artifact-card/ArtifactCard';

const versions: ArtifactVersion[] = [
  { title: 'Pricing page review', meta: 'edited 2 hours ago', note: 'First pass', content: '# Pricing page review\n\n## Summary\n\n…' },
  { title: 'Pricing page review', meta: 'edited just now', note: 'Fixes, ordered by impact', content: '# Pricing page review\n\n## Summary\n\n…' },
];

<ArtifactCard
  variant="compact"
  versions={versions}
  kind="Report"
  icon="file-text"
  state="ready"
  onOpen={(v) => openBesideChat(v)}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ArtifactCardComponent] -->
versions: ArtifactVersion[] = [
  { title: 'Pricing page review', meta: 'edited 2 hours ago', note: 'First pass', content: '# Pricing page review\n\n## Summary\n\n…' },
  { title: 'Pricing page review', meta: 'edited just now', note: 'Fixes, ordered by impact', content: '# Pricing page review\n\n## Summary\n\n…' },
];

<ArtifactCard
  variant="compact"
  [versions]="versions"
  kind="Report"
  icon="file-text"
  state="ready"
  (opened)="openBesideChat($event)"
/>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/artifact_card.dart';

const versions = [
  ArtifactVersion(title: 'Pricing page review', meta: 'edited 2 hours ago', note: 'First pass', content: '# Pricing page review\n\n## Summary\n\n…'),
  ArtifactVersion(title: 'Pricing page review', meta: 'edited just now', note: 'Fixes, ordered by impact', content: '# Pricing page review\n\n## Summary\n\n…'),
];

ArtifactCard(
  variant: ArtifactVariant.compact,
  versions: versions,
  kind: 'Report',
  icon: Icons.description_outlined,
  state: ArtifactState.ready,
  onOpen: (v) => openBesideChat(v),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `variant` | `compact \| preview \| inline \| stack` | How the card shows the file. Defaults to `compact`. |
| `versions` | `ArtifactVersion[]` | The versions, oldest first. |
| `version` | `number` | Index of the version shown. Leave it out to let the versions menu change it. |
| `defaultVersion` | `number` | The version shown at first. Defaults to the latest. |
| `onVersionChange` | `(version) => void` | Called when the shown version changes. |
| `state` | `writing \| ready` | `writing` holds the actions back and shows `status`; `ready` settles the card. |
| `status` | `string` | The line shown while writing, like "Reading the page…". |
| `progress` | `number` | How far the writing has got, from 0 to 1. The compact card draws it along its bottom edge. |
| `kind` | `string` | The kind of file on the meta line, like "Report" or "Table". |
| `icon` | `IconName` | The file's icon. |
| `fileName` | `string` | The name Download saves under, before "-v3.md". Defaults to the slugged title. |
| `ext` | `string` | The extension Download saves with. `csv` also shows the content as a table in the reader. |
| `onOpen` | `(version) => void` | Called when the file is opened. With a handler, Open does not show the card's own reader. |
| `openLabel` | `string` | The Open button's tip, like "Open beside the chat". Its label stays "Open". |
| `onCopy` | `(version) => void` | Called after Copy has put the version's content on the clipboard. |
| `onDownload` | `(version) => void` | Called after Download has saved the version's content as a file. |
| `ArtifactVersion.title` | `string` | The file's name in this version. |
| `ArtifactVersion.meta` | `string` | When this version was made, like "edited 2 hours ago". |
| `ArtifactVersion.note` | `string` | What changed in this version. Shown in the menu and the stack. |
| `ArtifactVersion.content` | `string` | The file itself, as Markdown (or CSV when `ext` is `csv`). |
| `ArtifactVersion.summary` | `string` | The text on the preview's first page. Defaults to the first paragraph of `content`. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The card
sits on a surface with the shared shadow, the icon tile and version marks take the accent, and the
reader opens over the card's nearest positioned ancestor — the stage here, your chat column in an
app. In Soft the card and its buttons are rounder; the stack also casts a soft shadow on the desk
that fades as the sheets are laid out.
