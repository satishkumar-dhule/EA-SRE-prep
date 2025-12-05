/**
 * EA SRE Interview Prep - Production JavaScript
 * A robust, feature-rich interview preparation application
 */

// ═══════════════════════════════════════════════════════════════════════════
// State Management
// ═══════════════════════════════════════════════════════════════════════════

const state = {
    data: {},
    currentTopic: null,
    questions: [],
    filteredQuestions: [],
    points: 0,
    streak: 0,
    badges: [],
    lastActivity: null,
    completedCount: 0,
    totalAttempts: {},
    searchQuery: '',
    isLoading: true,
    error: null
};

// Badge definitions
const BADGE_DEFINITIONS = {
    '🏆': { name: 'Century', description: 'Earned 100+ points', condition: () => state.points >= 100 },
    '🔥': { name: 'On Fire', description: '7 day streak', condition: () => state.streak >= 7 },
    '💯': { name: 'Perfectionist', description: 'Score 100% on 5 questions', condition: () => getPerfectScoreCount() >= 5 },
    '🎯': { name: 'Sharpshooter', description: 'Score 80%+ on 10 questions', condition: () => getHighScoreCount() >= 10 },
    '📚': { name: 'Scholar', description: 'Attempt all topics', condition: () => getAttemptedTopicsCount() === Object.keys(state.data).length },
    '⭐': { name: 'Rising Star', description: 'Complete first question', condition: () => state.completedCount >= 1 },
    '🚀': { name: 'Achiever', description: 'Complete 25 questions', condition: () => state.completedCount >= 25 }
};

// ═══════════════════════════════════════════════════════════════════════════
// DOM Elements
// ═══════════════════════════════════════════════════════════════════════════

const elements = {
    loadingScreen: () => document.getElementById('loading-screen'),
    errorScreen: () => document.getElementById('error-screen'),
    errorMessage: () => document.getElementById('error-message'),
    app: () => document.getElementById('app'),
    statsPanel: () => document.getElementById('stats-panel'),
    statsToggle: () => document.getElementById('stats-toggle'),
    themeToggle: () => document.getElementById('theme-toggle'),
    pointsValue: () => document.getElementById('points-value'),
    streakValue: () => document.getElementById('streak-value'),
    completedValue: () => document.getElementById('completed-value'),
    avgScoreValue: () => document.getElementById('avg-score-value'),
    badges: () => document.getElementById('badges'),
    searchInput: () => document.getElementById('search-input'),
    difficultyFilter: () => document.getElementById('difficulty-filter'),
    studyPlanBtn: () => document.getElementById('study-plan-btn'),
    studyPlan: () => document.getElementById('study-plan'),
    nav: () => document.getElementById('nav'),
    progressFill: () => document.getElementById('progress-fill'),
    progressCurrent: () => document.getElementById('progress-current'),
    progressTotal: () => document.getElementById('progress-total'),
    cardsContainer: () => document.getElementById('cards-container'),
    emptyState: () => document.getElementById('empty-state'),
    shortcutsModal: () => document.getElementById('shortcuts-modal'),
    toastContainer: () => document.getElementById('toast-container')
};

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        console.log('[EA SRE] Initializing app...');
        loadTheme();
        loadGamification();
        await loadData();
        console.log('[EA SRE] Data loaded:', Object.keys(state.data).length, 'topics');
        setupEventListeners();
        renderApp();
        hideLoadingScreen();
        console.log('[EA SRE] App ready!');
    } catch (error) {
        console.error('[EA SRE] Initialization error:', error);
        showErrorScreen(error.message);
    }
}

async function loadData() {
    try {
        const response = await fetch('interview_prep.json');
        if (!response.ok) {
            throw new Error(`Failed to load questions (${response.status})`);
        }
        state.data = await response.json();
        
        // Set first topic as current
        const topics = Object.keys(state.data);
        if (topics.length > 0) {
            state.currentTopic = topics[0];
        }
    } catch (error) {
        throw new Error('Unable to load interview questions. Please check your connection and try again.');
    }
}

function hideLoadingScreen() {
    const loadingScreen = elements.loadingScreen();
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        elements.app().classList.remove('hidden');
    }, 400);
}

