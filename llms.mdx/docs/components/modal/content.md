# Modal (/docs/components/modal)

A modal is a centred dialog over a dimmed backdrop. It closes on the backdrop, its corner close
button or Escape; while it is open the page scroll is locked and focus is held inside the panel,
returning to the trigger when it closes. Give it a `title` and optional `subtitle`, a body, and an
optional `footer` row of buttons. `size` is `sm` (420px), `md` (560px, the default) or `lg` (820px).

<Preview>
  <ModalExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { Modal } from './modal/Modal';

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Delete project…</button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete this project?"
  size="sm"
  footer={
    <>
      <button className="vo-pill vo-ghost vo-sm" onClick={() => setOpen(false)}>Cancel</button>
      <button className="vo-pill vo-primary vo-sm" onClick={confirm}>Delete</button>
    </>
  }
>
  <p>This removes the project and all its runs. This can't be undone.</p>
</Modal>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ModalComponent] -->
<Modal
  [open]="open"
  size="sm"
  [hasFooter]="true"
  (close)="open = false"
>
  <span vo-modal-title>Delete this project?</span>
  <p>This removes the project and all its runs. This can't be undone.</p>
  <ng-container vo-modal-footer>
    <button class="vo-pill vo-ghost vo-sm" (click)="open = false">Cancel</button>
    <button class="vo-pill vo-primary vo-sm" (click)="confirm()">Delete</button>
  </ng-container>
</Modal>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/modal.dart';

showVoModal(
  context: context,
  builder: (ctx) => VoModal(
    title: 'Delete this project?',
    size: VoModalSize.sm,
    footer: [
      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
      FilledButton(onPressed: () { confirm(); Navigator.pop(ctx); }, child: const Text('Delete')),
    ],
    child: const Text("This removes the project and all its runs. This can't be undone."),
  ),
);
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the modal is on screen. |
| `onClose` | `() => void` | Called by the backdrop, the close button or Escape. |
| `title` | `ReactNode` | The heading at the top. Leave it out for a bare panel (then set `ariaLabel`). |
| `subtitle` | `ReactNode` | A quieter line under the title. |
| `footer` | `ReactNode` | A row of buttons pinned to the bottom. |
| `size` | `sm \| md \| lg` | How wide the panel may grow. `md` (560px) by default. |
| `hideClose` | `boolean` | Hide the corner close button (Escape and the backdrop still close it). |
| `disableBackdropClose` | `boolean` | Keep the modal open when the backdrop is clicked. |
| `ariaLabel` | `string` | For screen readers when there is no visible `title`. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The panel
uses the active theme's raised surface, text and shadow tokens; the backdrop dims with the ink token.
Motion is paused for readers who prefer reduced motion — the dialog simply appears instead of rising in.
