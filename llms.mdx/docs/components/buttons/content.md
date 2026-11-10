# Buttons (/docs/components/buttons)

A button is a pill in one of the variants — `primary` for the main action, `soft` and `line` for the
rest, `ghost` for the quietest — in three sizes. Return a promise from `onClick` and the button runs
itself: it shows the busy face until the promise settles, then the done face. `ButtonCopy` copies
text and flashes a check.

<Preview>
  <ButtonsExample />
</Preview>

## Usage [#usage]

<Tabs items={['Vanilla', 'React', 'Angular', 'Flutter']}>

<Tab value="Vanilla">

```html
<!-- include core.css + buttons.css -->
<button class="dm-pill dm-primary">Primary</button>
<button class="dm-pill dm-accent">Accent</button>
<button class="dm-pill dm-soft" aria-pressed="false">Preview</button>
<button class="dm-pill dm-line">Line</button>
<button class="dm-pill dm-ghost">Ghost</button>

<!-- sizes -->
<button class="dm-pill dm-accent dm-sm">Small</button>
<button class="dm-pill dm-accent dm-btx-lg">Large</button>
```

</Tab>

<Tab value="React">

```tsx
import { Button, ButtonCopy } from './buttons/Buttons';

<Button variant="primary">Primary</Button>
<Button variant="soft" size="sm">Small</Button>

// return a promise and the button runs busy -> done by itself
<Button variant="primary" busyLabel="Publishing" doneLabel="Published" onClick={publish}>
  Publish
</Button>
<Button variant="accent" success onClick={save}>Save</Button>

<ButtonCopy text="https://designme.dev" label="Copy link" />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [ButtonComponent, ButtonCopyComponent] -->
<dm-button variant="primary">Primary</dm-button>
<dm-button variant="soft" size="sm">Small</dm-button>

<dm-button variant="primary" busyLabel="Publishing" doneLabel="Published" (click)="publish()">
  Publish
</dm-button>
<dm-button variant="accent" [success]="true" (click)="save()">Save</dm-button>

<dm-button-copy text="https://designme.dev" label="Copy link" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/buttons.dart';

const Button('Primary', variant: ButtonVariant.primary),
const Button('Small', variant: ButtonVariant.soft, size: ButtonSize.sm),

Button('Publish', variant: ButtonVariant.primary, busyLabel: 'Publishing', doneLabel: 'Published', onClick: publish),
Button('Save', variant: ButtonVariant.accent, success: true, onClick: save),

ButtonCopy(text: 'https://designme.dev', label: 'Copy link'),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `variant` | `primary \| accent \| soft \| line \| ghost \| ink` | The style. Left out, a plain pill. `ink` is the old name for `primary`. |
| `size` | `sm \| md \| lg` | The three sizes; `md` is the default. |
| `icon` | `IconName` | An icon before the label. |
| `onClick` | `(e) => void \| Promise<unknown>` | Return a promise and the button runs busy then done by itself. |
| `busy` / `done` | `boolean` | Drive the busy or done face yourself. Clicks are ignored while shown. |
| `busyLabel` / `doneLabel` | `ReactNode` | The labels on the busy and done faces. |
| `busyGlyph` | `spin \| think` | The busy glyph: a spinner, or the agent's turning dots. |
| `success` | `boolean` | The done face turns green. |
| `pressed` | `boolean` | For a toggle: whether it is on, as `aria-pressed`. |
| `tip` / `kbd` | `string` | A tooltip, with an optional shortcut after it. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The
variants read against the theme's accent and surface tokens; in Soft the pills are rounder and
softer, and the busy and done faces blur across in either theme.
