// Function to handle registration
async function register(username, email, password) {
    try {
        const { user, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            console.error('Error registering user:', error.message);
            alert('Registration failed. Please try again.');
        } else {
            // Save additional user information to users table
            await supabase
                .from('users')
                .insert([{ username, email, password }]);
            console.log('User registration successful:', user);
            alert('Registration successful. You can now login.');
            window.location.href = 'loginpage.html'; // Redirect to login page
        }
    } catch (error) {
        console.error('Error registering user:', error.message);
        alert('Registration failed. Please try again.');
    }
}

// Function to handle login
async function login(username, password) {
    try {
        const { user, error } = await supabase.auth.signIn({
            email: username, // Assuming username can be an email
            password
        });
        if (error) {
            console.error('Error logging in:', error.message);
            alert('Login failed. Please try again.');
        } else {
            console.log('Login successful:', user);
            window.location.href = 'index.html'; // Redirect to main page after successful login
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        alert('Login failed. Please try again.');
    }
}

// Function to handle registration form submission
function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    register(username, email, password);
}

// Function to handle login form submission
function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
}

// Attach event listener to register form submission
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', handleRegisterFormSubmit);

// Attach event listener to login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', handleLoginFormSubmit);
