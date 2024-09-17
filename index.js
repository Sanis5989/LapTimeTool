function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.querySelector('.tab-button.active').classList.remove('active');
    document.querySelector('.tab-button:nth-child(1)').classList.add('active');
}

function showSignUp() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.querySelector('.tab-button.active').classList.remove('active');
    document.querySelector('.tab-button:nth-child(2)').classList.add('active');
}