# Browser session (/docs/components/browser-session)

A browser session shows the agent browsing the web for you: a small browser frame with the page it
is on, the steps it takes under it, and Pause and Take over. When a step waits for you — a cookie
banner in the way, say — it shows why and a button to let the agent go on. Take over hands the page
to you: its frame turns the accent colour, its controls become usable, and the button reads Hand
back.

<Preview>
  <BrowserSessionExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { BrowserSession } from './browser-session/BrowserSession';

<BrowserSession
  title="Pricing research"
  url="northwind.app/pricing"
  steps={[
    { label: 'Click "Pricing"', state: 'done' },
    { label: 'Read the plans table', state: 'waiting', detail: 'A cookie banner covers the table' },
  ]}
  ask={{ label: 'Allow closing it', onAllow: allow }}
>
  <div className="vo-bws-pg">{/* the page, drawn as a wireframe */}</div>
</BrowserSession>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [BrowserSessionComponent] -->
<BrowserSession
  title="Pricing research"
  url="northwind.app/pricing"
  [steps]="steps"
  [ask]="cookieAsk"
>
  <ng-template #page>
    <div class="vo-bws-pg"><!-- the page, drawn as a wireframe --></div>
  </ng-template>
</BrowserSession>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/browser_session.dart';

BrowserSession(
  title: 'Pricing research',
  url: 'northwind.app/pricing',
  steps: const [
    BrowserStep(label: 'Click "Pricing"', state: BrowserStepState.done),
    BrowserStep(label: 'Read the plans table', state: BrowserStepState.waiting, detail: 'A cookie banner covers the table'),
  ],
  ask: BrowserAsk(label: 'Allow closing it', onAllow: allow),
  page: const PricingWireframe(),
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | What the agent is browsing for, like "Pricing research". |
| `url` | `string` | The address bar: the page's address, or the search being typed. |
| `search` | `boolean` | Marks `url` as a search, with a magnifier instead of the padlock. |
| `steps` | `BrowserStep[]` | The steps the agent takes. Each has a `label`, a `state` of `queued`, `running`, `waiting` or `done`, and an optional `detail`. |
| `cursor` | `object` | The agent's own pointer, in pixels from the page's top left. Hidden while you have control. |
| `ask` | `object` | While a step waits: the button that lets the agent go on. Has a `label` and `onAllow`. |
| `paused` / `defaultPaused` | `boolean` | Pause holds the agent where it is. Leave `paused` out to let the button toggle it. |
| `inControl` / `defaultInControl` | `boolean` | Take over hands the page to you. Leave `inControl` out to let the button toggle it. |
| `seconds` | `number` | Seconds to show as m:ss. Leave it out to let the clock count while browsing. |
| `status` | `string` | The line under the title. Defaults to a status word, then the clock. |
| `summary` | `string` | Shown under the steps once every step is done. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The page
is drawn small, with real words where they matter and grey lines for the rest; a price the agent has
taken is marked in the accent fill. While you have control the frame turns the accent colour. In
Blueprint the frame and chips are squared off.
