# Web search (/docs/components/web-search)

Web search shows an agent researching out loud. Each query is a row with how many results came
back and how long it took; a query that finds nothing is asked again in other words. Under each
query sit the pages it opened, each marked Read, Skimmed, or Skipped with the reason (paywall,
blocked, timeout). Once the run is done the trail folds to one line and the answer streams in,
its bracketed numbers pointing back at the pages that back them up.

<Preview>
  <WebSearchExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { WebSearch } from './web-search/WebSearch';

const queries = [
  { key: 'q1', query: 'stripe usage-based billing limits', status: 'done', results: 5, time: '0.9s',
    pages: [
      { title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: 'read', cite: 1 },
      { title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', status: 'paywall' },
    ] },
];

<WebSearch
  queries={queries}
  done
  answer="Stripe caps metered usage at 100 million events a month [1]."
  bare={false}
/>
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [WebSearchComponent] -->
queries: WebQuery[] = [
  { key: 'q1', query: 'stripe usage-based billing limits', status: 'done', results: 5, time: '0.9s',
    pages: [
      { title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: 'read', cite: 1 },
      { title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', status: 'paywall' },
    ] },
];
```

```html
<WebSearch
  [queries]="queries"
  [done]="true"
  answer="Stripe caps metered usage at 100 million events a month [1]."
  [bare]="false"
  (openChange)="onOpen($event)"
></WebSearch>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/web_search.dart';

WebSearch(
  queries: const [
    WebQuery(
      key: 'q1',
      query: 'stripe usage-based billing limits',
      results: 5,
      time: '0.9s',
      pages: [
        WebPage(title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: WebPageStatus.read, cite: 1),
        WebPage(title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', status: WebPageStatus.paywall),
      ],
    ),
  ],
  done: true,
  answer: 'Stripe caps metered usage at 100 million events a month [1].',
  bare: false,
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `queries` | `WebQuery[]` | The searches, in order. Each has a key, the query text, a status, a result count, a time, an optional rewritten flag, and its pages. |
| `done` | `boolean` | True once searching and reading are over. The trail folds to its summary line. |
| `answer` | `string` | The answer, with sources cited as numbers in brackets. Each number points at the page with that cite value. |
| `open` | `boolean` | Whether the trail is open. Left out, it folds once `done` turns true. |
| `onOpenChange` / `openChange` | `callback` | Fires when the trail is opened or closed. |
| `bare` | `boolean` | Without the panel, for a chat stream. True by default. |

A `WebPage` has a `title`, a `domain`, an optional `date`, a `status` (reading, read, skimmed,
paywall, blocked, or timeout), and an optional `cite` number the answer refers to it by.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). Skipped
pages dim and their tag turns amber; a running page shows a spinner. The site initials stack on the
header, and hovering a citation lights the page that backs it up along with its site mark.
