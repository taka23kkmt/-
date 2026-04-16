// --- Data Definitions ---

const devices = {
    brushcutter: {
        name: "刈払機",
        id: "brushcutter",
        diag: {
            start: {
                question: "現在どのような症状がありますか？",
                options: [
                    { text: "エンジンが全くかからない", next: "start_fail" },
                    { text: "一瞬かかるがすぐに止まる", next: "starts_then_stops" },
                    { text: "回転が上がらない・力がない", next: "low_power" },
                    { text: "異音がする・振動が激しい", next: "noise_vibration" }
                ]
            },
            start_fail: {
                question: "スターター（紐）はスムーズに引けますか？",
                options: [
                    { text: "はい、普通に引ける", next: "check_fuel" },
                    { text: "重くて引けない・固着している", next: "engine_seized" },
                    { text: "スカスカして手応えがない", next: "starter_broken" }
                ]
            },
            check_fuel: {
                question: "燃料の状態はどうですか？",
                options: [
                    { text: "新しい混合燃料が入っている", next: "check_choke" },
                    { text: "1ヶ月以上前の古い燃料だ", next: "stale_fuel" }
                ]
            },
            check_choke: {
                question: "チョークを閉じて数回引き、初爆はありましたか？",
                options: [
                    { text: "「ブォン」と一瞬音がした", next: "choke_ok_but_fails" },
                    { text: "全く反応がない", next: "check_plug" }
                ]
            },
            check_plug: {
                question: "スパークプラグを外して見てください。状態は？",
                options: [
                    { text: "黒く湿っている（濡れている）", next: "plug_flooded" },
                    { text: "乾いているが真っ黒に汚れている", next: "plug_dirty" },
                    { text: "きれいで火花も飛ぶ", next: "carb_clogged" }
                ]
            },
            // Results
            engine_seized: { isResult: true, title: "エンジンの焼き付き", description: "ピストンやシリンダーが固着しています。オイル不足が原因です。", actions: ["修理店に持ち込んでください。シリンダー交換が必要です。"] },
            stale_fuel: { isResult: true, title: "燃料の劣化", description: "古い燃料はキャブレターを詰まらせます。", actions: ["古い燃料を捨て、新しい燃料に入れ替えてください。"] },
            plug_flooded: { isResult: true, title: "燃料かぶり", description: "内部に燃料が溜まりすぎています。", actions: ["プラグを外し、清掃・乾燥させてから再度始動してください。"] },
            carb_clogged: { isResult: true, title: "キャブレター詰まり", description: "内部のノズルが詰まっています。", actions: ["キャブレタークリーナーで洗浄するか、アセンブリ交換してください。"] }
        },
        maint: [
            { group: "1. 使用前点検", items: ["ネジ・ボルトの緩み確認", "燃料漏れ・ホースの亀裂確認", "飛散保護カバーの状態"] },
            { group: "2. 定期整備", items: ["エアクリーナー清掃", "ギヤケースのグリスアップ", "プラグの清掃・隙間調整"] }
        ]
    },
    chainsaw: {
        name: "チェンソー",
        id: "chainsaw",
        diag: {
            start: {
                question: "現在どのような不具合がありますか？",
                options: [
                    { text: "エンジンがかからない", next: "start_fail" },
                    { text: "チェンが回らない・止まらない", next: "chain_issue" },
                    { text: "チェンオイルが出ない", next: "oil_issue" },
                    { text: "切れ味が悪い・曲がって切れる", next: "cutting_issue" }
                ]
            },
            start_fail: {
                question: "チェンブレーキは解除されていますか？",
                options: [
                    { text: "はい、手前に引いて解除している", next: "check_fuel" },
                    { text: "ブレーキがかかったままだ", next: "release_brake" }
                ]
            },
            chain_issue: {
                question: "チェンが回らない原因を確認します。アイドリングで回りますか？",
                options: [
                    { text: "アイドリングでも回ってしまう", next: "clutch_broken" },
                    { text: "アクセルを吹かしても回らない", next: "brake_engaged_or_frozen" }
                ]
            },
            oil_issue: {
                question: "オイルタンクにオイルは入っていますか？",
                options: [
                    { text: "入っているが、バーの先から出ない", next: "oil_path_clogged" },
                    { text: "オイルの減りが異常に遅い", next: "oil_flow_adj" }
                ]
            },
            cutting_issue: {
                question: "ソーチェンの状態はどうですか？",
                options: [
                    { text: "左右で刃の長さがバラバラ", next: "uneven_sharpening" },
                    { text: "刃は尖っているが食い込まない", next: "depth_gauge_high" }
                ]
            },
            // Results
            release_brake: { isResult: true, title: "チェンブレーキの作動", description: "安全装置がかかっています。", actions: ["ハンドガードを手前にカチッと音がするまで引いて解除してください。"] },
            clutch_broken: { isResult: true, title: "クラッチスプリングの破損", description: "遠心クラッチのバネが切れています。", actions: ["クラッチ部分を分解し、スプリングを交換してください。"] },
            oil_path_clogged: { isResult: true, title: "オイル経路の詰まり", description: "おが屑やゴミがオイルの出口を塞いでいます。", actions: ["ガイドバーを外し、本体側のオイル出口を確認・清掃してください。"] },
            uneven_sharpening: { isResult: true, title: "目立ての不均一", description: "左右の刃の研ぎ角や長さが異なると曲がって切れます。", actions: ["全ての刃の長さを揃えるように目立てをし直してください。"] },
            depth_gauge_high: { isResult: true, title: "デプスゲージが高すぎる", description: "刃の食い込み深さを決める突起が高すぎます。", actions: ["デプスゲージを平ヤスリで規定の高さまで削り落としてください。"] }
        },
        maint: [
            { group: "1. 使用前点検", items: ["チェンブレーキの作動確認", "チェンの張り調整（適正：軽く持ち上がる程度）", "オイル供給の確認"] },
            { group: "2. 定期整備", items: ["エアクリーナーの清掃", "ガイドバーのバリ取り・溝清掃", "燃料・オイルフィルタの点検"] }
        ]
    }
};

