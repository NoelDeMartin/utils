# JavaScript Utilities [![Build Status](https://semaphoreci.com/api/v1/noeldemartin/utils/branches/main/badge.svg)](https://semaphoreci.com/noeldemartin/utils)

These are some JavaScript utilities I use in different projects. If you want to use them as well, you're most welcome. You can install the package with:

```sh
npm install @noeldemartin/utils
```

## Helpers

There is a bunch of helpers I've been reusing across projects, and I wanted to get them in one place to abide by the DRY principle (Don't Repeat Yourself). They consist of simple operations such as converting a string to camelCase, checking if an element exists within an array, etc.

The best way to check these out is by looking at the test files within the [src/helpers/](src/helpers/) folder.

## Fluent API

I strive to make readable code, and I wasn't happy with combining my own helpers with built-in methods. There is nothing in the fluent API that's not implemented in some helper, this is all about readability.

For example, this is the kind of code I'd write often:

```js
    const items = ['my', 'array', 'of', 'items'];

    return arrayContains(items.filter(item => item.startsWith('a')), 'array');
```

Where `arrayContains` is a custom helper (which you can find in this package), and `Array.filter` is a native method. My only option was to combine method chaining with nesting function calls. And the end result wasn't too readable.

Now, with the fluent API I created in this package, I can write it like this:

```js
return fluent(['my', 'array', 'of', 'items']) // or, to be explicit, arr([...])
    .filter(item => item.startsWith('a'))
    .contains('array'); // returns true
```

Like this, I'm able to combine native methods with custom helpers using method chaining.

And that's not only with arrays, for example with strings I can do:

```js
return fluent('foo-bar') // or, to be explicit, str('...')
    .replace('foo', 'hello')
    .replace('bar', 'world')
    .toStudlyCase()
    .toString(); // returns "HelloWorld"
```

I also included my own port of [Laravel's tap helper](https://medium.com/@taylorotwell/tap-tap-tap-1fc6fc1f93a6). This allows me to rewrite this kind of code:

```js
const foo = new Foo();

foo.bar = 'bar';

return foo;
```

Like this:

```js
return tap(new Foo(), foo => {
    foo.bar = 'bar';
});
```

And all of this works properly with TypeScript! So when I create a variable with `fluent('foo')`, I get auto-completion for both my custom helpers and native methods - along the complete method chain!
