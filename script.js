// Store user answers
let userAnswers = {
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
    location: null
};

let currentQuestion = 0;
let history = ['home'];

// Hobby database based on preferences
const hobbies = {
    indoor_maker_solo_brainy_learn: ['Reading', 'Programming', 'Writing', 'Chess', 'Puzzles'],
    indoor_maker_solo_brainy_relax: ['Painting', 'Drawing', 'Crafting', 'Origami', 'Knitting'],
    indoor_maker_solo_brawny_learn: ['Cooking', 'Baking', 'Woodworking', 'Home Improvement'],
    indoor_maker_solo_brawny_relax: ['Yoga at home', 'Indoor gardening', 'DIY projects'],
    indoor_maker_social_brainy_learn: ['Book club', 'Board game nights', 'Escape rooms', 'Trivia nights'],
    indoor_maker_social_brainy_relax: ['Arts and crafts groups', 'Cooking classes', 'Wine tasting'],
    indoor_maker_social_brawny_learn: ['Dance classes', 'Martial arts', 'Indoor rock climbing'],
    indoor_maker_social_brawny_relax: ['Group fitness', 'Social dancing', 'Bowling'],

    outdoor_mover_solo_brainy_learn: ['Birdwatching', 'Photography', 'Geocaching', 'Astronomy'],
    outdoor_mover_solo_brainy_relax: ['Hiking', 'Nature walks', 'Meditation in nature', 'Fishing'],
    outdoor_mover_solo_brawny_learn: ['Trail running', 'Mountain biking', 'Rock climbing', 'Skateboarding'],
    outdoor_mover_solo_brawny_relax: ['Walking', 'Jogging', 'Swimming', 'Kayaking'],
    outdoor_mover_social_brainy_learn: ['Group hiking', 'Photography clubs', 'Nature tours'],
    outdoor_mover_social_brainy_relax: ['Picnics', 'Beach days', 'Park gatherings', 'Outdoor concerts'],
    outdoor_mover_social_brawny_learn: ['Team sports', 'Ultimate frisbee', 'Volleyball', 'Soccer'],
    outdoor_mover_social_brawny_relax: ['Walking groups', 'Cycling clubs', 'Paddleboarding', 'Group swims']
};

function startQuiz() {
    showPage('question1');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    history.push(pageId);
}

function goBack() {
    if (history.length > 1) {
        history.pop(); // Remove current page
        const previousPage = history[history.length - 1];
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(previousPage).classList.add('active');
    }
}

function selectAnswer(questionNum, answer) {
    userAnswers[`question${questionNum}`] = answer;

    // Add selected class for animation
    const currentPage = document.getElementById(`question${questionNum}`);
    const clickedOption = event.currentTarget;
    clickedOption.classList.add('selected');

    // Navigate to next question after animation
    setTimeout(() => {
        if (questionNum < 6) {
            showPage(`question${questionNum + 1}`);
        } else {
            showResults();
        }
        clickedOption.classList.remove('selected');
    }, 600);
}

function skipLocation() {
    userAnswers.location = null;
    showResults();
}

// Handle location input
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                userAnswers.location = cityInput.value;
                showResults();
            }
        });
    }
});

function showResults() {
    // Generate hobby profile based on answers
    const profile = generateProfile();
    const recommendedHobbies = getHobbies(profile);

    // Display results
    const resultsDiv = document.getElementById('hobbyResults');
    resultsDiv.innerHTML = `
        <div class="hobby-item">
            <h3>Your Hobby Profile: ${profile.toUpperCase().replace(/_/g, ' ')}</h3>
        </div>
        <div class="hobby-item">
            <h3>Recommended Hobbies:</h3>
            <ul style="list-style: none; padding: 0;">
                ${recommendedHobbies.map(hobby => `<li style="padding: 0.5rem 0;">🎯 ${hobby}</li>`).join('')}
            </ul>
        </div>
        ${userAnswers.location ? `
            <div class="hobby-item">
                <p>📍 Looking for activities near: <strong>${userAnswers.location}</strong></p>
            </div>
        ` : ''}
    `;

    showPage('results');
}

function generateProfile() {
    // Build profile string based on answers
    let profile = [];

    // Question 1: Indoor/Outdoor
    if (userAnswers.question1 === 'indoor') profile.push('indoor');
    else if (userAnswers.question1 === 'outdoor') profile.push('outdoor');
    else profile.push('indoor'); // Default for 'both'

    // Question 2: Maker/Mover
    if (userAnswers.question2 === 'maker') profile.push('maker');
    else if (userAnswers.question2 === 'mover') profile.push('mover');
    else profile.push('maker'); // Default for 'both'

    // Question 3: Solo/Social
    if (userAnswers.question3 === 'solo') profile.push('solo');
    else if (userAnswers.question3 === 'social') profile.push('social');
    else profile.push('solo'); // Default for 'both'

    // Question 4: Brainy/Brawny
    if (userAnswers.question4 === 'brainy') profile.push('brainy');
    else if (userAnswers.question4 === 'brawny') profile.push('brawny');
    else profile.push('brainy'); // Default for 'both'

    // Question 5: Learn/Relax
    if (userAnswers.question5 === 'learn') profile.push('learn');
    else if (userAnswers.question5 === 'relax') profile.push('relax');
    else profile.push('relax'); // Default for 'both'

    return profile.join('_');
}

function getHobbies(profile) {
    // Find matching hobbies from database
    if (hobbies[profile]) {
        return hobbies[profile];
    }

    // If exact match not found, return general suggestions
    return ['Exploring new activities', 'Trying different hobbies', 'Joining local clubs'];
}

function restartQuiz() {
    userAnswers = {
        question1: null,
        question2: null,
        question3: null,
        question4: null,
        question5: null,
        location: null
    };
    history = [];
    document.getElementById('cityInput').value = '';
    showPage('home');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goBack();
    }
});
