reshape
=======

Library for reshaping Javascript objects. Like copying but with
directives. Notation inspired by Angular.


### Directive examples

```js

reshape({
    name: '@name'
});

// This is same
reshape({
    name: '@'
});

// And also this
reshape(['name']);

// Nesting
reshape({
    name: {
        first: '@firstname',
        last: '@lastname'
    }
});

// Flattening
reshape({
    firstname: '@name.first',
    lastname: '@name.last'
});

```


### Using

```js

var reshapeUser = reshape(directive);
var reshaped = reshapeUser(user);


```
