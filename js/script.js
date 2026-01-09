// --- STATE ---
// This acts as the "database" for the app
let mappings = [
    { id: 1, source: '1', target: '45' },
    { id: 2, source: '2', target: '50' },
    { id: 3, source: '3', target: '55' },
    { id: 4, source: '4', target: '60' },
];
let sequenceLength = 10;
let results = [];

// --- ELEMENTS ---
// We grab references to the HTML elements so we can control them
const mappingListEl = document.getElementById('mapping-list');
const itemCountBadge = document.getElementById('item-count-badge');
const inputLength = document.getElementById('input-length');
const rawOutput = document.getElementById('raw-output');
const gridOutput = document.getElementById('grid-output');
const chartContainer = document.getElementById('chart-container');
const emptyState = document.getElementById('empty-state');
const resultsContent = document.getElementById('results-content');
const btnCopy = document.getElementById('btn-copy');

// --- RENDER FUNCTIONS ---
// These functions update the screen based on the data above

function renderMappings() {
    mappingListEl.innerHTML = ''; 
    itemCountBadge.innerText = `${mappings.length} Items`;

    mappings.forEach(item => {
        const row = document.createElement('div');
        row.className = 'mapping-row';
        row.innerHTML = `
            <div class="input-group">
                <span class="label">Src</span>
                <input type="text" class="input-src" value="${item.source}" data-id="${item.id}">
            </div>
            <span class="arrow">→</span>
            <div class="input-group">
                <span class="label">Out</span>
                <input type="text" class="input-out" value="${item.target}" data-id="${item.id}">
            </div>
            <button class="btn-icon delete-btn" data-id="${item.id}">
                <i data-lucide="trash-2" width="16" height="16"></i>
            </button>
        `;
        mappingListEl.appendChild(row);
    });

    // ... (Keep your event listeners here unchanged) ...
    document.querySelectorAll('.input-src').forEach(el => 
        el.addEventListener('input', (e) => updateMapping(e.target.dataset.id, 'source', e.target.value))
    );
    document.querySelectorAll('.input-out').forEach(el => 
        el.addEventListener('input', (e) => updateMapping(e.target.dataset.id, 'target', e.target.value))
    );
    document.querySelectorAll('.delete-btn').forEach(el => 
        el.addEventListener('click', (e) => removeMapping(parseInt(e.currentTarget.dataset.id)))
    );

    // ADD THIS: Tell Lucide to look for new <i data-lucide> tags and render them
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderResults() {
    if (results.length === 0) {
        emptyState.style.display = 'flex';
        resultsContent.style.display = 'none';
        btnCopy.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    resultsContent.style.display = 'block';
    btnCopy.style.display = 'flex';

    // 1. Raw Output
    rawOutput.innerHTML = results.map(r => 
        `<span class="token">${r.target || r.source}</span>`
    ).join(', ');

    // 2. Grid Output
    gridOutput.innerHTML = results.map((r, i) => 
        `<div class="grid-item" style="animation-delay: ${Math.min(i * 50, 500)}ms">${r.target || "?"}</div>`
    ).join('');

    // 3. Chart (Frequency)
    // Calculate stats
    const counts = {};
    results.forEach(r => {
        const key = r.target || r.source;
        counts[key] = (counts[key] || 0) + 1;
    });
    
    // Find max for scaling
    const maxVal = Math.max(...Object.values(counts));
    
    chartContainer.innerHTML = '';
    Object.keys(counts).forEach(key => {
        const count = counts[key];
        const percent = ((count / results.length) * 100).toFixed(1);
        const heightPercent = (count / maxVal) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-col';
        bar.innerHTML = `
            <div class="bar-fill" style="height: ${heightPercent}%"></div>
            <div class="bar-label">${key}</div>
            <div class="bar-tooltip">${count} (${percent}%)</div>
        `;
        chartContainer.appendChild(bar);
    });
}

// --- LOGIC FUNCTIONS ---

function updateMapping(id, field, value) {
    const idNum = parseInt(id);
    const item = mappings.find(m => m.id === idNum);
    if (item) item[field] = value;
}

function addMapping() {
    const newId = mappings.length > 0 ? Math.max(...mappings.map(m => m.id)) + 1 : 1;
    mappings.push({ id: newId, source: (mappings.length + 1).toString(), target: '' });
    renderMappings();
}

function removeMapping(id) {
    mappings = mappings.filter(m => m.id !== id);
    renderMappings();
}

function generate() {
    if (mappings.length === 0) return;
    
    // UI Feedback
    const btn = document.getElementById('btn-generate');
    const originalText = btn.innerText;
    btn.innerText = "Generating...";
    btn.disabled = true;

    setTimeout(() => {
        const newSequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            const randomIndex = Math.floor(Math.random() * mappings.length);
            newSequence.push(mappings[randomIndex]);
        }
        results = newSequence;
        renderResults();
        
        btn.innerText = originalText;
        btn.disabled = false;
    }, 400);
}

function copyToClipboard() {
    const text = results.map(r => r.target || r.source).join(', ');
    
    // Create a temporary text area to perform the copy
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        // The old-school command that works perfectly on file://
        document.execCommand('copy'); 
        
        // Success Feedback
        const original = btnCopy.innerText;
        btnCopy.innerText = "Copied!";
        setTimeout(() => btnCopy.innerText = original, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
        alert("Copy failed. You might need to manually copy the text.");
    }
    
    // Clean up
    document.body.removeChild(textArea);
}

function reset() {
    mappings = [
        { id: 1, source: '1', target: '45' },
        { id: 2, source: '2', target: '50' },
        { id: 3, source: '3', target: '55' },
        { id: 4, source: '4', target: '60' },
    ];
    sequenceLength = 10;
    inputLength.value = 10;
    results = [];
    renderMappings();
    renderResults();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the browser to finish loading everything
    
    // Bind main buttons
    document.getElementById('btn-add').addEventListener('click', addMapping);
    document.getElementById('btn-generate').addEventListener('click', generate);
    document.getElementById('btn-reset').addEventListener('click', reset);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
    inputLength.addEventListener('change', (e) => sequenceLength = parseInt(e.target.value));

    // Render initial state
    renderMappings();
    
    // Check if Lucide is loaded, then render
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
