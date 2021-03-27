# Dynamic Ink: Utility-based color theming for Tailwind

<p style="background-color: yellow; color: black; font-size: 2em; line-height: 1.1; padding: 0.5em">Note: this plugin is a work in progress. NPM/Yarn commands don't work and these docs aren't yet complete, but the code should work. Everything should be cleaned up during the week of 3/29/21 — DD</p>

Tailwind CSS is great at a lot of things, and as of version 2.0 it has good, built-in support for dark mode. However:

* Using dark mode can be very repetitive — anytime you want to switch colors, you have to combine class names like `text-black dark:text-white`. It sure would be nice if there were some utility that always knew that, in dark mode, black should become white.
* It sure would be nice if Tailwind's color utilities were more semantic — like, some text may happen to be black, but it's more important (and easier to remember) that it's your primary body text color. Semantic color names can reflect hierarchy or tonal scales within a design system, reducing guesswork and making it easier to create really consistent, robust work.

**Enter Dynamic Ink**, a Tailwind plugin that adds CSS custom property-based color theming utilities to your project.

Dynamic Ink defines a set of semantically-named color 'slots' to the root of your document, e.g. `background`, `ink`, `accent`, and gives you utility classes to apply them to your elements.

## Getting started

First, install the plugin using NPM or Yarn (these assume you already have Tailwind and its dependencies up and running):

```sh
# If you like NPM
npm install --save-dev @ddemaree/dynamic-ink

# or if you're a cat
yarn add --dev @ddemaree/dynamic-ink
```

Then add it to the `plugins` section of your Tailwind config (`tailwind.config.js`):

```js
module.exports = {
  plugins: [
    require('@ddemaree/dynamic-ink');
  ]
}
```

**Optional: Apply themed color defaults to your document.** If you want your default background, text, and link colors to use themed background, ink, and accent colors, apply the `.dynamic-ink` class to your `<html>` or `<body>` tag:

```html
<html class="dynamic-ink">
```

## Using the utilities

Dynamic Ink ships with support for the following core plugins:

* Text color (`textColor`)
* Background color (`backgroundColor`)
* Border color (`borderColor`)
* SVG fill (`fill`)

Theming utilities follow the naming convention `{property}-{slot}` — to set the text color of an element to your `ink-medium` slot, you'd assign it the class `.text-ink-medium`, like so:

```html
<!-- color: var(--color-ink-medium) -->
<p class="text-ink-medium">Posted on March 25, 2021</p>
```

## Customizing Your Theme

You can use Tailwind's `theme` config to override, extend, or customize your theme colors.

The following config…

```js
module.exports = {
  theme: {
    inkColors: {
      ink: '#333'
    }
  }
}
```

…will create the following utilities and custom properties:

```css
:root {
  ---color-ink: #333;
}

.text-ink { color: var(--color-ink); }
.bg-ink   { background-color: var(--color-ink); }
.border-ink { border-color: var(--color-ink); }
```

### Nested theme colors

Similar to Tailwind's schema for setting nested colors, you can define nested theme slots using object syntax and the `DEFAULT` key, to create simple semantic color scales:

```js
module.exports = {
  theme: {
    inkColors: {
      ink: {
        DEFAULT: '#333',
        bold: '#000'
      }
    }
  }
}
```

In addition to the `ink` utilities above, it would also create `--ink-bold`, `.text-ink-bold`, `.bg-ink-bold`, and so on.

### Support for dark/light schemes

Dynamic Ink supports dark mode by overriding the ink properties whenever the `@media (prefers-color-scheme)` query is in effect. By default, any ink colors you set are assumed to be, well, defaults. You can also explicitly set colors as default by wrapping them in an object named `@default`:

```js
module.exports = {
  theme: {
    inkColors: {
      '@default': {
        background: '#fff',
        ink: '#333'
      }
    }
  }
}
```

You can set dark mode colors using the same syntax and the name `@dark`:

```js
module.exports = {
  theme: {
    inkColors: {
      '@default': {
        background: '#fff',
        ink: '#333'
      },
      '@dark': {
        background: '#000',
        ink: '#aaa'
      }
    }
  }
}
```

This will add the following CSS to your base styles:

```css
:root {
  --color-background: #fff;
  --color-ink: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #000;
    --color-ink: #aaa;
  }  
}
```

**Caveat:** As of v0.1, Dynamic Ink supports Tailwind's media-query-based dark mode, but does not yet support class-based dark mode. This is on the roadmap for a future release.

## Setting theme colors from HTML

The cleanest way to set your baseline theme colors is by customizing your theme in Tailwind's config. But sometimes you might want to redefine a color on a given page or even within a container, while maintaining the same 