# JavaScript Utilities ![CI](https://github.com/NoelDeMartin/utils/actions/workflows/ci.yml/badge.svg)

These are some JavaScript utilities I use in different projects. If you want to use them as well, you're most welcome. You can install the package with:

```sh
npm install @noeldemartin/utils
```

## Helpers

There is a bunch of helpers I've been reusing across projects, and I wanted to get them in one place to abide by the DRY principle (Don't Repeat Yourself). They consist of simple operations such as converting a string to camelCase, checking if an element exists within an array, etc.

The best way to check these out is by looking at the test files within the [src/helpers/](src/helpers/) folder.

### MagicObject

One particularly interesting helper is `MagicObject`. I've found myself using this pattern ever more often, so I encapsulated it in this class. The idea is that taking advantage of [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) objects, and a using [an obscure property of JavaScript constructors](https://262.ecma-international.org/5.1/#sec-13.2.2), we can use [PHP's Magic Methods](https://www.php.net/manual/en/language.oop5.magic.php) in JavaScript:

```js
class MyClass extends MagicObject {

    protected __get(property: string) {
        if (property === 'foo') {
            return 'Foo works!';
        }

        return undefined;
    }

}

const myObject = new MyClass();

console.log(myObject.foo); // prints "Foo works!"
console.log(myObject.bar); // prints undefined
```

Take a look at the [source code](./src/helpers/MagicObject.ts) and [tests](./src/helpers/MagicObject.test.ts) if you're interested to learn more!

## Fluent API

I strive to write readable code, and I wasn't happy with combining my own helpers with built-in methods. There is nothing in the fluent API that's not implemented in some helper, this is all about readability.

For example, this is the kind of code I'd write often:

```js
const items = ['my', 'array', 'of', 'cool', 'array', 'items'];

return arrayUnique(items.filter((item) => item.startsWith('a')));
```

Where `arrayUnique` is a custom helper (which you can find in this package), and `Array.filter` is a native method. My only option was to combine method chaining with nesting function calls. And the end result wasn't too readable.

Now, with the fluent API I created in this package, I can write it like this:

```js
return fluent(['my', 'array', 'of', 'cool', 'array', 'items']) // or, to be explicit, arr([...])
    .filter((item) => item.startsWith('a'))
    .unique()
    .toArray(); // returns ['array']
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

And all of this works properly with TypeScript! So when I create a variable with `fluent('foo')`, I get auto-completion for both my custom helpers and native methods - along the complete method chain!

### tap

I also included my own port of [Laravel's tap helper](https://medium.com/@taylorotwell/tap-tap-tap-1fc6fc1f93a6). This allows me to rewrite this kind of code:

```js
const foo = new Foo();

foo.bar = 'bar';

return foo;
```

Like this:

```js
return tap(new Foo(), (foo) => {
    foo.bar = 'bar';
});
```

### facade

Something else Laravel-inspired are [facades](https://laravel.com/docs/10.x/facades#main-content). Unlike Laravel, there is no underlying service container, these facades just hold static proxies to an instance:

```js
// UsersService.ts
export default class UsersService {

    async all() {
        const response = await fetch('/users');
        const json = await response.json();

        return json.map(userJson => User.fromJson(userJson));
    }

}

// Users.ts
import UsersService from './UsersService';

export default facade(new UsersService());

// Anywhere in your app...
import Users from './Users';

const users = await Users.all();
```
