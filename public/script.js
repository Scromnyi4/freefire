// Tab functionality
function openTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Activate the clicked button
    event.currentTarget.classList.add('active');
}

// Ban Check API
async function checkBan() {
    const uid = document.getElementById('ban-uid').value.trim();
    const resultBox = document.getElementById('ban-result');
    const content = document.getElementById('ban-result-content');
    const button = document.querySelector('#ban-tab button');
    const buttonText = button.querySelector('.button-text');
    const loader = button.querySelector('.button-loader');
    
    if (!uid || !/^\d{5,12}$/.test(uid)) {
        content.textContent = 'Please enter valid UID (5-12 digits)';
        resultBox.style.display = 'block';
        return;
    }
    
    // Show loading state
    buttonText.style.visibility = 'hidden';
    loader.style.display = 'block';
    button.disabled = true;
    resultBox.style.display = 'none';
    
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://ff-bancheck.vercel.app/region/ban-info?uid=${uid}`;
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        
        const data = await response.json();
        content.textContent = data.ban_status || 'Unknown status';
        resultBox.style.display = 'block';
    } catch (error) {
        content.textContent = 'Service unavailable. Try again later.';
        resultBox.style.display = 'block';
        console.error('Error:', error);
    } finally {
        buttonText.style.visibility = 'visible';
        loader.style.display = 'none';
        button.disabled = false;
    }
}

// Player Info API
async function getPlayerInfo() {
    const region = document.getElementById('player-region').value;
    const uid = document.getElementById('player-uid').value.trim();
    const content = document.getElementById('player-result-content');
    const button = document.querySelector('#player-tab button');
    const buttonText = button.querySelector('.button-text');
    const loader = button.querySelector('.button-loader');
    
    if (!uid || !/^\d{5,12}$/.test(uid)) {
        content.innerHTML = '<div class="player-info-item"><span class="player-info-value">Please enter valid UID (5-12 digits)</span></div>';
        document.getElementById('player-result').style.display = 'block';
        return;
    }

    // Show loading state
    buttonText.style.visibility = 'hidden';
    loader.style.display = 'block';
    button.disabled = true;
    document.getElementById('player-result').style.display = 'none';
    
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://accinfo.vercel.app/player-info?region=${region}&uid=${uid}`;
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        // Format player info
        let html = `
            <div class="player-info-item">
                <span class="player-info-label">Nickname:</span>
                <span class="player-info-value">${data.basicInfo?.nickname || 'N/A'}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Region:</span>
                <span class="player-info-value">${region}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Likes:</span>
                <span class="player-info-value">${data.basicInfo?.liked?.toLocaleString() || '0'}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Level:</span>
                <span class="player-info-value">${data.basicInfo?.level || 'N/A'}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Rank:</span>
                <span class="player-info-value">${data.basicInfo?.rank || 'N/A'}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Clan:</span>
                <span class="player-info-value">${data.clanBasicInfo?.clanName || 'No clan'}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Create At:</span>
                <span class="player-info-value">${formatTimestamp(data.basicInfo?.createAt)}</span>
            </div>
            <div class="player-info-item">
                <span class="player-info-label">Last Login:</span>
                <span class="player-info-value">${formatTimestamp(data.basicInfo?.lastLoginAt)}</span>
            </div>
            <div class="player-info-item" style="grid-column: 1 / -1">
                <span class="player-info-label">Signature:</span>
                <span class="player-info-value">${data.socialInfo?.signature || 'No signature'}</span>
            </div>
        `;
        
        content.innerHTML = html;
        document.getElementById('player-result').style.display = 'block';
    } catch (error) {
        content.innerHTML = '<div class="player-info-item" style="grid-column: 1 / -1"><span class="player-info-value">Failed to load player info. Try again later.</span></div>';
        document.getElementById('player-result').style.display = 'block';
        console.error('Error:', error);
    } finally {
        buttonText.style.visibility = 'visible';
        loader.style.display = 'none';
        button.disabled = false;
    }
}

// Helper function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString();
}

// Input validation
document.getElementById('ban-uid').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('player-uid').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

// Enter key support
document.getElementById('ban-uid').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkBan();
});

document.getElementById('player-uid').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getPlayerInfo();
});
