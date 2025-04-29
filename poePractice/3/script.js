const form = document.getElementById('registrationForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    document.getElementById('successMessage').textContent = '';

    let isValid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const age = parseInt(document.getElementById('age').value.trim());
    const gender = document.getElementById('gender').value;
    const terms = document.getElementById('terms').checked;

    // Full Name Validation
    if (fullName === "") {
        document.getElementById('nameError').textContent = "Full Name is required.";
        isValid = false;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = "Enter a valid email address.";
        isValid = false;
    }

    // Password Validation
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = "Password must be at least 8 characters.";
        isValid = false;
    }

    // Confirm Password Validation
    if (confirmPassword !== password) {
        document.getElementById('confirmPasswordError').textContent = "Passwords do not match.";
        isValid = false;
    }

    // Age Validation
    if (isNaN(age) || age < 18 || age > 60) {
        document.getElementById('ageError').textContent = "Age must be between 18 and 60.";
        isValid = false;
    }

    // Gender Validation
    if (gender === "") {
        document.getElementById('genderError').textContent = "Please select your gender.";
        isValid = false;
    }

    // Terms Validation
    if (!terms) {
        document.getElementById('termsError').textContent = "You must accept the Terms and Conditions.";
        isValid = false;
    }

    if (isValid) {
        document.getElementById('successMessage').textContent = "Registration Successful!";
        form.reset();
    }
});
