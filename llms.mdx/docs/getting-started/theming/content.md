# Theming (/docs/getting-started/theming)

Every Visuno component reads from one shared set of **design tokens**, so you theme the whole UI from
one place instead of styling components one by one. There are two switches everyone uses out of the
box — **dark mode** and **style** — and underneath them, the tokens you can override to make the
library your own.

## The two switches [#the-two-switches]

On the web (React and Angular) both switches are attributes on a parent element; on Flutter they live
in the theme object. Every component below the switch responds at once.

### Dark mode [#dark-mode]

Set dark mode once, high up, and the whole subtree flips.

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
// Put it on a parent — often <html> or the app root.
<html data-theme="dark">
  {/* every component inside is dark */}
</html>

// Remove the attribute, or use data-theme="light", for light.
```

</Tab>

<Tab value="Angular">

```html
<!-- Put it on a parent — often <html> or the app root. -->
<html data-theme="dark">
  <!-- every component inside is dark -->
</html>

<!-- Remove the attribute, or use data-theme="light", for light. -->
```

</Tab>

<Tab value="Flutter">

```dart
import 'package:visuno/visuno.dart';

// Brightness.dark matches the web's dark mode.
MaterialApp(
  theme: VisunoTheme.dark,   // or VisunoTheme.light
  home: const Home(),
);
```

</Tab>

</Tabs>

### Style [#style]

Two styles, one design: **Blueprint** (default) is crisp and squared; **Soft** is rounded and plush.

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
// Switch to Soft with data-style on a parent. Combine it with data-theme freely.
<div data-theme="dark" data-style="soft">
  {/* dark + soft */}
</div>
```

</Tab>

<Tab value="Angular">

```html
<!-- Switch to Soft with data-style on a parent. Combine it with data-theme freely. -->
<div data-theme="dark" data-style="soft">
  <!-- dark + soft -->
</div>
```

</Tab>

<Tab value="Flutter">

```dart
// Pick the style on the theme; combine with either brightness.
MaterialApp(
  theme: VisunoTheme.dark.copyWith(style: VoStyle.soft),   // or VoStyle.blueprint
  home: const Home(),
);
```

</Tab>

</Tabs>

You can combine the switches freely — light/dark × Blueprint/Soft is four looks from the same source.

## The token system [#the-token-system]

Tokens are the single source of truth for every color, space, radius, and motion value. Components
never hardcode these — they read tokens — so overriding a token flows through the whole library.

| Platform | Tokens look like | Where to set them |
|----------|------------------|-------------------|
| **Web** (React / Angular) | `--vo-*` CSS custom properties | On `:root`, or scoped to any parent |
| **Flutter** | `VoColors` / `VoSpace` / `VoRadius` | In the Visuno theme |

### Override a token [#override-a-token]

Change a token once and it flows to every component under it.

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```css
/* Set --vo-* custom properties on :root, or scope them to a subtree. */
:root {
  --vo-accent: #6d5efc;   /* brand accent */
  --vo-radius: 12px;      /* corner rounding */
  --vo-space: 0.25rem;    /* spacing step */
}

/* Scope an override to theme just part of a page. */
.promo {
  --vo-accent: #e5484d;
}
```

</Tab>

<Tab value="Angular">

```css
/* Same mechanism as React — set --vo-* in your global styles or a component's styles. */
:root {
  --vo-accent: #6d5efc;   /* brand accent */
  --vo-radius: 12px;      /* corner rounding */
  --vo-space: 0.25rem;    /* spacing step */
}

/* Scope an override to a host or subtree. */
:host.promo {
  --vo-accent: #e5484d;
}
```

</Tab>

<Tab value="Flutter">

```dart
// Override values on the theme's token objects.
VisunoTheme.dark.copyWith(
  colors: VoColors.dark.copyWith(accent: const Color(0xFF6D5EFC)),
  radius: VoRadius.all(12),
);
```

</Tab>

</Tabs>

## How it fits together [#how-it-fits-together]

1. **Tokens** hold the raw values (color, space, radius, motion).
2. **The two switches** (`data-theme`, `data-style` on the web; the theme object on Flutter) select
   which set of token values is active.
3. **Components** read tokens only — so flip a switch or override a token, and every component
   updates in lockstep.

Change a token once and the change is everywhere — that is the whole point of the system.

<Cards>
  <Card title="Accessibility" href="/docs/getting-started/accessibility" description="Contrast, keyboard, focus, and reduced motion." />
  <Card title="Browse components" href="/docs/components/status-pill" description="Each page has a Theming note for that component." />
</Cards>
