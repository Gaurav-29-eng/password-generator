const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthInput = document.getElementById('length');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const strengthFill = document.getElementById('strength-fill');
const strengthValue = document.querySelector('.strength-value');
const toast = document.getElementById('toast');

const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function getSelectedCharacters() {
    let chars = '';
    if (uppercaseCheckbox.checked) chars += CHAR_SETS.uppercase;
    if (lowercaseCheckbox.checked) chars += CHAR_SETS.lowercase;
    if (numbersCheckbox.checked) chars += CHAR_SETS.numbers;
    if (symbolsCheckbox.checked) chars += CHAR_SETS.symbols;
    return chars;
}

function generatePassword() {
    const length = parseInt(lengthInput.value);
    const chars = getSelectedCharacters();
    
    if (chars === '') {
        passwordInput.value = '';
        updateStrength('');
        return;
    }
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    
    passwordInput.value = password;
    updateStrength(password);
}

function calculateStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    return score;
}

function updateStrength(password) {
    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthValue.textContent = '-';
        strengthValue.style.color = '#333';
        return;
    }
    
    const score = calculateStrength(password);
    let strength = 'weak';
    let color = '#ef4444';
    let label = 'Weak';
    
    if (score >= 5) {
        strength = 'strong';
        color = '#10b981';
        label = 'Strong';
    } else if (score >= 3) {
        strength = 'medium';
        color = '#f59e0b';
        label = 'Medium';
    }
    
    strengthFill.className = `strength-fill ${strength}`;
    strengthValue.textContent = label;
    strengthValue.style.color = color;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

async function copyToClipboard() {
    if (!passwordInput.value) return;
    
    try {
        await navigator.clipboard.writeText(passwordInput.value);
        showToast('Password copied to clipboard!');
    } catch (err) {
        passwordInput.select();
        document.execCommand('copy');
        showToast('Password copied to clipboard!');
    }
}

lengthSlider.addEventListener('input', () => {
    lengthInput.value = lengthSlider.value;
});

lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value);
    if (value < 4) value = 4;
    if (value > 64) value = 64;
    lengthSlider.value = value;
});

[lengthSlider, lengthInput, uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(el => {
    el.addEventListener('change', generatePassword);
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

generatePassword();
