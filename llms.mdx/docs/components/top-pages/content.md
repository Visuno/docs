# Top pages (/docs/components/top-pages)

A ranked list of a site's most visited pages. Each row shows its rank, title and path, a share bar
against the busiest page, the view count and the percent change (green from `0`, red below). The
running total rolls up, and the `Views` / `Change` sort switch slides the rows into their new order.

<Preview>
  <TopPagesExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { TopPages, type TopPagesPage } from './top-pages/TopPages';

const pages: TopPagesPage[] = [
  { path: '/pricing', title: 'Pricing', views: 18420, change: 24 },
  { path: '/', title: 'Home', views: 15210, change: 3 },
  { path: '/components', title: 'Components', views: 9870, change: 41 },
];

<TopPages pages={pages} site="visuno.dev" period="last 30 days" />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [TopPagesComponent] -->
pages: TopPagesPage[] = [
  { path: '/pricing', title: 'Pricing', views: 18420, change: 24 },
  { path: '/', title: 'Home', views: 15210, change: 3 },
];

<TopPages [pages]="pages" site="visuno.dev" period="last 30 days" />
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/top_pages.dart';

TopPages(
  pages: const [
    TopPagesPage(path: '/pricing', title: 'Pricing', views: 18420, change: 24),
    TopPagesPage(path: '/', title: 'Home', views: 15210, change: 3),
  ],
  site: 'visuno.dev',
  period: 'last 30 days',
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `pages` | `TopPagesPage[]` | The page rows. Each has `path`, `title`, `views` and `change`. |
| `title` | `string` | Header text. Defaults to `Top pages`. |
| `period` | `string` | After the total, like `last 30 days`. |
| `site` | `string` | Put in front of each path in the row tips, like `visuno.dev`. |
| `sort` | `views \| change` | How the rows are ordered. Leave it out to let the switch change it. |
| `defaultSort` | `views \| change` | The order before the switch is touched. Defaults to `views`. |
| `onSortChange` | `(sort) => void` | Fires when the sort switch changes. |
| `page.path` | `string` | The page's path, like `/pricing`. Also the row's key. |
| `page.title` | `string` | Its name, like `Pricing`. |
| `page.views` | `number` | Views over the period; the share bar is against the busiest page. |
| `page.change` | `number` | Change in percent, like `24` or `-8`. Green from `0`, red below. |
| `page.tip` | `string` | Shown on hover. Defaults to `site` + `path`. |

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). The card
sits on a surface with the shared shadow; the share bars use the accent mark token, the change chips
the `ok` / `bad` tints, and the ranks the mono font — all from the theme tokens, so the list reads
the same against either background. In Soft the card and the sort switch are rounder.
