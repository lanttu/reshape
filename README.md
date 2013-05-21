reshape
=======

Library for reshaping Javascript objects. Like copying but with
directives. Notation inspired by Angular.

```js

// With reshape you can make this..
{
    name: {
        first: 'John',
        last: 'Doe'
    },
    email: {
        home: 'john@home',
        work: 'john@work'
    },
    address: 'Road 1' // Not needed
}
// ..to this..
{
    name: 'John',
    email: 'john@home'
}

```

to thi

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

// Custom function
reshape({
    fullname: function (user) {
        return user.firstname + ' ' + user.lastname;
    }
});

```


### Usage

```js

var reshapeUser = reshape(directive);
var reshaped = reshapeUser(user);


```
