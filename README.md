# GTourJS

**GTourJS** is a lightweight JavaScript library that helps you create interactive guides for new users. With this library, you can highlight important elements in your app and provide hints or descriptions that help users understand the function of each element.

---

## Installation

### Via CDN (jsDelivr)

Add the following script in the `<head>` section or before the closing `<body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@release/gtour.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@release/gtour.min.css">
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
---

## Configuration Options

You can use the options provided below. Please implement according to your preference.

| Option | Data Type | Default | Description |
|:-------|:----------|:-------:|:------------|
| `allowClose` | `boolean` | `true` | Gives the user the option to skip step by step or go all the way to the end |
| `backgroundColor` | `string` | `#fff` | Color of background's element can change according to your taste.<br>Input using HSL/RGB/HEX color format |
| `textColor` | `string` | `#000` | Color of text's element can change according to your taste.<br>Input using HSL/RGB/HEX color format |
| `exitConfirmation` | `boolean` | `false` | Pop up a confirmation when the user is about to exit without completing the step by step |
| `indicatorAvailable` | `boolean` | `true` | Show or hide indicator |
| `indicatorColorActive` | `string` | `#6e6e6e` | Color of the active indicator can be changed according to the website theme.<br>Input using HSL/RGB/HEX color format |
| `indicatorColor` | `string` | `#ddd` | Step-by-step indicator can be changed.<br>Input using HSL/RGB/HEX color format |
| `buttonLabel` | `boolean` | `false` | Pop up the label on the next or previous button |


---

## Browser Support

This library support following modern browser:

- Chrome
- Firefox
- Edge
- Safari (still a test run)

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
