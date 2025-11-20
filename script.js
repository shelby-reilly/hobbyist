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
    },
    // Indoor + Mover archetypes
    indoor_mover_solo_brainy_learn: {
        name: 'The Movement Scholar',
        emoji: '💃',
        description: 'You learn best through movement and love mastering new physical techniques solo.',
        color: '#9747FF'
    },
    indoor_mover_solo_brainy_relax: {
        name: 'The Flow Finder',
        emoji: '🧘',
        description: 'You seek peace through mindful movement, finding clarity in every breath and stretch.',
        color: '#F786E2'
    },
    indoor_mover_solo_brawny_learn: {
        name: 'The Strength Builder',
        emoji: '🏋️',
        description: 'You\'re all about pushing your physical limits and building power through dedication.',
        color: '#FFD966'
    },
    indoor_mover_solo_brawny_relax: {
        name: 'The Water Spirit',
        emoji: '🏊',
        description: 'You find freedom in physical activity without pressure—just movement and joy.',
        color: '#5DCB83'
    },
    indoor_mover_social_brainy_learn: {
        name: 'The Rhythm Master',
        emoji: '💃',
        description: 'You love learning choreography and movement with others who share your passion.',
        color: '#6451FA'
    },
    indoor_mover_social_brainy_relax: {
        name: 'The Group Energizer',
        emoji: '🤸',
        description: 'You bring people together for fun, casual movement—vibes over perfection.',
        color: '#F971E0'
    },
    indoor_mover_social_brawny_learn: {
        name: 'The Physical Collaborator',
        emoji: '💃',
        description: 'You thrive learning physical skills in a group setting with supportive energy.',
        color: '#8987FF'
    },
    indoor_mover_social_brawny_relax: {
        name: 'The Social Athlete',
        emoji: '🎳',
        description: 'Casual, active fun with friends is your sweet spot—no stress, all smiles.',
        color: '#5DCB83'
    },
    // Outdoor + Maker archetypes
    outdoor_maker_solo_brainy_learn: {
        name: 'The Nature Cultivator',
        emoji: '🌱',
        description: 'You love learning about nature while creating with your hands in the great outdoors.',
        color: '#9747FF'
    },
    outdoor_maker_solo_brainy_relax: {
        name: 'The Outdoor Creator',
        emoji: '📸',
        description: 'You capture and create beauty in nature at your own peaceful, contemplative pace.',
        color: '#F786E2'
    },
    outdoor_maker_solo_brawny_learn: {
        name: 'The Outdoor Craftsman',
        emoji: '🪚',
        description: 'You build, craft, and create tangible things with your hands in fresh air.',
        color: '#FFD966'
    },
    outdoor_maker_solo_brawny_relax: {
        name: 'The Garden Soul',
        emoji: '🌱',
        description: 'You find peace getting your hands dirty and nurturing growth outdoors.',
        color: '#5DCB83'
    },
    outdoor_maker_social_brainy_learn: {
        name: 'The Community Grower',
        emoji: '🌻',
        description: 'You love learning and creating outdoors while building community connections.',
        color: '#6451FA'
    },
    outdoor_maker_social_brainy_relax: {
        name: 'The Outdoor Host',
        emoji: '🧺',
        description: 'You bring people together in beautiful outdoor settings for shared experiences.',
        color: '#F971E0'
    },
    outdoor_maker_social_brawny_learn: {
        name: 'The Outdoor Builder',
        emoji: '🔨',
        description: 'You love hands-on outdoor projects with a crew—building things and friendships.',
        color: '#8987FF'
    },
    outdoor_maker_social_brawny_relax: {
        name: 'The Beach Bum',
        emoji: '🏖️',
        description: 'You\'re all about easy, breezy outdoor hangs with friends—maximum chill.',
        color: '#5DCB83'
    }
};