// --- App State ---

let currentDeviceId = 'brushcutter';
let currentDiagPath = 'start';
let history = [];
let storageData = JSON.parse(localStorage.getItem('equipmentManagerData')) || {
    brushcutter: { hours: 0, logs: [] },
    chainsaw: { hours: 0, logs: [] }
};

// --- DOM Elements ---

const elements = {
    sectionDiag: document.getElementById('section-diag'),
    sectionMaint: document.getElementById('section-maint'),
    sectionJournal: document.getElementById('section-journal'),
    maintContent: document.getElementById('maint-content'),
    
    btnHome: document.getElementById('btn-home'),
    btnMaint: document.getElementById('btn-maint'),
    btnJournal: document.getElementById('btn-journal'),
    
    deviceBrushcutter: document.getElementById('device-brushcutter'),
    deviceChainsaw: document.getElementById('device-chainsaw'),
    
    questionArea: document.getElementById('question-area'),
    optionsContainer: document.getElementById('options-container'),
    questionText: document.getElementById('question-text'),
    
    resultArea: document.getElementById('result-area'),
    resultTitle: document.getElementById('result-title'),
    resultDescription: document.getElementById('result-description'),
    actionList: document.getElementById('action-list'),
    
    currentStep: document.getElementById('current-step'),
    progressFill: document.getElementById('progress-fill'),
    
    statHours: document.getElementById('stat-hours'),
    statNext: document.getElementById('stat-next'),
    
    inputHours: document.getElementById('input-hours'),
    inputNote: document.getElementById('input-note'),
    btnLogHours: document.getElementById('btn-add-hours'),
    btnLogNote: document.getElementById('btn-add-note'),
    journalList: document.getElementById('journal-list')
};

// --- Functions ---

function saveToStorage() {
    localStorage.setItem('equipmentManagerData', JSON.stringify(storageData));
    updateStats();
}

function updateStats() {
    const data = storageData[currentDeviceId];
    elements.statHours.textContent = data.hours.toFixed(1);
    // maintenance every 20 hours
    const nextMaint = Math.ceil((data.hours + 0.1) / 20) * 20;
    elements.statNext.textContent = nextMaint.toFixed(1);
}

function renderDiagnosis() {
    const device = devices[currentDeviceId];
    const node = device.diag[currentDiagPath];
    
    const stepCount = history.length + 1;
    elements.currentStep.textContent = stepCount.toString().padStart(2, '0');
    elements.progressFill.style.width = `${Math.min(stepCount * 20, 100)}%`;

    if (node.isResult) {
        elements.questionArea.classList.add('hidden');
        elements.resultArea.classList.remove('hidden');
        elements.resultTitle.textContent = node.title;
        elements.resultDescription.textContent = node.description;
        elements.actionList.innerHTML = node.actions.map(a => `<li>${a}</li>`).join('');
    } else {
        elements.questionArea.classList.remove('hidden');
        elements.resultArea.classList.add('hidden');
        elements.questionText.textContent = node.question;
        elements.optionsContainer.innerHTML = '';
        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => {
                history.push(currentDiagPath);
                currentDiagPath = opt.next;
                renderDiagnosis();
            };
            elements.optionsContainer.appendChild(btn);
        });
    }
}

