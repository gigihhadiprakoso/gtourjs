# GTourJS

**GTourJS** is a lightweight JavaScript library that helps you create interactive guides for new users. With this library, you can highlight important elements in your app and provide hints or descriptions that help users understand the function of each element.

🌐 **[Live Demo & Documentation](https://gtourjs.vercel.app)**

[![NPM Version](https://img.shields.io/npm/v/gtourjs.svg)](https://www.npmjs.com/package/gtourjs)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

---

## Demo

Check out the interactive demo and full documentation at: **[gtourjs.vercel.app](https://gtourjs.vercel.app)**

---

## Installation

### Via NPM

Install gtourJS using npm:

```bash
npm install gtourjs
```

Then import in your JavaScript file:

```javascript
import gtourJS from 'gtourjs';
import 'gtourjs/dist/gtour.min.css';
```

Or using require (with a bundler that supports CSS imports):

```javascript
const gtourJS = require('gtourjs');
require('gtourjs/dist/gtour.min.css');
```

The package ships a CommonJS/UMD build (`dist/gtour.min.js`) and an ES module build (`dist/gtour.esm.mjs`), so it works with Node.js, React, Vue, Svelte, and any bundler that supports the `exports` field.

### Via CDN (jsDelivr)

Add the following script in the `<head>` section or before the closing `<body>` tag:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@latest/gtour.min.css" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@latest/gtour.min.js"></script>
```

### Via Direct Download

Download the files directly from the repository and include them in your project:

```html
<link rel="stylesheet" href="path/to/gtour.min.css">
<script src="path/to/gtour.min.js"></script>
```

---

## Usage

### 1. Initialize Library

Add script inside of `<script>` section

#### 1.1 Without Option

```javascript
const tour = new gtourJS()
```

#### 1.2 Using Option

```javascript
const tour = new gtourJS({
    allowClose: false,
    exitConfirmation: true,
    backgroundColor: '#ff0'
})
```

### 2. Create Stages

Create stages with title and description of each element you want to explain to your users

```javascript
tour.queue([
    {
        elem: "#title",
        position: "bottom",
        title: "Hi, welcome to my quick tour about my website",
        description: "This tour will help you to understand the use of the website in a quick and easy way. I hope you enjoy it"
    }
]);
```

### 3. Run It

Don't forget to run through the steps once you've defined them.

```javascript
tour.run();
```

### 4. Change Font at Runtime

You can change the tooltip and button font at any time, even while the tour is running, using `setFont`.

```javascript
tour.setFont("Arial, sans-serif");
```

The font will also be used for the following steps. To set the font before the tour starts, use the `textFont` option or call `setFont` before `run()`.

### 5. Destroy the Tour

Call `destroy()` to remove the overlay, tooltip, and spotlight. This is useful when a component is unmounted.

```javascript
tour.destroy();
```

---

## Framework Usage

gtourJS is SSR-safe. Importing, constructing, and queueing steps never touches the DOM. Only `run()` needs a browser, so call it from a mount/browser lifecycle hook and clean up with `destroy()`.

### React

```jsx
import { useEffect } from 'react';
import gtourJS from 'gtourjs';
import 'gtourjs/dist/gtour.min.css';

export default function App() {
    useEffect(() => {
        const tour = new gtourJS({ textFont: 'Inter, sans-serif' });

        tour.queue([
            { elem: '#target', title: 'Welcome', description: 'Hello!', position: 'bottom' }
        ]);

        tour.run();

        return () => tour.destroy();
    }, []);

    return <div id="target">My app</div>;
}
```

### Vue

```vue
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import gtourJS from 'gtourjs';
import 'gtourjs/dist/gtour.min.css';

let tour;

onMounted(() => {
    tour = new gtourJS({ textFont: 'Inter, sans-serif' });
    tour.queue([
        { elem: '#target', title: 'Welcome', description: 'Hello!', position: 'bottom' }
    ]);
    tour.run();
});

onBeforeUnmount(() => {
    if (tour) tour.destroy();
});
</script>

<template>
    <div id="target">My app</div>
</template>
```

### Svelte

```svelte
<script>
    import { onMount, onDestroy } from 'svelte';
    import gtourJS from 'gtourjs';
    import 'gtourjs/dist/gtour.min.css';

    let tour;

    onMount(() => {
        tour = new gtourJS({ textFont: 'Inter, sans-serif' });
        tour.queue([
            { elem: '#target', title: 'Welcome', description: 'Hello!', position: 'bottom' }
        ]);
        tour.run();
    });

    onDestroy(() => {
        if (tour) tour.destroy();
    });
</script>

<div id="target">My app</div>
```

### Node.js

In a plain Node.js process there is no DOM. Importing and constructing the tour is safe, but `run()` is a no-op that logs a warning. Use it with a DOM implementation such as jsdom, or pass a `document`/`window` explicitly:

```javascript
const { JSDOM } = require('jsdom');
const gtourJS = require('gtourjs');

const dom = new JSDOM('<body><div id="target"></div></body>');

const tour = new gtourJS({
    document: dom.window.document,
    window: dom.window
});

tour.queue([
    { elem: '#target', title: 'Welcome', description: 'Hello!', position: 'bottom' }
]);

tour.run();
```

In a server-rendered framework (Next.js, Nuxt, SvelteKit), create and run the tour inside `useEffect`, `onMounted`, or `onMount` so it only executes in the browser.

---

## Configuration Options

You can use the options provided below. Please implement according to your preference.

| Option | Data Type | Default | Description |
|:-------|:----------|:-------:|:------------|
| `allowClose` | `boolean` | `true` | Gives the user the option to skip step by step or go all the way to the end |
| `backgroundColor` | `string` | `#fff` | Color of background's element can change according to your taste.<br>Input using HSL/RGB/HEX color format |
| `textColor` | `string` | `#000` | Color of text's element can change according to your taste.<br>Input using HSL/RGB/HEX color format |
| `textFont` | `string` | `inherit` | Font family for the tooltip and button text, e.g. `"Arial, sans-serif"`. Defaults to inheriting the application font |
| `exitConfirmation` | `boolean` | `false` | Pop up a confirmation when the user is about to exit without completing the step by step |
| `indicatorAvailable` | `boolean` | `true` | Show or hide indicator |
| `indicatorColorActive` | `string` | `#6e6e6e` | Color of the active indicator can be changed according to the website theme.<br>Input using HSL/RGB/HEX color format |
| `indicatorColor` | `string` | `#ddd` | Step-by-step indicator can be changed.<br>Input using HSL/RGB/HEX color format |
| `buttonLabel` | `boolean` | `false` | Pop up the label on the next or previous button |
| `document` | `object` | browser `document` | Optional document override, useful for Node.js/jsdom |
| `window` | `object` | browser `window` | Optional window override, useful for Node.js/jsdom |


---

## Browser Support

This library supports the following modern browsers:

- Chrome
- Firefox
- Edge
- Safari 12+ (macOS and iOS)

Safari-specific compatibility notes:

- The build targets Safari 12 syntax.
- Smooth scrolling falls back to `window.scrollTo` when `scrollBehavior` is unavailable, and scroll completion is detected without relying on the `scrollend` event.
- Indicator spacing uses `gap` with a margin fallback for Safari versions without flex `gap`.
- The spotlight shadow uses comma-separated `rgba()` for older WebKit engines.

---

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.

---

## License

Copyright 2024 Gigih Hadi Prakoso

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


---

## Questions or Feedback

If you have any questions or need help, feel free to contact us via [issues](https://github.com/gigihhadiprakoso/gtourjs/issues).
