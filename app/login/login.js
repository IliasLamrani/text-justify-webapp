const forms = {
    signInForm: document.getElementById('sign-in-form'),
    signUpForm: document.getElementById('sign-up-form')
}

if (sessionStorage.getItem('userToken')) {
    window.location = '/justify';
}

forms.signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const elements = forms.signInForm.elements;
    const token = elements.item(0).value;

    fetch('/api/verify-token', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
    .then(e => {
        if (e.status === 403)
            console.log('Invalid token');
        else {
            console.log('token is valid');
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
        console.log('Success:', data);
        sessionStorage.setItem('userToken', data);
        window.location = '/justify';
    })
})

