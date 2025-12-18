let seconds = 2580; // 43 mins
let isPaused = false;
let balance = 500.00; // Starting balance
let timer;

// --- NAVIGATION ---
function tab(id, el) {
    document.querySelectorAll('.tab-pane').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// --- AUTH LOGIC ---
function handleRegister() {
    localStorage.setItem('p_user', document.getElementById('reg-username').value);
    localStorage.setItem('p_email', document.getElementById('reg-email').value);
    alert("Saved!"); showScreen('login-screen');
}

function handleLogin() {
    const name = localStorage.getItem('p_user') || "Justine Nabunturan";
    document.querySelectorAll('.user-name').forEach(el => el.innerText = name);
    // Use the correct ID from your HTML
    const emailEl = document.getElementById('user-email');
    if(emailEl) emailEl.innerText = localStorage.getItem('p_email') || "user@gmail.com";
    
    showScreen('main-app');
    startClock();
}

// --- TIMER LOGIC ---
function startClock() {
    if(timer) clearInterval(timer);
    timer = setInterval(() => {
        if(!isPaused && seconds > 0) {
            seconds--;
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            const timeStr = `${m}:${s.toString().padStart(2, '0')}`;
            document.querySelectorAll('.timer-text').forEach(el => el.innerText = timeStr);
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-btn').innerText = isPaused ? "Resume" : "Pause";
}

// --- CANTEEN & QUANTITY LOGIC ---
function changeQty(inputId, delta) {
    const input = document.getElementById(inputId);
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function orderFood(item, pricePerUnit, qtyId) {
    const qty = parseInt(document.getElementById(qtyId).value);
    const totalCost = pricePerUnit * qty;

    if (balance >= totalCost) {
        balance -= totalCost;
        updateUI();
        addHistory(`Ordered ${qty}x ${item}`, totalCost);
        alert(`Order placed: ${qty}x ${item}!\nTotal: ₱${totalCost} deducted.`);
        document.getElementById(qtyId).value = 1; // Reset quantity to 1
    } else {
        alert("Insufficient balance for this quantity.");
    }
}

// --- TIME & BALANCE LOGIC ---
function addTime(mins, cost) {
    if (balance >= cost) {
        balance -= cost;
        seconds += (mins * 60);
        updateUI();
        addHistory(`Added ${mins} mins Time`, cost);
        alert(`Successfully added ${mins} minutes!`);
    } else {
        alert("Insufficient Balance!");
    }
}

function updateUI() {
    const balEl = document.getElementById('bal-total');
    if(balEl) balEl.innerText = `₱ ${balance.toFixed(2)}`;
    
    localStorage.setItem('p_balance', balance);
    localStorage.setItem('p_time', seconds);
}

// --- PROFILE & SETTINGS ---
function toggleEditProfile(isEditing) {
    if(isEditing) {
        document.getElementById('profile-view').classList.add('hidden');
        document.getElementById('profile-edit').classList.remove('hidden');
        document.getElementById('edit-name').value = localStorage.getItem('p_user') || "";
        document.getElementById('edit-email').value = localStorage.getItem('p_email') || "";
    } else {
        document.getElementById('profile-view').classList.remove('hidden');
        document.getElementById('profile-edit').classList.add('hidden');
    }
}

function saveProfile() {
    const newName = document.getElementById('edit-name').value;
    const newEmail = document.getElementById('edit-email').value;

    localStorage.setItem('p_user', newName);
    localStorage.setItem('p_email', newEmail);

    document.querySelectorAll('.user-name').forEach(el => el.innerText = newName);
    const emailEl = document.getElementById('user-email');
    if(emailEl) emailEl.innerText = newEmail;

    alert("Profile Updated!");
    toggleEditProfile(false);
}

function changePassword() {
    const newPass = prompt("Enter new password:");
    if(newPass) {
        localStorage.setItem('p_pass', newPass);
        alert("Password changed successfully!");
    }
}

// --- HISTORY LOGIC ---
function addHistory(type, amount) {
    const list = document.getElementById('history-list');
    if(!list) return;

    if(list.querySelector('p')) list.innerHTML = ''; 

    const item = document.createElement('div');
    item.className = 'gray-box';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.marginBottom = '10px';
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    item.innerHTML = `<span>${type} (${now})</span> <span style="color:red; font-weight:bold;">-₱${amount.toFixed(2)}</span>`;
    list.prepend(item);
}

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('p_dark', document.body.classList.contains('dark'));
}

function handleLogout() { 
    if(confirm("Are you sure you want to logout?")) {
        location.reload(); 
    }
}

// Initial Load
if(localStorage.getItem('p_dark') === 'true') {
    document.body.classList.add('dark');
    setTimeout(() => { 
        const darkTog = document.getElementById('dark-toggle');
        if(darkTog) darkTog.checked = true; 
    }, 100);
}
