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

// Smiley stamp functionality
let stampMode = false;

function initSmileyStamp() {
    const smileyClickable = document.getElementById('smiley-clickable');
    const homePage = document.getElementById('home');

    if (!smileyClickable || !homePage) return;

    smileyClickable.addEventListener('click', (e) => {
        e.stopPropagation();
        stampMode = !stampMode;

        if (stampMode) {
            homePage.style.cursor = `url('data:image/svg+xml;utf8,<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="%235DCB83"/><path d="M17 22C18.5 19 22 19.2 23 22" stroke="%236451FA" stroke-width="2" stroke-linecap="round"/><path d="M27 22C28.5 19 32 19.2 33 22" stroke="%236451FA" stroke-width="2" stroke-linecap="round"/><path d="M22 28C23 31 27 31 28 28" stroke="%236451FA" stroke-width="2" stroke-linecap="round"/></svg>') 25 25, auto`;
        } else {
            homePage.style.cursor = 'default';
        }
    });

    homePage.addEventListener('click', (e) => {
        if (stampMode && e.target.id !== 'smiley-clickable' && !e.target.closest('#smiley-clickable') && !e.target.closest('.cta-btn')) {
            const stamp = document.createElement('div');
            stamp.className = 'smiley-stamp';
            stamp.style.left = e.clientX + 'px';
            stamp.style.top = e.clientY + 'px';
            stamp.innerHTML = `
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="20" fill="#5DCB83"/>
                    <path d="M17 22C18.5 19 22 19.2 23 22" stroke="#6451FA" stroke-width="2" stroke-linecap="round"/>
                    <path d="M27 22C28.5 19 32 19.2 33 22" stroke="#6451FA" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22 28C23 31 27 31 28 28" stroke="#6451FA" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            homePage.appendChild(stamp);
        }
    });
}

document.addEventListener('DOMContentLoaded', initSmileyStamp);

// Hobbyist archetypes with personality descriptions
const archetypes = {
    indoor_maker_solo_brainy_learn: {
        name: 'The Scholar',
        emoji: '📚',
        description: 'You\'re a curious mind who loves diving deep into knowledge. Solo learning sessions are your happy place.',
        color: '#9747FF'
    },
    indoor_maker_solo_brainy_relax: {
        name: 'The Artist',
        emoji: '🎨',
        description: 'Creative and introspective, you find peace in bringing your imagination to life through your hands.',
        color: '#F786E2'
    },
    indoor_maker_solo_brawny_learn: {
        name: 'The Chef',
        emoji: '👨‍🍳',
        description: 'You love mastering physical crafts and creating tangible results through skill and practice.',
        color: '#FFD966'
    },
    indoor_maker_solo_brawny_relax: {
        name: 'The Zen Maker',
        emoji: '🧘',
        description: 'You find your flow in gentle, mindful activities that connect body and mind.',
        color: '#5DCB83'
    },
    indoor_maker_social_brainy_learn: {
        name: 'The Game Master',
        emoji: '🎲',
        description: 'Strategic and social, you thrive when sharing intellectual challenges with friends.',
        color: '#6451FA'
    },
    indoor_maker_social_brainy_relax: {
        name: 'The Socialite',
        emoji: '🍷',
        description: 'You love bringing people together for creative and cozy experiences.',
        color: '#F971E0'
    },
    indoor_maker_social_brawny_learn: {
        name: 'The Groove Seeker',
        emoji: '💃',
        description: 'Active and energetic, you love learning new physical skills in a social setting.',
        color: '#8987FF'
    },
    indoor_maker_social_brawny_relax: {
        name: 'The Team Player',
        emoji: '🎳',
        description: 'You enjoy casual, active fun with friends—no pressure, just good vibes.',
        color: '#5DCB83'
    },
    outdoor_mover_solo_brainy_learn: {
        name: 'The Explorer',
        emoji: '🔭',
        description: 'Curious about the natural world, you love discovering and observing on your own terms.',
        color: '#6451FA'
    },
    outdoor_mover_solo_brainy_relax: {
        name: 'The Wanderer',
        emoji: '🥾',
        description: 'Fresh air and solitude recharge you. Nature is where you think best.',
        color: '#5DCB83'
    },
    outdoor_mover_solo_brawny_learn: {
        name: 'The Thrill Seeker',
        emoji: '🏔️',
        description: 'You push your limits and love the rush of mastering challenging outdoor activities.',
        color: '#FFD966'
    },
    outdoor_mover_solo_brawny_relax: {
        name: 'The Free Spirit',
        emoji: '🏊',
        description: 'You just want to move your body outside without overthinking it—pure freedom.',
        color: '#5DCB83'
    },
    outdoor_mover_social_brainy_learn: {
        name: 'The Nature Guide',
        emoji: '🌿',
        description: 'You love sharing outdoor adventures and learning from the world around you with others.',
        color: '#9747FF'
    },
    outdoor_mover_social_brainy_relax: {
        name: 'The Sunshine Chaser',
        emoji: '☀️',
        description: 'Good weather, good company, good times—you\'re all about easy outdoor hangs.',
        color: '#FFD966'
    },
    outdoor_mover_social_brawny_learn: {
        name: 'The Competitor',
        emoji: '⚽',
        description: 'Team sports and friendly competition bring out your best energy.',
        color: '#6451FA'
    },
    outdoor_mover_social_brawny_relax: {
        name: 'The Adventure Buddy',
        emoji: '🚴',
        description: 'You love moving outdoors with friends—the more the merrier!',
        color: '#5DCB83'
    }
};

// Hobby database with primary recommendation + alternatives
const hobbies = {
    indoor_maker_solo_brainy_learn: {
        primary: { name: 'Reading', icon: '📖', reason: 'Endless worlds to explore, all from the comfort of your favorite chair' },
        alternatives: ['Programming', 'Writing', 'Chess', 'Puzzles', 'Learning a language']
    },
    indoor_maker_solo_brainy_relax: {
        primary: { name: 'Painting', icon: '🎨', reason: 'Turn your emotions into art—no rules, just expression' },
        alternatives: ['Drawing', 'Crafting', 'Origami', 'Knitting', 'Pottery']
    },
    indoor_maker_solo_brawny_learn: {
        primary: { name: 'Cooking', icon: '🍳', reason: 'Create delicious meals while mastering techniques—tastiest hobby ever' },
        alternatives: ['Baking', 'Woodworking', 'Home Improvement', 'Mixology', 'Candle making']
    },
    indoor_maker_solo_brawny_relax: {
        primary: { name: 'Indoor Gardening', icon: '🪴', reason: 'Nurture plants and watch them grow—living decor you can be proud of' },
        alternatives: ['Yoga at home', 'DIY projects', 'Terrarium building', 'Stretching routines', 'Journaling']
    },
    indoor_maker_social_brainy_learn: {
        primary: { name: 'Escape Rooms', icon: '🔐', reason: 'Solve puzzles under pressure with your crew—ultimate team brain challenge' },
        alternatives: ['Board game nights', 'Book club', 'Trivia nights', 'Murder mystery parties', 'Coding clubs']
    },
    indoor_maker_social_brainy_relax: {
        primary: { name: 'Cooking Classes', icon: '👨‍🍳', reason: 'Learn new recipes while making friends—then eat your creations together' },
        alternatives: ['Arts and crafts groups', 'Wine tasting', 'Pottery classes', 'DIY workshops', 'Game nights']
    },
    indoor_maker_social_brawny_learn: {
        primary: { name: 'Dance Classes', icon: '💃', reason: 'Get moving, learn choreography, and feel the rhythm with others' },
        alternatives: ['Martial arts', 'Indoor rock climbing', 'Pole fitness', 'Acrobatics', 'Parkour']
    },
    indoor_maker_social_brawny_relax: {
        primary: { name: 'Bowling', icon: '🎳', reason: 'Classic fun with friends—strikes, spares, and good conversation' },
        alternatives: ['Group fitness', 'Social dancing', 'Roller skating', 'Ping pong leagues', 'Laser tag']
    },
    outdoor_mover_solo_brainy_learn: {
        primary: { name: 'Birdwatching', icon: '🦅', reason: 'Connect with nature while learning about fascinating creatures in their habitat' },
        alternatives: ['Photography', 'Geocaching', 'Astronomy', 'Foraging', 'Nature sketching']
    },
    outdoor_mover_solo_brainy_relax: {
        primary: { name: 'Hiking', icon: '🥾', reason: 'Clear your mind on the trail—nature\'s best therapy session' },
        alternatives: ['Nature walks', 'Meditation in nature', 'Fishing', 'Beach walking', 'Park visits']
    },
    outdoor_mover_solo_brawny_learn: {
        primary: { name: 'Rock Climbing', icon: '🧗', reason: 'Conquer new heights and build serious strength—every route is a puzzle' },
        alternatives: ['Trail running', 'Mountain biking', 'Skateboarding', 'Surfing', 'Bouldering']
    },
    outdoor_mover_solo_brawny_relax: {
        primary: { name: 'Swimming', icon: '🏊', reason: 'Float your worries away—refreshing, freeing, and feels amazing' },
        alternatives: ['Walking', 'Jogging', 'Kayaking', 'Stand-up paddleboarding', 'Cycling']
    },
    outdoor_mover_social_brainy_learn: {
        primary: { name: 'Photography Walks', icon: '📸', reason: 'Capture beautiful moments while exploring with fellow photographers' },
        alternatives: ['Group hiking', 'Nature tours', 'Outdoor workshops', 'Community gardens', 'Bird watching groups']
    },
    outdoor_mover_social_brainy_relax: {
        primary: { name: 'Picnics', icon: '🧺', reason: 'Good food, great company, beautiful setting—simple pleasures done right' },
        alternatives: ['Beach days', 'Park gatherings', 'Outdoor concerts', 'Farmers markets', 'Frisbee in the park']
    },
    outdoor_mover_social_brawny_learn: {
        primary: { name: 'Soccer', icon: '⚽', reason: 'Classic team sport that gets your heart pumping and builds camaraderie' },
        alternatives: ['Ultimate frisbee', 'Volleyball', 'Basketball', 'Flag football', 'Softball']
    },
    outdoor_mover_social_brawny_relax: {
        primary: { name: 'Cycling Groups', icon: '🚴', reason: 'Ride together, chat while you pedal, and explore new routes' },
        alternatives: ['Walking groups', 'Paddleboarding', 'Group swims', 'Casual sports leagues', 'Outdoor yoga']
    }
};

function startQuiz() {
    showPage('question1');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    history.push(pageId);

    // Setup location input listener when question6 is shown
    if (pageId === 'question6') {
        setTimeout(() => {
            const cityInput = document.getElementById('cityInput');
            if (cityInput) {
                // Remove any existing listener to prevent duplicates
                cityInput.removeEventListener('keypress', handleLocationEnter);
                cityInput.addEventListener('keypress', handleLocationEnter);
                // Focus the input
                cityInput.focus();
            }
        }, 100);
    }
}

function handleLocationEnter(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const cityInput = document.getElementById('cityInput');
        if (cityInput && cityInput.value.trim()) {
            userAnswers.location = cityInput.value.trim();
            showResults();
        }
    }
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


function showResults() {
    try {
        // Generate hobby profile based on answers
        const profile = generateProfile();
        const archetype = archetypes[profile];
        const hobbyData = hobbies[profile];

        console.log('Profile:', profile);
        console.log('Archetype:', archetype);
        console.log('Hobby Data:', hobbyData);

        // Display archetype
        const typeDiv = document.getElementById('hobbyistType');
        typeDiv.innerHTML = `
            <div class="archetype-card" style="background: ${archetype.color};">
                <div class="archetype-emoji">${archetype.emoji}</div>
                <h1 class="archetype-name">You're ${archetype.name}</h1>
                <p class="archetype-description">${archetype.description}</p>
                <svg class="results-smiley" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="38" fill="#5DCB83"/>
                    <path d="M27 36C29.5 31 35 31.3 37 36" stroke="#6451FA" stroke-width="3.5" stroke-linecap="round"/>
                    <path d="M43 36C45.5 31 51 31.3 53 36" stroke="#6451FA" stroke-width="3.5" stroke-linecap="round"/>
                    <path d="M36 47C37.5 52 42.5 52 44 47" stroke="#6451FA" stroke-width="3.5" stroke-linecap="round"/>
                </svg>
            </div>
        `;

        // Display primary hobby recommendation
        const primaryDiv = document.getElementById('primaryHobby');
        primaryDiv.innerHTML = `
            <div class="primary-hobby-section">
                <h2 class="section-title">Your Perfect Match</h2>
                <div class="primary-hobby-card">
                    <div class="hobby-icon-large">${hobbyData.primary.icon}</div>
                    <h3 class="primary-hobby-name">${hobbyData.primary.name}</h3>
                    <p class="primary-hobby-reason">${hobbyData.primary.reason}</p>
                    ${userAnswers.location ? `
                        <p class="hobby-location">📍 Near ${userAnswers.location}</p>
                    ` : ''}
                </div>
            </div>
        `;

        // Display alternative hobbies
        const alternativesDiv = document.getElementById('otherOptions');
        alternativesDiv.innerHTML = `
            <div class="alternatives-section">
                <h2 class="section-title">Not quite right? Try these instead</h2>
                <div class="alternatives-grid">
                    ${hobbyData.alternatives.map(hobby => `
                        <div class="alternative-card">${hobby}</div>
                    `).join('')}
                </div>
            </div>
        `;

        showPage('results');
    } catch (error) {
        console.error('Error in showResults:', error);
        alert('Error loading results: ' + error.message);
    }
}

function generateProfile() {
    // Build profile string based on answers
    let profile = [];

    // Question 1: Indoor/Outdoor
    if (userAnswers.question1 === 'indoor') {
        profile.push('indoor');
    } else if (userAnswers.question1 === 'outdoor') {
        profile.push('outdoor');
    } else {
        profile.push('indoor'); // Default for 'both'
    }

    // Question 2: Maker/Mover
    // If outdoor, use mover logic; if indoor, use maker logic
    if (profile[0] === 'outdoor') {
        // Outdoor is always with mover
        profile.push('mover');
    } else {
        // Indoor is always with maker
        profile.push('maker');
    }

    // Question 3: Solo/Social
    if (userAnswers.question3 === 'solo') {
        profile.push('solo');
    } else if (userAnswers.question3 === 'social') {
        profile.push('social');
    } else {
        profile.push('solo'); // Default for 'both'
    }

    // Question 4: Brainy/Brawny
    if (userAnswers.question4 === 'brainy') {
        profile.push('brainy');
    } else if (userAnswers.question4 === 'brawny') {
        profile.push('brawny');
    } else {
        profile.push('brainy'); // Default for 'both'
    }

    // Question 5: Learn/Relax
    if (userAnswers.question5 === 'learn') {
        profile.push('learn');
    } else if (userAnswers.question5 === 'relax') {
        profile.push('relax');
    } else {
        profile.push('relax'); // Default for 'both'
    }

    const finalProfile = profile.join('_');
    console.log('Generated profile:', finalProfile);
    console.log('User answers:', userAnswers);
    return finalProfile;
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
