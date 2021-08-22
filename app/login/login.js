const forms = {
    signInForm: document.getElementById('sign-in-form'),
    signUpForm: document.getElementById('sign-up-form')
}

if (sessionStorage.getItem('userToken')) {
    window.location = '/justify'; //if the user is logged in, send him to the justify text page
}

forms.signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const elements = forms.signInForm.elements;
    const token = elements.item(0).value;
    //check if the given token is linked to an account:
    fetch('/api/verify-token', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
    .then(res => res.json())
    .then(e => {
        if (e.code === 403)
            alert('Invalid token');
        else {
            sessionStorage.setItem('userToken', token);
            window.location = '/justify';
        }
    })
})

forms.signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const elements = forms.signUpForm.elements;
    const body = {
        email: elements.item(0).value,
        password: elements.item(1).value
    }

    fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 400 || data.code === 500) {
            alert('Internal error!');
        } else if (data.code === 303) {
            alert('You already have an account');
        } else {
            console.log('Success:', data);
            sessionStorage.setItem('userToken', data);
            window.location = '/justify';
        }
    })
})

