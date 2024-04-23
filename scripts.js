// Inisialisasi Supabase client
const supabaseUrl = 'https://rpwepsclojymeyjkwoqk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwd2Vwc2Nsb2p5bWV5amt3b3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4NDUyNDQsImV4cCI6MjAyOTQyMTI0NH0.uEbQS0MD_1F2wl-ft-yvxtNEHrgLuLAfURNuNF4zMrE';
const supabase = createClient(supabaseUrl, supabaseKey);

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
            // Redirect to main page after successful login
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        alert('Login failed. Please try again.');
    }
}

// Function to handle form submission
function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
}

// Function to fetch user profile information
async function fetchUserProfile(userId) {
    try {
        const { data, error } = await supabase.from('users').select('username').eq('id', userId).single();
        if (error) {
            console.error('Error fetching user profile:', error.message);
            return null;
        } else {
            return data;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
    }
}

// Function to display user profile information in HTML
async function displayUserProfile(userId) {
    const userProfile = await fetchUserProfile(userId);
    if (userProfile) {
        const profileElement = document.querySelector('.account-profile');
        profileElement.innerHTML = `
            <img src="profile.png" alt="Profile Picture">
            <span>${userProfile.username}</span>
        `;
    }
}

// Function to fetch stories from users followed by the current user
async function fetchStories(userId) {
    try {
        const { data, error } = await supabase
            .from('stories')
            .select('story, user_id')
            .in('user_id', userId);
        if (error) {
            console.error('Error fetching stories:', error.message);
            return [];
        } else {
            return data;
        }
    } catch (error) {
        console.error('Error fetching stories:', error.message);
        return [];
    }
}

// Function to display stories in HTML
async function displayStories(userId) {
    const stories = await fetchStories(userId);
    const storiesContainer = document.querySelector('.stories');
    storiesContainer.innerHTML = ''; // Clear existing content
    stories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.textContent = story.story;
        storiesContainer.appendChild(storyElement);
    });
}

// Function to fetch feed content from followed users
async function fetchFeed(userId) {
    try {
        const { data, error } = await supabase
            .from('feed')
            .select('content, user_id')
            .in('user_id', userId);
        if (error) {
            console.error('Error fetching feed:', error.message);
            return [];
        } else {
            return data;
        }
    } catch (error) {
        console.error('Error fetching feed:', error.message);
        return [];
    }
}

// Function to display feed content in HTML
async function displayFeed(userId) {
    const feed = await fetchFeed(userId);
    const feedContainer = document.querySelector('.feed');
    feedContainer.innerHTML = ''; // Clear existing content
    feed.forEach(post => {
        const postElement = document.createElement('div');
        postElement.textContent = post.content;
        feedContainer.appendChild(postElement);
    });
}

// Fetch and display user profile, stories, and feed when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const userId = 'user_id_here'; // Replace with the actual user ID
    await displayUserProfile(userId);
    await displayStories(userId);
    await displayFeed(userId);
});

// Attach event listener to login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', handleLoginFormSubmit);