function showErrorScreen(message) {
    elements.loadingScreen().classList.add('hidden');
    elements.errorMessage().textContent = message;
    elements.errorScreen().classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════
// Theme Management
// ═══════════════════════════════════════════════════════════════════════════

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`${newTheme === 'dark' ? '🌙' : '☀️'} ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, 'success');
}

// ═══════════════════════════════════════════════════════════════════════════
// Gamification
// ═══════════════════════════════════════════════════════════════════════════

function loadGamification() {
    state.points = parseInt(localStorage.getItem('points')) || 0;
    state.streak = parseInt(localStorage.getItem('streak')) || 0;
    state.badges = JSON.parse(localStorage.getItem('badges')) || [];
    state.lastActivity = localStorage.getItem('lastActivity');
    state.totalAttempts = JSON.parse(localStorage.getItem('attempts')) || {};
    
    updateStreak();
    calculateStats();
}

function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastActivity !== today) {
        if (state.lastActivity) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (state.lastActivity === yesterday.toDateString()) {
                state.streak++;
            } else {
                // Check if more than 1 day has passed
                const lastDate = new Date(state.lastActivity);
                const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
                if (daysDiff > 1) {
                    state.streak = 1;
                }
            }
        } else {
            state.streak = 1;
        }
        state.lastActivity = today;
        localStorage.setItem('lastActivity', state.lastActivity);
        localStorage.setItem('streak', state.streak);
    }
}

function calculateStats() {
    state.completedCount = Object.keys(state.totalAttempts).length;
}

function getAverageScore() {
    const attempts = state.totalAttempts;
    const allScores = Object.values(attempts).flatMap(a => a.scores || []);
    if (allScores.length === 0) return 0;
    return Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100);
}

function getPerfectScoreCount() {
    return Object.values(state.totalAttempts).filter(a => 
        a.scores && a.scores.some(s => s >= 0.99)
    ).length;
}

function getHighScoreCount() {
    return Object.values(state.totalAttempts).filter(a => 
        a.scores && a.scores.some(s => s >= 0.8)
    ).length;
}

function getAttemptedTopicsCount() {
    const attemptedTopics = new Set();
    Object.keys(state.totalAttempts).forEach(key => {
        const topic = key.split('-')[0];
        attemptedTopics.add(topic);
    });
    return attemptedTopics.size;
}

function awardPoints(score, difficulty) {
    const basePoints = { easy: 10, medium: 20, hard: 30 };
    const base = basePoints[difficulty] || 10;
    const awarded = Math.round(base * score);
    
    state.points += awarded;
    localStorage.setItem('points', state.points);
    
    checkBadges();
    updateStatsUI();
    
    if (awarded > 0) {
        showToast(`+${awarded} points earned!`, 'success');
    }
}

function checkBadges() {
    let newBadge = false;
    
    Object.entries(BADGE_DEFINITIONS).forEach(([emoji, badge]) => {
        if (!state.badges.includes(emoji) && badge.condition()) {
            state.badges.push(emoji);
            newBadge = true;
            showToast(`🎉 Badge unlocked: ${badge.name}!`, 'success');
        }
    });
    
    if (newBadge) {
        localStorage.setItem('badges', JSON.stringify(state.badges));
        renderBadges();
    }
}

function updateStatsUI() {
    elements.pointsValue().textContent = state.points.toLocaleString();
    elements.streakValue().textContent = state.streak;
    elements.completedValue().textContent = state.completedCount;
    elements.avgScoreValue().textContent = `${getAverageScore()}%`;
}

function renderBadges() {
    const badgesEl = elements.badges();
    badgesEl.innerHTML = '';
    
    if (state.badges.length === 0) {
        badgesEl.innerHTML = '<span class="text-muted">Complete questions to earn badges!</span>';
        return;
    }
    
    state.badges.forEach(emoji => {
        const badge = BADGE_DEFINITIONS[emoji];
        const span = document.createElement('span');
        span.className = 'badge';
        span.title = badge ? badge.description : '';
        span.innerHTML = `
            <span class="badge-icon">${emoji}</span>
            <span>${badge ? badge.name : 'Achievement'}</span>
        `;
        badgesEl.appendChild(span);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// Navigation & Filtering
// ═══════════════════════════════════════════════════════════════════════════

function createNav() {
    const nav = elements.nav();
    nav.innerHTML = '';
    
    Object.keys(state.data).forEach((topic, index) => {
        const button = document.createElement('button');
        button.className = `nav-btn ${topic === state.currentTopic ? 'active' : ''}`;
        button.setAttribute('data-topic', topic);
        
        const count = state.data[topic]?.length || 0;
        button.innerHTML = `
            ${topic}
            <span class="count">${count}</span>
        `;
        
        button.onclick = () => selectTopic(topic);
        nav.appendChild(button);
    });
}

function selectTopic(topic) {
    console.log('[EA SRE] selectTopic called:', topic);
    state.currentTopic = topic;
    state.searchQuery = '';
    elements.searchInput().value = '';
    
    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.topic === topic);
    });
    
    filterAndRenderQuestions();
}

function filterAndRenderQuestions() {
    console.log('[EA SRE] filterAndRenderQuestions, currentTopic:', state.currentTopic);
    console.log('[EA SRE] Available topics:', Object.keys(state.data));
    
    const allQuestions = state.data[state.currentTopic] || [];
    console.log('[EA SRE] Questions for topic:', allQuestions.length);
    
    const difficulty = elements.difficultyFilter().value;
    const searchQuery = state.searchQuery.toLowerCase().trim();
    
    // Apply filters
    let filtered = allQuestions;
    
    // Difficulty filter
    if (difficulty !== 'all') {
        filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    
    // Search filter
    if (searchQuery) {
        const fuse = new Fuse(filtered, {
            keys: ['question', 'idealAnswer', 'keyPoints', 'tags'],
            threshold: 0.4,
            ignoreLocation: true
        });
        filtered = fuse.search(searchQuery).map(result => result.item);
    }
    
    state.filteredQuestions = filtered;
    renderCards();
    updateProgress();
}

function updateProgress() {
    const total = state.data[state.currentTopic]?.length || 0;
    const filtered = state.filteredQuestions.length;
    
    // Calculate completed for current topic
    let completed = 0;
    state.filteredQuestions.forEach((_, index) => {
        const key = `${state.currentTopic}-${index}`;
        if (state.totalAttempts[key]) {
            completed++;
        }
    });
    
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    elements.progressFill().style.width = `${percentage}%`;
    elements.progressCurrent().textContent = filtered;
    elements.progressTotal().textContent = total;
}

// ═══════════════════════════════════════════════════════════════════════════
// Card Rendering
// ═══════════════════════════════════════════════════════════════════════════

function renderCards() {
    const container = elements.cardsContainer();
    const emptyState = elements.emptyState();
    
    console.log('[EA SRE] renderCards called, questions:', state.filteredQuestions.length);
    
    if (state.filteredQuestions.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        console.log('[EA SRE] No questions to show');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.innerHTML = '';
    
    state.filteredQuestions.forEach((q, index) => {
        const card = createCard(q, index);
        container.appendChild(card);
        console.log('[EA SRE] Created card', index, 'for:', q.question?.substring(0, 50));
    });
    
    console.log('[EA SRE] Cards container has', container.children.length, 'children');
}

function createCard(question, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-index', index);
    
    const difficultyClass = `difficulty-${question.difficulty || 'medium'}`;
    const difficultyLabel = question.difficulty ? 
        question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1) : 'Medium';
    
    // Simple card structure without flip animation for now
    card.innerHTML = `
        <div class="card-content">
            <div class="card-header">
                <div class="card-meta">
                    <span class="difficulty-badge ${difficultyClass}">${difficultyLabel}</span>
                </div>
                <span class="card-number">#${index + 1}</span>
            </div>
            <h3 class="question">${escapeHtml(question.question)}</h3>
            <textarea 
                class="answer-input" 
                placeholder="Type your answer here... Think about key concepts, best practices, and SRE principles."
                aria-label="Your answer"
            ></textarea>
            <button class="btn btn-primary submit-btn">
                Submit Answer
            </button>
            <div class="feedback-section hidden">
                <div class="back-header">
                    <span class="back-title">Ideal Answer</span>
                    <span class="score-badge"></span>
                </div>
                <div class="ideal-answer">${formatAnswer(question.idealAnswer)}</div>
                <div class="keypoints">
                    <h4 class="keypoints-title">Key Points</h4>
                    <ul class="keypoints-list"></ul>
                </div>
                <button class="btn reset-btn">
                    ↺ Try Again
                </button>
            </div>
        </div>
    `;
    
    // Attach event listeners
    const submitBtn = card.querySelector('.submit-btn');
    const resetBtn = card.querySelector('.reset-btn');
    
    submitBtn.addEventListener('click', () => {
        console.log('[EA SRE] Submit button clicked for index:', index);
        submitAnswer(index);
    });
    
    resetBtn.addEventListener('click', () => {
        console.log('[EA SRE] Reset button clicked for index:', index);
        resetCard(index);
    });
    
    return card;
}

function formatAnswer(answer) {
    if (!answer) return '';
    
    // Convert markdown-style formatting to HTML
    let formatted = escapeHtml(answer)
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Convert bullet points
    formatted = formatted.replace(/^- /gm, '• ');
    
    return formatted;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════
// Answer Submission
// ═══════════════════════════════════════════════════════════════════════════

function submitAnswer(index) {
    console.log('[EA SRE] submitAnswer called with index:', index);
    
    const card = document.querySelector(`.card[data-index="${index}"]`);
    if (!card) {
        console.error('[EA SRE] Card not found for index:', index);
        return;
    }
    
    const textarea = card.querySelector('textarea');
    const userAnswer = textarea.value.trim();
    
    if (!userAnswer) {
        showToast('Please enter your answer before submitting', 'warning');
        textarea.focus();
        return;
    }
    
    console.log('[EA SRE] Processing answer for question:', index);
    
    const question = state.filteredQuestions[index];
    const feedbackSection = card.querySelector('.feedback-section');
    const keypointsList = card.querySelector('.keypoints-list');
    const scoreBadge = card.querySelector('.score-badge');
    
    keypointsList.innerHTML = '';
    
    // Analyze answer against key points
    let totalWeight = question.keyPoints?.length || 0;
    let coveredWeight = 0;
    const results = [];
    
    if (question.keyPoints && question.keyPoints.length > 0) {
        question.keyPoints.forEach(point => {
            if (!point || point.length < 3) return; // Skip empty/short points
            
            const fuse = new Fuse([userAnswer.toLowerCase()], { 
                threshold: 0.4, 
                includeScore: true 
            });
            const searchResults = fuse.search(point.toLowerCase());
            
            let weight = 0;
            if (searchResults.length > 0) {
                const score = searchResults[0].score;
                if (score < 0.2) weight = 1;
                else if (score < 0.4) weight = 0.5;
            }
            
            // Also check for direct inclusion
            if (weight === 0 && userAnswer.toLowerCase().includes(point.toLowerCase().substring(0, 20))) {
                weight = 0.75;
            }
            
            coveredWeight += weight;
            results.push({ point, covered: weight > 0 });
        });
    }
    
    // Calculate score
    const score = totalWeight > 0 ? coveredWeight / totalWeight : 0;
    
    // Render key points
    results.forEach(({ point, covered }) => {
        const li = document.createElement('li');
        li.className = `keypoint ${covered ? 'present' : 'missing'}`;
        li.textContent = point.length > 60 ? point.substring(0, 60) + '...' : point;
        keypointsList.appendChild(li);
    });
    
    // Update score badge
    const scorePercent = Math.round(score * 100);
    let scoreClass = 'score-low';
    if (scorePercent >= 80) scoreClass = 'score-high';
    else if (scorePercent >= 50) scoreClass = 'score-medium';
    
    scoreBadge.className = `score-badge ${scoreClass}`;
    scoreBadge.textContent = `${scorePercent}%`;
    
    // Award points
    awardPoints(score, question.difficulty);
    
    // Save attempt
    const key = `${state.currentTopic}-${index}`;
    state.totalAttempts[key] = state.totalAttempts[key] || { attempts: 0, scores: [] };
    state.totalAttempts[key].attempts++;
    state.totalAttempts[key].scores.push(score);
    localStorage.setItem('attempts', JSON.stringify(state.totalAttempts));
    
    // Update stats
    calculateStats();
    updateStatsUI();
    checkBadges();
    updateProgress();
    
    // Show feedback section
    feedbackSection.classList.remove('hidden');
    card.querySelector('.submit-btn').disabled = true;
    textarea.disabled = true;
}

function resetCard(index) {
    const card = document.querySelector(`.card[data-index="${index}"]`);
    if (!card) return;
    
    const feedbackSection = card.querySelector('.feedback-section');
    const textarea = card.querySelector('textarea');
    const submitBtn = card.querySelector('.submit-btn');
    
    feedbackSection.classList.add('hidden');
    textarea.value = '';
    textarea.disabled = false;
    submitBtn.disabled = false;
    textarea.focus();
}

// ═══════════════════════════════════════════════════════════════════════════
// Study Plan
// ═══════════════════════════════════════════════════════════════════════════

function generateStudyPlan() {
    const studyPlanEl = elements.studyPlan();
    const topicScores = {};
    
    // Calculate average scores per topic
    Object.entries(state.totalAttempts).forEach(([key, data]) => {
        const topic = key.split('-')[0];
        if (!topicScores[topic]) {
            topicScores[topic] = [];
        }
        if (data.scores && data.scores.length > 0) {
            topicScores[topic].push(...data.scores);
        }
    });
    
    // Find weak topics (avg score < 70%)
    const weakTopics = [];
    const strongTopics = [];
    
    Object.keys(state.data).forEach(topic => {
        const scores = topicScores[topic] || [];
        if (scores.length === 0) {
            weakTopics.push({ topic, reason: 'Not started' });
        } else {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (avg < 0.7) {
                weakTopics.push({ topic, reason: `${Math.round(avg * 100)}% avg` });
            } else {
                strongTopics.push({ topic, avg: Math.round(avg * 100) });
            }
        }
    });
    
    // Render study plan
    if (weakTopics.length > 0) {
        studyPlanEl.innerHTML = `
            <h3>📋 Your Study Plan</h3>
            <p>Focus on these topics to improve:</p>
            <ul>
                ${weakTopics.map(({ topic, reason }) => 
                    `<li>${topic} <small>(${reason})</small></li>`
                ).join('')}
            </ul>
        `;
    } else if (strongTopics.length > 0) {
        studyPlanEl.innerHTML = `
            <h3>🎉 Excellent Progress!</h3>
            <p>All topics are strong. Keep reviewing for maintenance and try harder questions.</p>
        `;
    } else {
        studyPlanEl.innerHTML = `
            <h3>📚 Get Started</h3>
            <p>Complete some questions to generate a personalized study plan!</p>
        `;
    }
    
    studyPlanEl.classList.remove('hidden');
    showToast('Study plan generated!', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════
// Toast Notifications
// ═══════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'info') {
    const container = elements.toastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// Modal Management
// ═══════════════════════════════════════════════════════════════════════════

function openShortcutsModal() {
    elements.shortcutsModal().classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeShortcutsModal() {
    elements.shortcutsModal().classList.add('hidden');
    document.body.style.overflow = '';
}

// Make this available globally for the onclick handler
window.closeShortcutsModal = closeShortcutsModal;

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
    // Theme toggle
    elements.themeToggle().addEventListener('click', toggleTheme);
    
    // Stats panel toggle
    elements.statsToggle().addEventListener('click', () => {
        elements.statsPanel().classList.toggle('hidden');
    });
    
    // Search
    let searchTimeout;
    elements.searchInput().addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.searchQuery = e.target.value;
            filterAndRenderQuestions();
        }, 300);
    });
    
    // Difficulty filter
    elements.difficultyFilter().addEventListener('change', filterAndRenderQuestions);
    
    // Study plan button
    elements.studyPlanBtn().addEventListener('click', generateStudyPlan);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
            e.target.blur();
            state.searchQuery = '';
            elements.searchInput().value = '';
            filterAndRenderQuestions();
        }
        return;
    }
    
    switch (e.key) {
        case '/':
            e.preventDefault();
            elements.searchInput().focus();
            break;
        case 'Escape':
            closeShortcutsModal();
            break;
        case 'd':
        case 'D':
            toggleTheme();
            break;
        case 's':
        case 'S':
            elements.statsPanel().classList.toggle('hidden');
            break;
        case '?':
            openShortcutsModal();
            break;
        default:
            // Number keys for topic selection
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                const topics = Object.keys(state.data);
                if (topics[num - 1]) {
                    selectTopic(topics[num - 1]);
                }
            }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Render
// ═══════════════════════════════════════════════════════════════════════════

function renderApp() {
    createNav();
    filterAndRenderQuestions();
    updateStatsUI();
    renderBadges();
}

// Make submitAnswer and resetCard available globally
window.submitAnswer = submitAnswer;
window.resetCard = resetCard;
