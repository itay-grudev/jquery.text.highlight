jQuery Text Highlight
=====================

jQuery Text Highlight is a plugin for highlighting words

Usage Examples
--------------

Given the following html:

```html
<h1>Hello World</h1>
```

```javascript
$('h1').textHighlight('Hello');
$('h1').textHighlight(/World/);
$('h1').textHighlight([/World/, 'World']);
$('h1').textHighlight(['World', 'World'], {
  element: 'mark',
  class: '',
  caseSensitive: false
});
```

Each line will produce the following markup:

```html
<h1><mark>Hello</mark> World</h1>
<h1>Hello <mark>World</mark></h1>
<h1><mark>Hello</mark> <mark>World</mark></h1>
<h1><mark>Hello</mark> <mark>World</mark></h1>
```

License
-------
This plugin and the associated documentation are distributed under the terms of
the MIT License. See `COPYING` for more details.
