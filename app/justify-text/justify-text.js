const userToken = sessionStorage.getItem('userToken');
if (userToken === undefined || userToken === null)
    window.location = '/'

const input = document.getElementById('user-input-form');
input.addEventListener('submit', e => {
    e.preventDefault();
    const textToJustify = document.getElementById('input-text-area').value;

    fetch('/api/justify', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'text/plain' 
        },
        body: textToJustify
    })
    .then(response => response.text())
    .then(text => document.getElementById('output-text-area').value = text);
    
})

document.getElementById('logout-button').addEventListener('click', e => {
    sessionStorage.removeItem('userToken');
    window.location = '/';
})