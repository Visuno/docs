# Code viewer (/docs/components/code-viewer)

The code the agent wrote, across one or more files. The lines it changed are marked — their
number turns green and the line gets a wash — and the `+N changed` count in the header follows the
open file. Click a line and the agent explains it: a note folds open under the line, reads for a
moment, then crossfades to what it says. The copy button copies the open file's text.

<Preview>
  <CodeViewerExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { CodeViewer, type CodeFile } from './code-viewer/CodeViewer';

const files: CodeFile[] = [
  {
    name: 'PlanCard.tsx',
    lines: [
      { code: [['k', 'export function'], ' ', ['f', 'PlanCard'], '() {'] },
      {
        code: [['tg', '  <Button '], ['at', 'variant'], '=', ['s', '"primary"'], ['tg', '/>']],
        changed: true,
        note: 'Swapped the custom button for the shared one.',
      },
      { code: '}' },
    ],
  },
];

<CodeViewer files={files} onCopy={(text) => navigator.clipboard.writeText(text)} />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [CodeViewerComponent] -->
files: CodeFile[] = [
  {
    name: 'PlanCard.tsx',
    lines: [
      { code: [['k', 'export function'], ' ', ['f', 'PlanCard'], '() {'] },
      { code: [['tg', '  <Button />']], changed: true, note: 'Shared button now.' },
      { code: '}' },
    ],
  },
];

<CodeViewer [files]="files" (copy)="onCopy($event)" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/code_viewer.dart';

CodeViewer(
  files: [
    CodeFile(
      name: 'PlanCard.tsx',
      lines: [
        CodeLine(pieces: [
          CodePiece('export function ', CodeToken.k),
          CodePiece('PlanCard', CodeToken.f),
          CodePiece('() {'),
        ]),
        CodeLine(
          pieces: [CodePiece('  <Button />', CodeToken.tg)],
          changed: true,
          note: 'Shared button now.',
        ),
        CodeLine.text('}'),
      ],
    ),
  ],
  onCopy: (text) {},
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `files` | `CodeFile[]` | The files the agent changed. Each has a `name` and `lines`. |
| `file` | `string` | The open file, by name. Leave it out to let the tabs switch it. |
| `defaultFile` | `string` | The file open at first when `file` is not controlled. |
| `onFileChange` | `(name) => void` | Called with the name of the file the tabs switch to. |
| `line` | `number \| null` | The line whose note is open (0 is the first), or `null`. Leave it out to let a click open it. |
| `defaultLine` | `number \| null` | The line open at first when `line` is not controlled. |
| `onLineChange` | `(line) => void` | Called with the line whose note opened, or `null` when it closed. |
| `delay` | `number` | How long a note says "Reading the line" before it answers, in ms. Defaults to `600`. |
| `unchangedNote` | `string` | The note for a line the agent didn't change and has nothing to say about. |
| `onCopy` | `(text) => void` | Called with the file's text when it is copied. |
| `CodeLine.code` | `string \| CodePiece[]` | The line as plain text, or as `[token, text]` pieces to highlight. |
| `CodeLine.changed` | `boolean` | The agent changed this line: its number turns green and the line gets a wash. |
| `CodeLine.note` | `string` | What the agent says about the line when you click it. |

The highlight tokens are `k` keyword, `s` string, `f` function, `cm` comment, `tg` tag and `at`
attribute.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The panel
sits on a surface; the changed-line wash comes from the `ok` token, the open line and its note from
the selection tint, and the syntax colours from the shared highlight tokens, so the code reads the
same against either theme.
