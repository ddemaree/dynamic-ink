# Dynamic Ink: Utility-based color theming for Tailwind

A plugin that provides CSS custom property-based dynamic color theming, allowing you to use semantic color names like `ink` or `body-text` to style elements, with seamless support for dark mode, art direction, or whatever else you can think of.

## Installation

First, install the plugin from NPM:

```sh
# Using NPM
npm install --save-dev @ddemaree/dynamic-ink

# or if you're a cat
yarn add --dev @ddemaree/dynamic-ink
```

Then add it to the `plugins` section of your `tailwind.config.js` file:

```js
module.exports = {
  plugins: [
    require('@ddemaree/dynamic-ink')
  ]
}
```

## Usage

This plugin provides some base styles (well, custom properties and values) and two kinds of utilities for working with dynamic colors in your project.

### Custom properties

Dynamic Ink defines a bunch of named color 'slots' as variables, e.g. `--color-background`, in the root element of your document (the `:root` selector). You can configure the plugin to have any slot names or default colors you want; by default, it defines the following using Tailwind's built-in color palettes:

|Slot name|Default/light value|Dark value|
|---|---|---|
|`--color-background`|`white`|`warmGray.900`|
|`--color-ink` (body text, AAA contrast)|`warmGray.800`|`warmGray.300`|
|`--color-ink-medium` (lower emphasis text, AA contrast)|`warmGray.500`|`warmGray.500`|
|`--color-ink-light` (lowest emphasis, not accessible)|`warmGray.200`|`warmGray.700`|
|`--color-accent` (suitable for buttons/links, AA contrast)|`red.600`|`red.400`|

If you have Tailwind's dark mode support enabled and set to `media` (media query) mode, the plugin will automatically toggle on dark mode colors when `prefers-color-scheme: dark` is true.

While Dynamic Ink provides utility classes to work with these properties, you can also use them however you like in your CSS using the `var()` function:

```css
a.special-fancy-link {
  background-color: var(--color-background);
  color: var(--color-accent);
  box-shadow: 1px 1px 1px var(--color-accent);
}
```

### Applying dynamic color

Similar to how Tailwind allows you to apply spot colors using utilities like `text-red-500`, Dynamic Ink provides classes to apply your named colors.

```html
<article class="blog-post-card bg-background text-ink">
  <h2><a href="/p/dynamic-ink-plugin" class="text-ink-bold">Announcing Dynamic Ink!</a></h2>
  <p class="text-ink-medium">A cool new plugin for color stuff</p>
</article>
```

The classes follow the same naming convention as Tailwind's core color plugins, e.g. `textColor`, `backgroundColor`, etc, and in fact it only enables a set of utilities if its corresponding core plugin is enabled. If you've, say, disabled the `fill` plugin because you never style SVG, Dynamic Ink won't add extra `fill` classes.

### Applying base styles

By default, Dynamic Ink doesn't apply its semantic colors to your document — you need to do that either with custom CSS or utility classes.

```html
<html class="bg-background text-ink">
```

For convenience, the plugin also provides the `dynamic-ink` class that will automagically set your default background, text, link, and bold/strong colors.

```html
<html class="dynamic-ink">
```

### Setting color values using classes

In addition to _applying_ colors using Dynamic Ink's utility classes, you can also (optionally) add utilities for _setting_ colors at runtime.

```html
<div class="set-ink-red-500 dark:set-ink-red-300">
<!-- The `ink` color will now be red.500 in light mode and red.300 in dark mode in this element and its children -->
</div>
```

Dynamic Ink automatically creates setters for all of your color slots and all of the colors in your Tailwind theme. Because this can create _a lot_ of unused CSS and slow down your builds, this feature is turned **off** by default.

To enable setter classes, pass the `enableSetters` option in your config file:

```js
module.exports = {
  plugins: [
    require('@ddemaree/dynamic-ink')({
      enableSetters: true
    })
  ]
}
```

## Responsive Variants

By default, Dynamic Ink supports Tailwind's `dark` and `hover` variants, allowing you to set or apply colors conditionally in dark mode or when an element is hovered.

```html
<button type="submit" class="bg-action hover:bg-action-hovered">Submit</button>
```

You can configure this behavior using the `variants` setting in `tailwind.config.js`.

```js
module.exports = {
  variants: {
    themeColors: ['dark', 'hover', 'responsive']
  }
}
```

## Customizing Colors

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

Any colors defined at the top level of the theme object are assumed to be `@default`, so you can simplify your config:

```js
module.exports = {
  theme: {
    inkColors: {
      background: '#fff',
      ink: '#333',
      '@dark': {
        background: '#000',
        ink: '#aaa'
      }
    }
  }
}
```

## Caveats & other things you should know

### Most, but not all, color plugins are supported

Dynamic Ink ships with support for the following core plugins:

* Text color (`textColor`)
* Background color (`backgroundColor`)
* Border color (`borderColor`)
* SVG fill (`fill`)

Support for the `placeholder`, `ringColor` and `divideColor` plugins is planned for future releases.

### Dark mode works with media queries only

Media query-based dark modes are supported automatically, but class-based dark mode (`darkMode: 'class'` in config) is not yet implemented. It too is coming in a future release.

If you are using class-based dark mode in Tailwind, Dynamic Ink will define your default colors only on the `:root` selector. You can add some CSS to patch in support until the plugin supports this automatically:

```css
.dark {
  --color-background: #000;
  --color-ink: theme('colors.warmGray.200');
  /* etc */
}
```

### The `.dynamic-ink` utility assumes default color names

Right now the plugin makes some assumptions about color slot names and intended use, e.g. background colors are named `background`, body colors are named `ink`, links should be colored with `accent`. And these assumptions are baked into the `.dynamic-ink` component style.

This plugin is extracted from some code that I use on every project, so this is fine for me, but if you change the naming conventions you may find that that utility doesn't work so well for you.

One workaround is to define dynamic colors that reference other dynamic colors:

```js
// tailwind.config.js
module.exports = {
  theme: {
    inkColors: {
      // The link color and slot name you want
      primary: colors.blue[600],

      // `accent` would automatically color links when `.dynamic-ink` is set on a parent element
      accent: `var(--color-primary)`
    }
  }
}
```

## Credits & contacts

Questions, feedback, bugs, requests? Please [open a new issue](https://github.com/ddemaree/dynamic-ink/issues/new) on this repo. You can also email me at <demaree@hey.com>.

This code is released as-is [under the MIT license](./LICENSE).

&copy; 2021 [David Demaree](https://demaree.me)