// Hobby database with primary recommendation + alternatives
const hobbies = {
    indoor_maker_solo_brainy_learn: {
        primary: {
            name: 'Reading',
            icon: '📖',
            reason: 'Endless worlds to explore, all from the comfort of your favorite chair',
            emojis: ['📚', '📖'],
            resources: [
                { type: 'instagram', name: '@nytbooks', link: 'https://instagram.com/nytbooks' },
                { type: 'video', name: 'how to read more books', link: 'https://youtube.com/results?search_query=how+to+read+more+books+tips' }
            ]
        },
        alternatives: ['Programming', 'Writing', 'Chess', 'Puzzles', 'Learning a language']
    },
    indoor_maker_solo_brainy_relax: {
        primary: {
            name: 'Painting',
            icon: '🎨',
            reason: 'Turn your emotions into art—no rules, just expression',
            emojis: ['🎨', '🖌️'],
            resources: [
                { type: 'instagram', name: '@skillshare', link: 'https://instagram.com/skillshare' },
                { type: 'video', name: 'beginner painting tutorial', link: 'https://youtube.com/results?search_query=beginner+acrylic+painting+tutorial' }
            ]
        },
        alternatives: ['Drawing', 'Crafting', 'Origami', 'Knitting', 'Pottery']
    },
    indoor_maker_solo_brawny_learn: {
        primary: {
            name: 'Cooking',
            icon: '🍳',
            reason: 'Create delicious meals while mastering techniques—tastiest hobby ever',
            emojis: ['🍳', '🔪'],
            resources: [
                { type: 'instagram', name: '@bonappetitmag', link: 'https://instagram.com/bonappetitmag' },
                { type: 'video', name: 'cooking basics for beginners', link: 'https://youtube.com/results?search_query=cooking+basics+for+beginners+joshua+weissman' }
            ]
        },
        alternatives: ['Baking', 'Woodworking', 'Home Improvement', 'Mixology', 'Candle making']
    },
    indoor_maker_solo_brawny_relax: {
        primary: {
            name: 'Indoor Gardening',
            icon: '🪴',
            reason: 'Nurture plants and watch them grow—living decor you can be proud of',
            emojis: ['🪴', '🌿'],
            resources: [
                { type: 'instagram', name: '@thesill', link: 'https://instagram.com/thesill' },
                { type: 'video', name: 'houseplant care for beginners', link: 'https://youtube.com/results?search_query=houseplant+care+for+beginners' }
            ]
        },
        alternatives: ['Yoga at home', 'DIY projects', 'Terrarium building', 'Stretching routines', 'Journaling']
    },
    indoor_maker_social_brainy_learn: {
        primary: {
            name: 'Escape Rooms',
            icon: '🔐',
            reason: 'Solve puzzles under pressure with your crew—ultimate team brain challenge',
            emojis: ['🔐', '🧩'],
            resources: [
                { type: 'instagram', name: '@escaperoomtips', link: 'https://instagram.com/theescapegame' },
                { type: 'video', name: 'escape room strategies', link: 'https://youtube.com/results?search_query=escape+room+tips+and+tricks' }
            ]
        },
        alternatives: ['Board game nights', 'Book club', 'Trivia nights', 'Murder mystery parties', 'Coding clubs']
    },
    indoor_maker_social_brainy_relax: {
        primary: {
            name: 'Cooking Classes',
            icon: '👨‍🍳',
            reason: 'Learn new recipes while making friends—then eat your creations together',
            emojis: ['👨‍🍳', '🍴'],
            resources: [
                { type: 'instagram', name: '@tasty', link: 'https://instagram.com/tasty' },
                { type: 'video', name: 'group cooking ideas', link: 'https://youtube.com/results?search_query=easy+recipes+to+cook+with+friends' }
            ]
        },
        alternatives: ['Arts and crafts groups', 'Wine tasting', 'Pottery classes', 'DIY workshops', 'Game nights']
    },
    indoor_maker_social_brawny_learn: {
        primary: {
            name: 'Dance Classes',
            icon: '💃',
            reason: 'Get moving, learn choreography, and feel the rhythm with others',
            emojis: ['💃', '🕺'],
            resources: [
                { type: 'instagram', name: '@steeloaksocial', link: 'https://instagram.com/steezyco' },
                { type: 'video', name: 'beginner dance tutorial', link: 'https://youtube.com/results?search_query=beginner+dance+tutorial+steezy' }
            ]
        },
        alternatives: ['Martial arts', 'Indoor rock climbing', 'Pole fitness', 'Acrobatics', 'Parkour']
    },
    indoor_maker_social_brawny_relax: {
        primary: {
            name: 'Bowling',
            icon: '🎳',
            reason: 'Classic fun with friends—strikes, spares, and good conversation',
            emojis: ['🎳', '🎯'],
            resources: [
                { type: 'instagram', name: '@paborevolution', link: 'https://instagram.com/paborevolution' },
                { type: 'video', name: 'bowling tips for beginners', link: 'https://youtube.com/results?search_query=bowling+tips+for+beginners+brad+and+kyle' }
            ]
        },
        alternatives: ['Group fitness', 'Social dancing', 'Roller skating', 'Ping pong leagues', 'Laser tag']
    },
    outdoor_mover_solo_brainy_learn: {
        primary: {
            name: 'Birdwatching',
            icon: '🦅',
            reason: 'Connect with nature while learning about fascinating creatures in their habitat',
            emojis: ['🦅', '🔭'],
            resources: [
                { type: 'instagram', name: '@auabornsociety', link: 'https://instagram.com/audubonsociety' },
                { type: 'video', name: 'birdwatching for beginners', link: 'https://youtube.com/results?search_query=birdwatching+for+beginners+guide' }
            ]
        },
        alternatives: ['Photography', 'Geocaching', 'Astronomy', 'Foraging', 'Nature sketching']
    },
    outdoor_mover_solo_brainy_relax: {
        primary: {
            name: 'Hiking',
            icon: '🥾',
            reason: 'Clear your mind on the trail—nature\'s best therapy session',
            emojis: ['🥾', '⛰️'],
            resources: [
                { type: 'instagram', name: '@rei', link: 'https://instagram.com/rei' },
                { type: 'video', name: 'hiking for beginners', link: 'https://youtube.com/results?search_query=hiking+for+beginners+rei' }
            ]
        },
        alternatives: ['Nature walks', 'Meditation in nature', 'Fishing', 'Beach walking', 'Park visits']
    },
    outdoor_mover_solo_brawny_learn: {
        primary: {
            name: 'Rock Climbing',
            icon: '🧗',
            reason: 'Conquer new heights and build serious strength—every route is a puzzle',
            emojis: ['🧗', '⛰️'],
            resources: [
                { type: 'instagram', name: '@climbingmagazine', link: 'https://instagram.com/climbingmagazine' },
                { type: 'video', name: 'rock climbing for beginners', link: 'https://youtube.com/results?search_query=rock+climbing+for+beginners+technique' }
            ]
        },
        alternatives: ['Trail running', 'Mountain biking', 'Skateboarding', 'Surfing', 'Bouldering']
    },
    outdoor_mover_solo_brawny_relax: {
        primary: {
            name: 'Swimming',
            icon: '🏊',
            reason: 'Float your worries away—refreshing, freeing, and feels amazing',
            emojis: ['🏊', '🌊'],
            resources: [
                { type: 'instagram', name: '@usaswimming', link: 'https://instagram.com/usaswimming' },
                { type: 'video', name: 'swimming for beginners', link: 'https://youtube.com/results?search_query=learn+to+swim+adults+beginners' }
            ]
        },
        alternatives: ['Walking', 'Jogging', 'Kayaking', 'Stand-up paddleboarding', 'Cycling']
    },
    outdoor_mover_social_brainy_learn: {
        primary: {
            name: 'Photography Walks',
            icon: '📸',
            reason: 'Capture beautiful moments while exploring with fellow photographers',
            emojis: ['📸', '📷'],
            resources: [
                { type: 'instagram', name: '@natgeo', link: 'https://instagram.com/natgeo' },
                { type: 'video', name: 'photography basics', link: 'https://youtube.com/results?search_query=street+photography+for+beginners' }
            ]
        },
        alternatives: ['Group hiking', 'Nature tours', 'Outdoor workshops', 'Community gardens', 'Bird watching groups']
    },
    outdoor_mover_social_brainy_relax: {
        primary: {
            name: 'Picnics',
            icon: '🧺',
            reason: 'Good food, great company, beautiful setting—simple pleasures done right',
            emojis: ['🧺', '🌳'],
            resources: [
                { type: 'instagram', name: '@countryliving', link: 'https://instagram.com/countryliving' },
                { type: 'video', name: 'picnic planning ideas', link: 'https://youtube.com/results?search_query=aesthetic+picnic+ideas+setup' }
            ]
        },
        alternatives: ['Beach days', 'Park gatherings', 'Outdoor concerts', 'Farmers markets', 'Frisbee in the park']
    },
    outdoor_mover_social_brawny_learn: {
        primary: {
            name: 'Soccer',
            icon: '⚽',
            reason: 'Classic team sport that gets your heart pumping and builds camaraderie',
            emojis: ['⚽', '🥅'],
            resources: [
                { type: 'instagram', name: '@433', link: 'https://instagram.com/433' },
                { type: 'video', name: 'soccer skills for beginners', link: 'https://youtube.com/results?search_query=soccer+skills+for+beginners' }
            ]
        },
        alternatives: ['Ultimate frisbee', 'Volleyball', 'Basketball', 'Flag football', 'Softball']
    },
    outdoor_mover_social_brawny_relax: {
        primary: {
            name: 'Cycling Groups',
            icon: '🚴',
            reason: 'Ride together, chat while you pedal, and explore new routes',
            emojis: ['🚴', '🚲'],
            resources: [
                { type: 'instagram', name: '@gcabornsociety', link: 'https://instagram.com/gcn' },
                { type: 'video', name: 'cycling for beginners', link: 'https://youtube.com/results?search_query=cycling+for+beginners+gcn' }
            ]
        },
        alternatives: ['Walking groups', 'Paddleboarding', 'Group swims', 'Casual sports leagues', 'Outdoor yoga']
    },
    // Indoor + Mover combinations
    indoor_mover_solo_brainy_learn: {
        primary: {
            name: 'Dance Classes',
            icon: '💃',
            reason: 'Get moving, learn choreography, and feel the rhythm',
            emojis: ['💃', '🕺'],
            resources: [
                { type: 'instagram', name: '@steezyco', link: 'https://instagram.com/steezyco' },
                { type: 'video', name: 'dance tutorials', link: 'https://youtube.com/results?search_query=learn+to+dance+at+home+beginner' }
            ]
        },
        alternatives: ['Indoor rock climbing', 'Martial arts', 'Parkour', 'Gymnastics', 'Boxing']
    },
    indoor_mover_solo_brainy_relax: {
        primary: {
            name: 'Yoga',
            icon: '🧘',
            reason: 'Find your flow and inner peace through mindful movement',
            emojis: ['🧘', '🕉️'],
            resources: [
                { type: 'instagram', name: '@yogawithadriene', link: 'https://instagram.com/yogawithadriene' },
                { type: 'video', name: 'yoga for beginners', link: 'https://youtube.com/results?search_query=yoga+with+adriene+beginners' }
            ]
        },
        alternatives: ['Stretching', 'Pilates', 'Tai chi', 'Meditation', 'Breathwork']
    },
    indoor_mover_solo_brawny_learn: {
        primary: {
            name: 'Weightlifting',
            icon: '🏋️',
            reason: 'Build strength and discipline one rep at a time',
            emojis: ['🏋️', '💪'],
            resources: [
                { type: 'instagram', name: '@jeffnippard', link: 'https://instagram.com/jeffnippard' },
                { type: 'video', name: 'weightlifting for beginners', link: 'https://youtube.com/results?search_query=weightlifting+for+beginners+jeff+nippard' }
            ]
        },
        alternatives: ['Calisthenics', 'CrossFit', 'Powerlifting', 'Bodybuilding', 'Kettlebells']
    },
    indoor_mover_solo_brawny_relax: {
        primary: {
            name: 'Swimming',
            icon: '🏊',
            reason: 'Float your worries away—refreshing, freeing, and feels amazing',
            emojis: ['🏊', '🌊'],
            resources: [
                { type: 'instagram', name: '@usaswimming', link: 'https://instagram.com/usaswimming' },
                { type: 'video', name: 'learn to swim', link: 'https://youtube.com/results?search_query=learn+to+swim+adults+beginners' }
            ]
        },
        alternatives: ['Aqua aerobics', 'Water walking', 'Floating', 'Hot tub sessions', 'Sauna']
    },
    indoor_mover_social_brainy_learn: {
        primary: {
            name: 'Dance Classes',
            icon: '💃',
            reason: 'Get moving, learn choreography, and feel the rhythm with others',
            emojis: ['💃', '🕺'],
            resources: [
                { type: 'instagram', name: '@steezyco', link: 'https://instagram.com/steezyco' },
                { type: 'video', name: 'group dance tutorials', link: 'https://youtube.com/results?search_query=beginner+dance+class+tutorial' }
            ]
        },
        alternatives: ['Martial arts', 'Indoor rock climbing', 'Pole fitness', 'Acrobatics', 'Parkour']
    },
    indoor_mover_social_brainy_relax: {
        primary: {
            name: 'Group Fitness',
            icon: '🤸',
            reason: 'Casual workout vibes with friends—fun over perfection',
            emojis: ['🤸', '💪'],
            resources: [
                { type: 'instagram', name: '@popsugarfitness', link: 'https://instagram.com/popsugarfitness' },
                { type: 'video', name: 'fun group workouts', link: 'https://youtube.com/results?search_query=fun+group+workout+class' }
            ]
        },
        alternatives: ['Zumba', 'Spin class', 'Barre', 'Yoga class', 'Dance cardio']
    },
    indoor_mover_social_brawny_learn: {
        primary: {
            name: 'Dance Classes',
            icon: '💃',
            reason: 'Get moving, learn choreography, and feel the rhythm with others',
            emojis: ['💃', '🕺'],
            resources: [
                { type: 'instagram', name: '@steezyco', link: 'https://instagram.com/steezyco' },
                { type: 'video', name: 'dance class tutorial', link: 'https://youtube.com/results?search_query=hip+hop+dance+class+beginner' }
            ]
        },
        alternatives: ['Martial arts', 'Indoor rock climbing', 'Pole fitness', 'Acrobatics', 'Parkour']
    },
    indoor_mover_social_brawny_relax: {
        primary: {
            name: 'Bowling',
            icon: '🎳',
            reason: 'Classic fun with friends—strikes, spares, and good conversation',
            emojis: ['🎳', '🎯'],
            resources: [
                { type: 'instagram', name: '@paborevolution', link: 'https://instagram.com/paborevolution' },
                { type: 'video', name: 'bowling tips', link: 'https://youtube.com/results?search_query=bowling+tips+for+beginners+brad+and+kyle' }
            ]
        },
        alternatives: ['Group fitness', 'Social dancing', 'Roller skating', 'Ping pong leagues', 'Laser tag']
    },
    // Outdoor + Maker combinations
    outdoor_maker_solo_brainy_learn: {
        primary: {
            name: 'Gardening',
            icon: '🌱',
            reason: 'Cultivate your own little paradise and learn about nature',
            emojis: ['🌱', '🌻'],
            resources: [
                { type: 'instagram', name: '@gardeners', link: 'https://instagram.com/gardeners' },
                { type: 'video', name: 'gardening for beginners', link: 'https://youtube.com/results?search_query=gardening+for+beginners+epic+gardening' }
            ]
        },
        alternatives: ['Nature journaling', 'Outdoor sketching', 'Plant identification', 'Birdhouse building', 'Composting']
    },
    outdoor_maker_solo_brainy_relax: {
        primary: {
            name: 'Nature Photography',
            icon: '📸',
            reason: 'Capture the beauty around you at your own peaceful pace',
            emojis: ['📸', '🌿'],
            resources: [
                { type: 'instagram', name: '@natgeo', link: 'https://instagram.com/natgeo' },
                { type: 'video', name: 'nature photography tips', link: 'https://youtube.com/results?search_query=nature+photography+for+beginners' }
            ]
        },
        alternatives: ['Outdoor painting', 'Nature walks', 'Sunset watching', 'Stargazing', 'Beach combing']
    },
    outdoor_maker_solo_brawny_learn: {
        primary: {
            name: 'Outdoor Woodworking',
            icon: '🪚',
            reason: 'Build things with your hands in the fresh air',
            emojis: ['🪚', '🪵'],
            resources: [
                { type: 'instagram', name: '@woodworking_art', link: 'https://instagram.com/woodworking_art' },
                { type: 'video', name: 'beginner woodworking', link: 'https://youtube.com/results?search_query=woodworking+for+beginners+steve+ramsey' }
            ]
        },
        alternatives: ['Gardening', 'Trail building', 'Campfire cooking', 'Bushcraft', 'Stone carving']
    },
    outdoor_maker_solo_brawny_relax: {
        primary: {
            name: 'Gardening',
            icon: '🌱',
            reason: 'Get your hands dirty and watch your garden grow',
            emojis: ['🌱', '🌻'],
            resources: [
                { type: 'instagram', name: '@gardeners', link: 'https://instagram.com/gardeners' },
                { type: 'video', name: 'relaxing gardening tips', link: 'https://youtube.com/results?search_query=relaxing+garden+tour' }
            ]
        },
        alternatives: ['Outdoor yoga', 'Hammocking', 'Beach walking', 'Park visits', 'Nature meditation']
    },
    outdoor_maker_social_brainy_learn: {
        primary: {
            name: 'Community Gardening',
            icon: '🌻',
            reason: 'Grow food and friendships in a shared green space',
            emojis: ['🌻', '🥕'],
            resources: [
                { type: 'instagram', name: '@gardeners', link: 'https://instagram.com/gardeners' },
                { type: 'video', name: 'community garden tips', link: 'https://youtube.com/results?search_query=how+to+start+community+garden' }
            ]
        },
        alternatives: ['Photography walks', 'Outdoor art classes', 'Nature tours', 'Outdoor workshops', 'Bird watching groups']
    },
    outdoor_maker_social_brainy_relax: {
        primary: {
            name: 'Picnics',
            icon: '🧺',
            reason: 'Good food, great company, beautiful setting—simple pleasures done right',
            emojis: ['🧺', '🌳'],
            resources: [
                { type: 'instagram', name: '@countryliving', link: 'https://instagram.com/countryliving' },
                { type: 'video', name: 'picnic ideas', link: 'https://youtube.com/results?search_query=aesthetic+picnic+ideas+setup' }
            ]
        },
        alternatives: ['Beach days', 'Park gatherings', 'Outdoor concerts', 'Farmers markets', 'Outdoor dining']
    },
    outdoor_maker_social_brawny_learn: {
        primary: {
            name: 'Outdoor DIY Projects',
            icon: '🔨',
            reason: 'Build cool stuff outside with your crew',
            emojis: ['🔨', '🪚'],
            resources: [
                { type: 'instagram', name: '@dikiykurabiye', link: 'https://instagram.com/diynetwork' },
                { type: 'video', name: 'outdoor DIY projects', link: 'https://youtube.com/results?search_query=easy+outdoor+diy+projects' }
            ]
        },
        alternatives: ['Community gardens', 'Trail maintenance', 'Beach cleanups', 'Park improvement', 'Outdoor building']
    },
    outdoor_maker_social_brawny_relax: {
        primary: {
            name: 'Beach Days',
            icon: '🏖️',
            reason: 'Sun, sand, and friends—the ultimate chill outdoor hang',
            emojis: ['🏖️', '🌊'],
            resources: [
                { type: 'instagram', name: '@beautifuldestinations', link: 'https://instagram.com/beautifuldestinations' },
                { type: 'video', name: 'beach day essentials', link: 'https://youtube.com/results?search_query=beach+day+essentials+packing' }
            ]
        },
        alternatives: ['Park hangs', 'Outdoor BBQ', 'Frisbee', 'Cornhole', 'Outdoor yoga']
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

        // Display Hobbyist Type Page (Page 1)
        const typeContent = document.getElementById('hobbyistTypeContent');
        // Generate trait tags data
        const tags = getTraitTagsData(profile);
        const pillsHTML = tags.map(tag => `
            <div class="simple-pill" style="background-color: ${tag.bg}">
                <span class="simple-pill-emoji">${tag.emoji}</span>
                <span class="simple-pill-text">${tag.label}</span>
            </div>
        `).join('');

        typeContent.innerHTML = `
            <div class="type-page-header">
                <h2 class="type-intro">Your Hobbyist type is</h2>
                <h1 class="type-name">${archetype.name.toUpperCase()}</h1>
                <svg class="type-smiley" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="58" fill="#F786E2"/>
                    <path d="M40 54C43.5 47 53 47.5 56 54" stroke="#6451FA" stroke-width="4.5" stroke-linecap="round"/>
                    <path d="M64 54C67.5 47 77 47.5 80 54" stroke="#6451FA" stroke-width="4.5" stroke-linecap="round"/>
                    <path d="M55 68C57 74 63 74 65 68" stroke="#6451FA" stroke-width="4.5" stroke-linecap="round"/>
                </svg>
            </div>
            <p class="type-description">${archetype.description}</p>
            <div class="type-traits simple-pills-container">
                ${pillsHTML}
            </div>
            <button class="continue-btn" onclick="showHobbyPage()">
                Ready for your new hobby? →
            </button>
        `;

        showPage('hobbyistTypePage');
    } catch (error) {
        console.error('Error in showResults:', error);
        alert('Error loading results: ' + error.message);
    }
}

