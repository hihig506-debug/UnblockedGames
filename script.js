/**
 * Jpeg Game's - Vanilla JavaScript Implementation
 */

const state = {
    games: [],
    selectedCategory: 'All',
    searchQuery: '',
    activeGame: null,
    isFullScreen: false
};

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Idle', 'Runner'];

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const categoryList = document.getElementById('categoryList');
const mobileCategoryList = document.getElementById('mobileCategoryList');
const searchInput = document.getElementById('searchInput');
const categoryTitle = document.getElementById('categoryTitle');
const gameModal = document.getElementById('gameModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const gameIframe = document.getElementById('gameIframe');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalInfo = document.getElementById('modalInfo');
const toggleFullscreen = document.getElementById('toggleFullscreen');
const fsText = document.getElementById('fsText');
const noResults = document.getElementById('noResults');

// Initialize
async function init() {
    try {
        const response = await fetch('games.json');
        state.games = await response.json();
        renderCategories();
        renderGames();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to load games:', error);
    }
}

function renderCategories() {
    const render = (container, isMobile) => {
        container.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            
            if (isMobile) {
                btn.className = `whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    state.selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-900 text-zinc-400 border border-white/5'
                }`;
            } else {
                btn.className = `w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    state.selectedCategory === cat
                        ? 'bg-blue-500/10 text-blue-400 font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`;
                if (state.selectedCategory === cat) {
                    const dot = document.createElement('div');
                    dot.className = 'w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]';
                    btn.appendChild(dot);
                }
            }

            btn.onclick = () => {
                state.selectedCategory = cat;
                categoryTitle.textContent = cat === 'All' ? 'Discover' : cat;
                renderCategories();
                renderGames();
            };
            container.appendChild(btn);
        });
    };

    render(categoryList, false);
    render(mobileCategoryList, true);
}

function renderGames() {
    const filtered = state.games.filter(game => {
        const matchesCategory = state.selectedCategory === 'All' || game.category === state.selectedCategory;
        const matchesSearch = game.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    gameGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach((game, index) => {
            const card = document.createElement('div');
            card.className = 'group bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-blue-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in';
            card.style.animationDelay = `${index * 50}ms`;
            
            card.innerHTML = `
                <div class="aspect-video relative overflow-hidden">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-4">
                        <span class="bg-zinc-950/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10">
                            ${game.category}
                        </span>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">${game.title}</h3>
                    <p class="text-zinc-500 text-xs line-clamp-2 leading-relaxed">${game.description}</p>
                </div>
            `;

            card.onclick = () => openGame(game);
            gameGrid.appendChild(card);
        });
    }
}

function openGame(game) {
    state.activeGame = game;
    state.isFullScreen = false;
    
    modalTitle.textContent = game.title;
    modalCategory.textContent = game.category;
    modalDescription.textContent = game.description;
    gameIframe.src = game.iframeUrl;
    
    updateModalSize();
    gameModal.classList.remove('hidden');
    gameModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function updateModalSize() {
    if (state.isFullScreen) {
        modalContent.className = 'bg-zinc-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 w-full h-full';
        modalInfo.classList.add('hidden');
        fsText.textContent = 'Small Mode';
    } else {
        modalContent.className = 'bg-zinc-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 w-full max-w-5xl h-[80vh]';
        modalInfo.classList.remove('hidden');
        fsText.textContent = 'Cinema Mode';
    }
}

function setupEventListeners() {
    searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        renderGames();
    };

    closeModal.onclick = () => {
        state.activeGame = null;
        gameIframe.src = '';
        gameModal.classList.add('hidden');
        gameModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    };

    toggleFullscreen.onclick = () => {
        state.isFullScreen = !state.isFullScreen;
        updateModalSize();
    };

    // Close modal on escape
    window.onkeydown = (e) => {
        if (e.key === 'Escape' && state.activeGame) {
            closeModal.onclick();
        }
    };
}

init();
