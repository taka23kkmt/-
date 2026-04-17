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
            choke_ok_but_fails: {
                question: "初爆後、チョークを戻して（開けて）引きましたか？",
                options: [
                    { text: "戻して引いてもかからない", next: "check_plug" },
                    { text: "チョークを閉じたまま引き続けた", next: "plug_flooded" }
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
            starts_then_stops: {
                question: "エンジンがかかった直後、どのような状態ですか？",
                options: [
                    { text: "チョークを閉じると動くが開けると止まる", next: "carb_lean" },
                    { text: "数秒でエンストする", next: "fuel_flow_issue" }
                ]
            },
            low_power: {
                question: "エアクリーナーを確認してください。状態は？",
                options: [
                    { text: "汚れている・目詰まりしている", next: "air_filter_clogged" },
                    { text: "きれいな状態", next: "exhaust_clogged" }
                ]
            },
            noise_vibration: {
                question: "異音・振動の種類はどれに近いですか？",
                options: [
                    { text: "金属がぶつかるような異音がする", next: "blade_damaged" },
                    { text: "ガタガタと激しく振動する", next: "mount_loose" }
                ]
            },
            // Results
            engine_seized: { isResult: true, title: "エンジンの焼き付き", description: "ピストンやシリンダーが固着しています。オイル不足が原因です。", actions: ["修理店に持ち込んでください。シリンダー交換が必要です。"] },
            starter_broken: { isResult: true, title: "スターターの不具合", description: "ゼンマイの折れ、あるいは爪が噛み合っていません。", actions: ["スターターアッセンブリーを分解清掃するか、交換してください。"] },
            stale_fuel: { isResult: true, title: "燃料の劣化", description: "古い燃料はキャブレターを詰まらせます。", actions: ["古い燃料を捨て、新しい混合燃料に入れ替えてください。"] },
            plug_flooded: { isResult: true, title: "燃料かぶり", description: "内部に燃料が溜まりすぎでいます。", actions: ["プラグを外し、清掃・乾燥させてから再度始動してください。"] },
            plug_dirty: { isResult: true, title: "プラグの汚れ", description: "火花が弱くなっています。", actions: ["プラグを磨くか、新品に交換してください。"] },
            carb_clogged: { isResult: true, title: "キャブレター詰まり", description: "内部のノズルが詰まっています。", actions: ["キャブレタークリーナーで洗浄するか、ダイヤフラム等を交換してください。"] },
            carb_lean: { isResult: true, title: "キャブレターの燃調不良（薄い）", description: "混合気が薄すぎます。キャブレター内部の詰まりが原因です。", actions: ["キャブレタークリーナーでメインノズルを洗浄してください。改善しない場合はダイヤフラムを交換してください。"] },
            fuel_flow_issue: { isResult: true, title: "燃料供給の不良", description: "タンクからキャブレターへの燃料供給が不安定です。", actions: ["燃料フィルターを新品に交換してください。燃料ホースに詰まりや亀裂がないか確認してください。"] },
            air_filter_clogged: { isResult: true, title: "エアクリーナーの目詰まり", description: "空気の吸入量が不足し、エンジン出力が低下しています。", actions: ["エアクリーナーを取り外し、清掃または交換してください。"] },
            exhaust_clogged: { isResult: true, title: "マフラー（排気口）の詰まり", description: "カーボン堆積により排気が妨げられています。", actions: ["マフラーを外し、排気ポートとマフラー内のカーボンを除去してください。"] },
            blade_damaged: { isResult: true, title: "刃・取付部の損傷", description: "チップソーの欠けまたは取付ボルトの緩みが原因です。", actions: ["エンジンを止めて刃の状態を確認し、欠けがあれば交換してください。取付ボルトも増し締めしてください。"] },
            mount_loose: { isResult: true, title: "各部の緩み・ギヤケース不良", description: "エンジンやハンドルの取付部、またはギヤケース内部のベアリングが摩耗しています。", actions: ["全ネジ・ボルトを締め直してください。改善しない場合はギヤケースを点検・交換してください。"] }
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
            choke_ok_but_fails: {
                question: "初爆後、チョークを戻して（開けて）引きましたか？",
                options: [
                    { text: "戻して引いてもかからない", next: "check_plug" },
                    { text: "チョークを閉じたまま引き続けた", next: "plug_flooded" }
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
            stale_fuel: { isResult: true, title: "燃料の劣化", description: "古い燃料はキャブレターを詰まらせます。", actions: ["古い燃料を捨て、新しい燃料に入れ替えてください。"] },
            plug_flooded: { isResult: true, title: "燃料かぶり", description: "内部に燃料が溜まりすぎでいます。", actions: ["プラグを外し、清掃・乾燥させてから再度始動してください。"] },
            plug_dirty: { isResult: true, title: "プラグの汚れ", description: "火花が弱くなっています。", actions: ["プラグのカーボンを落とすか、新品に交換してください。"] },
            carb_clogged: { isResult: true, title: "キャブレター詰まり", description: "内部のノズルが詰まっています。", actions: ["キャブレタークリーナーで洗浄するか、ダイヤフラムを交換してください。"] },
            clutch_broken: { isResult: true, title: "クラッチスプリングの破損", description: "遠心クラッチのバネが切れています。", actions: ["クラッチ部分を分解し、スプリングを交換してください。"] },
            brake_engaged_or_frozen: { isResult: true, title: "ブレーキ固着・内部破損", description: "ブレーキバンド等の不具合です。", actions: ["ブレーキ周りの清掃を行い、改善しない場合は要修理です。"] },
            oil_path_clogged: { isResult: true, title: "オイル経路の詰まり", description: "おが屑がオイル出口を塞いでいます。", actions: ["ガイドバーを外し、オイル出口を清掃してください。"] },
            oil_flow_adj: { isResult: true, title: "オイル吐出量の調整不足", description: "オイルポンプの設定が低すぎます。", actions: ["本体底面の調整ネジを回して吐出量を増やしてください。"] },
            uneven_sharpening: { isResult: true, title: "目立ての不均一", description: "左右の刃の長さが異なると曲がります。", actions: ["全ての刃を揃えるように目立てをし直してください。"] },
            depth_gauge_high: { isResult: true, title: "デプスゲージが高すぎる", description: "刃が食い込みません。", actions: ["平ヤスリでデプスゲージを規定の高さまで削ってください。"] }
        },
        maint: [
            { group: "1. 使用前点検", items: ["チェンブレーキの作動確認", "チェンの張り調整", "オイル供給の確認"] },
            { group: "2. 定期整備", items: ["エアクリーナーの清掃", "ガイドバーの溝清掃", "フィルタの点検"] }
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
    
    if (!node) {
        console.error("Node not found:", currentDiagPath);
        elements.questionText.textContent = "エラー：診断データが見つかりません。";
        elements.optionsContainer.innerHTML = '<button class="option-btn" onclick="location.reload()">最初からやり直す</button>';
        return;
    }

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