function getTraitTags(profile) {
    const traits = profile.split('_');
    const colors = {
        'indoor': '#5DCB83',
        'outdoor': '#5DCB83',
        'maker': '#FFD966',
        'mover': '#FFD966',
        'solo': '#E0B3FF',
        'social': '#E0B3FF',
        'brainy': '#FFD966',
        'brawny': '#FFD966',
        'learn': '#FFB3D9',
        'relax': '#FFB3D9'
    };

    const icons = {
        'indoor': '🏠',
        'outdoor': '🌳',
        'maker': '✨',
        'mover': '🏃',
        'solo': '🧘',
        'social': '👥',
        'brainy': '🧠',
        'brawny': '💪',
        'learn': '📚',
        'relax': '😌'
    };

    return traits.map(trait => `
        <div class="trait-tag" style="background-color: ${colors[trait]}">
            <span class="trait-icon">${icons[trait]}</span>
            <span class="trait-label">${trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
        </div>
    `).join('');
}

function getTraitTagsData(profile) {
    const colors = {
        'indoor': '#5DCB83',
        'outdoor': '#5DCB83',
        'maker': '#FFD966',
        'mover': '#FFD966',
        'solo': '#E0B3FF',
        'social': '#E0B3FF',
        'brainy': '#FFD966',
        'brawny': '#FFD966',
        'learn': '#FFB3D9',
        'relax': '#FFB3D9'
    };

    const icons = {
        'indoor': '🏠',
        'outdoor': '🌳',
        'maker': '✨',
        'mover': '🏃',
        'solo': '🧘',
        'social': '👥',
        'brainy': '🧠',
        'brawny': '💪',
        'learn': '📚',
        'relax': '😌'
    };

    // Build tags based on actual user answers, showing both options for "both"
    const tags = [];

    // Question 1: Indoor/Outdoor
    if (userAnswers.question1 === 'both') {
        tags.push({ id: 'indoor', label: 'Indoor', emoji: icons['indoor'], bg: colors['indoor'] });
        tags.push({ id: 'outdoor', label: 'Outdoor', emoji: icons['outdoor'], bg: colors['outdoor'] });
    } else if (userAnswers.question1) {
        tags.push({ id: userAnswers.question1, label: userAnswers.question1.charAt(0).toUpperCase() + userAnswers.question1.slice(1), emoji: icons[userAnswers.question1], bg: colors[userAnswers.question1] });
    }

    // Question 2: Maker/Mover
    if (userAnswers.question2 === 'both') {
        tags.push({ id: 'maker', label: 'Maker', emoji: icons['maker'], bg: colors['maker'] });
        tags.push({ id: 'mover', label: 'Mover', emoji: icons['mover'], bg: colors['mover'] });
    } else if (userAnswers.question2) {
        tags.push({ id: userAnswers.question2, label: userAnswers.question2.charAt(0).toUpperCase() + userAnswers.question2.slice(1), emoji: icons[userAnswers.question2], bg: colors[userAnswers.question2] });
    }

    // Question 3: Solo/Social
    if (userAnswers.question3 === 'both') {
        tags.push({ id: 'solo', label: 'Solo', emoji: icons['solo'], bg: colors['solo'] });
        tags.push({ id: 'social', label: 'Social', emoji: icons['social'], bg: colors['social'] });
    } else if (userAnswers.question3) {
        tags.push({ id: userAnswers.question3, label: userAnswers.question3.charAt(0).toUpperCase() + userAnswers.question3.slice(1), emoji: icons[userAnswers.question3], bg: colors[userAnswers.question3] });
    }

    // Question 4: Brainy/Brawny
    if (userAnswers.question4 === 'both') {
        tags.push({ id: 'brainy', label: 'Brainy', emoji: icons['brainy'], bg: colors['brainy'] });
        tags.push({ id: 'brawny', label: 'Brawny', emoji: icons['brawny'], bg: colors['brawny'] });
    } else if (userAnswers.question4) {
        tags.push({ id: userAnswers.question4, label: userAnswers.question4.charAt(0).toUpperCase() + userAnswers.question4.slice(1), emoji: icons[userAnswers.question4], bg: colors[userAnswers.question4] });
    }

    // Question 5: Learn/Relax
    if (userAnswers.question5 === 'both') {
        tags.push({ id: 'learn', label: 'Learn', emoji: icons['learn'], bg: colors['learn'] });
        tags.push({ id: 'relax', label: 'Relax', emoji: icons['relax'], bg: colors['relax'] });
    } else if (userAnswers.question5) {
        tags.push({ id: userAnswers.question5, label: userAnswers.question5.charAt(0).toUpperCase() + userAnswers.question5.slice(1), emoji: icons[userAnswers.question5], bg: colors[userAnswers.question5] });
    }

    return tags;
}