function renderMaint() {
    const device = devices[currentDeviceId];
    let html = `<div class="maint-card">
        <div class="maint-icon">${currentDeviceId === 'brushcutter' ? '🔧' : '⛓️'}</div>
        <h2>${device.name} 定期点検項目</h2>
        <p class="maint-intro">定期的な点検が機械の寿命を延ばし、安全を保ちます。</p>`;
    
    device.maint.forEach(group => {
        html += `<div class="checklist-group">
            <h3>${group.group}</h3>
            <div class="checklist">`;
        group.items.forEach(item => {
            html += `<label class="check-item"><input type="checkbox"> <span class="check-text">${item}</span></label>`;
        });
        html += `</div></div>`;
    });
    
    html += `</div>`;
    elements.maintContent.innerHTML = html;
}

function renderJournal() {
    const data = storageData[currentDeviceId];
    elements.journalList.innerHTML = data.logs.slice().reverse().map(log => `
        <li class="journal-item">
            <span class="journal-date">${log.date}</span>
            <span class="journal-text">${log.text}</span>
            <span class="journal-val">${log.val || ''}</span>
        </li>
    `).join('');
}

function addLog(text, val) {
    const date = new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
    storageData[currentDeviceId].logs.push({ date, text, val });
    saveToStorage();
    renderJournal();
}

function switchDevice(id) {
    currentDeviceId = id;
    currentDiagPath = 'start';
    history = [];
    
    elements.deviceBrushcutter.classList.toggle('active', id === 'brushcutter');
    elements.deviceChainsaw.classList.toggle('active', id === 'chainsaw');
    
    renderDiagnosis();
    renderMaint();
    renderJournal();
    updateStats();
}

function generateGCalLink() {
    const device = devices[currentDeviceId];
    const data = storageData[currentDeviceId];
    const nextHours = Math.ceil((data.hours + 0.1) / 20) * 20;
    const title = encodeURIComponent(`${device.name} メンテナンス点検 (${nextHours}h目安)`);
    const details = encodeURIComponent(`累積使用時間 ${data.hours}h。20時間ごとの定期点検時期です。 エアクリーナー、プラグ、各部ネジの確認を行ってください。`);
    
    // Future date: 3 months from now as a placeholder
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    const dateStr = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dateRange = `${dateStr}/${dateStr}`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateRange}`;
}

// --- Event Listeners ---

elements.btnHome.onclick = () => {
    elements.sectionDiag.classList.remove('hidden');
    elements.sectionMaint.classList.add('hidden');
    elements.sectionJournal.classList.add('hidden');
    elements.btnHome.classList.add('active');
    elements.btnMaint.classList.remove('active');
    elements.btnJournal.classList.remove('active');
};

elements.btnMaint.onclick = () => {
    elements.sectionDiag.classList.add('hidden');
    elements.sectionMaint.classList.remove('hidden');
    elements.sectionJournal.classList.add('hidden');
    elements.btnHome.classList.remove('active');
    elements.btnMaint.classList.add('active');
    elements.btnJournal.classList.remove('active');
};

elements.btnJournal.onclick = () => {
    elements.sectionDiag.classList.add('hidden');
    elements.sectionMaint.classList.add('hidden');
    elements.sectionJournal.classList.remove('hidden');
    elements.btnHome.classList.remove('active');
    elements.btnMaint.classList.remove('active');
    elements.btnJournal.classList.add('active');
};

elements.deviceBrushcutter.onclick = () => switchDevice('brushcutter');
elements.deviceChainsaw.onclick = () => switchDevice('chainsaw');

document.getElementById('btn-restart').onclick = () => {
    currentDiagPath = 'start';
    history = [];
    renderDiagnosis();
};

document.getElementById('btn-gcal').onclick = () => {
    window.open(generateGCalLink(), '_blank');
};

elements.btnLogHours.onclick = () => {
    const h = parseFloat(elements.inputHours.value);
    if (!isNaN(h) && h > 0) {
        storageData[currentDeviceId].hours += h;
        addLog(`作業実施 (${h}時間)`, `+${h}h`);
        elements.inputHours.value = '';
    }
};

elements.btnLogNote.onclick = () => {
    const note = elements.inputNote.value.trim();
    if (note) {
        addLog(note, "整備");
        elements.inputNote.value = '';
    }
};

// --- Init ---
switchDevice('brushcutter');
updateStats();
renderJournal();
