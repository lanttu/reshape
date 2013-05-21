reshape
=======

Library for reshaping Javascript objects. Like copying but with
directives. Notation inspired by Angular.


## Using

    var reshapeUser = reshape({
        firstname: '@name.first',
        lastname: '@name.last,
        username: '@'
    });

    var user = {
        name: {
            first: 'John',
            last: 'Doe'
        },
        username: 'DoeJohn',
        email: 'john.doe@com',
        ...
    };

    var reshaped = reshapeUser(original);

    expect(reshaped).to.have.property('firstname', 'John');
    expect(reshaped).to.have.property('lastname', 'Doe');
    expect(reshaped).to.have.property('username', 'DoeJohn');
    expect(reshaped).to.not.have.property('email');