// Format hobby name with smiley in O or after the name
function formatHobbyNameWithSmiley(name) {
    const upperName = name.toUpperCase();
    const smileyInO = `<span class="smiley-in-o"><svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" fill="#F786E2"/>
        <path d="M40 54C43.5 47 53 47.5 56 54" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M64 54C67.5 47 77 47.5 80 54" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M55 70C57 77 63 77 65 70" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
    </svg></span>`;

    const smileyAfter = `<span class="smiley-after-text"><svg width="0.85em" height="0.85em" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" fill="#F786E2"/>
        <path d="M40 54C43.5 47 53 47.5 56 54" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M64 54C67.5 47 77 47.5 80 54" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M55 70C57 77 63 77 65 70" stroke="#2D3748" stroke-width="4.5" stroke-linecap="round"/>
    </svg></span>`;

    // Check if name contains O
    if (upperName.includes('O')) {
        // Put smiley inside the O (O stays visible, smiley overlays in center)
        const firstOIndex = upperName.indexOf('O');
        return upperName.substring(0, firstOIndex) + '<span class="o-with-smiley">O' + smileyInO + '</span>' + upperName.substring(firstOIndex + 1);
    } else {
        // Add smiley after the name
        return upperName + ' ' + smileyAfter;
    }
}

function showHobbyPage() {
    const profile = generateProfile();
    const hobbyData = hobbies[profile];

    const hobbyContent = document.getElementById('hobbyContent');
    const formattedName = formatHobbyNameWithSmiley(hobbyData.primary.name);

    hobbyContent.innerHTML = `
        <div class="hobby-page-header">
            <h2 class="hobby-intro">Say hello to your new hobby:</h2>
            <h1 class="hobby-name">${formattedName}</h1>
        </div>
        <p class="hobby-description">${hobbyData.primary.reason}</p>
        ${hobbyData.primary.resources ? `
            <div class="hobby-resources">
                <h3 class="resources-title">RESOURCES</h3>
                <div class="resources-list">
                    ${hobbyData.primary.resources.map(resource => `
                        <a href="${resource.link}" target="_blank" class="resource-link">
                            ${resource.type === 'instagram' ? '📷' : '→'} ${resource.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        ${hobbyData.primary.emojis ? `
            <div class="hobby-emojis">
                ${hobbyData.primary.emojis.map((emoji, index) => `
                    <div class="hobby-emoji hobby-emoji-${index + 1}" style="animation-delay: ${index * 0.2}s">${emoji}</div>
                `).join('')}
            </div>
        ` : ''}
    `;

    const otherHobbies = document.getElementById('otherHobbies');
    otherHobbies.innerHTML = `
        <div class="other-hobbies-section">
            <h3 class="other-hobbies-title">More hobbies for you</h3>
            <div class="other-hobbies-list">
                ${hobbyData.alternatives.map((hobby, index) => `
                    <div class="other-hobby-item" style="animation-delay: ${index * 0.08}s" onclick="searchHobby('${hobby}')">
                        <span class="hobby-item-name">${hobby}</span>
                        <span class="hobby-item-arrow">→</span>
                    </div>
                `).join('')}
            </div>
            <button class="restart-btn-bottom" onclick="restartQuiz()">Take Quiz Again</button>
        </div>
    `;

    showPage('hobbyResultsPage');
}

function searchHobby(hobbyName) {
    // Open Google search for the hobby in a new tab
    const searchQuery = encodeURIComponent(`how to start ${hobbyName}`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
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
    if (userAnswers.question2 === 'maker') {
        profile.push('maker');
    } else if (userAnswers.question2 === 'mover') {
        profile.push('mover');
    } else {
        // Default for 'both' - use indoor/outdoor logic
        if (profile[0] === 'outdoor') {
            profile.push('mover');
        } else {
            profile.push('maker');
        }
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
