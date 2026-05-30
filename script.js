// ==========================================
// PENGATURAN NOMOR HP KAMU 
// (Ganti angka di bawah sesuai nomor WA kamu. Wajib awali dengan 62)
// ==========================================
const NOMOR_WA = "628116502810"; 


// --- LOGIKA PUZZLE 1: GUITAR FRETBOARD ---
const chordsData = {
    'C':  [{str: 2, fret: 1}, {str: 4, fret: 2}, {str: 5, fret: 3}],
    'G':  [{str: 1, fret: 3}, {str: 5, fret: 2}, {str: 6, fret: 3}],
    'Am': [{str: 2, fret: 1}, {str: 3, fret: 2}, {str: 4, fret: 2}]
};
let chordOrder = ['C', 'G', 'Am'];
let currentChordIndex = 0;
let userSelection = [];

document.querySelectorAll('.note').forEach(note => {
    note.addEventListener('click', function() {
        const stringNum = parseInt(this.parentElement.getAttribute('data-string'));
        const fretNum = parseInt(this.getAttribute('data-fret'));
        
        // Aturan gitar asli: satu senar hanya bisa membunyikan 1 note pada fret tertentu
        this.parentElement.querySelectorAll('.note').forEach(n => n.classList.remove('selected'));
        
        const existingIndex = userSelection.findIndex(item => item.str === stringNum);
        
        if (existingIndex !== -1 && userSelection[existingIndex].fret === fretNum) {
            // Jika diklik note yang sama, maka matikan/batal pilih
            userSelection.splice(existingIndex, 1);
        } else {
            // Pilih note baru pada senar ini
            if (existingIndex !== -1) userSelection.splice(existingIndex, 1);
            this.classList.add('selected');
            userSelection.push({str: stringNum, fret: fretNum});
        }
    });
});

document.getElementById('btn-check-chord').addEventListener('click', () => {
    let targetChord = chordOrder[currentChordIndex];
    let requiredNotes = chordsData[targetChord];
    
    // Validasi kecocokan kunci gitar
    let isMatch = requiredNotes.every(req => 
        userSelection.some(user => user.str === req.str && user.fret === req.fret)
    ) && userSelection.length === requiredNotes.length;

    if (isMatch) {
        currentChordIndex++;
        if (currentChordIndex < chordOrder.length) {
            alert(`✨ Bagus sekali! Kunci ${targetChord} sukses. Lanjut bentuk kunci ${chordOrder[currentChordIndex]}!`);
            document.getElementById('target-chord').innerText = chordOrder[currentChordIndex];
            document.querySelectorAll('.note').forEach(n => n.classList.remove('selected'));
            userSelection = [];
        } else {
            alert("🎉 Hebat! Semua kunci gitar beres. Sekarang masuk ke puzzle kedua!");
            nextStep(2);
            initScratch();
        }
    } else {
        alert(`❌ Bentuk jari untuk kunci ${targetChord} belum pas, coba periksa letak senar dan fretnya lagi!`);
    }
});


// --- LOGIKA PUZZLE 2: GOSOK KERTAS LUKIS (SCRATCH EFFECT) ---
function initScratch() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.scratch-container');
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Background penutup (Warna abu-abu estetik minimalis dengan guratan tekstur)
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#546e7a';
    ctx.font = 'bold 15px Quicksand';
    ctx.textAlign = 'center';
    ctx.fillText('Gosok layar pakai jemari di sini ✨', canvas.width/2, canvas.height/2);

    let isDrawing = false;
    let totalScratched = 0;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        
        // Mendukung koordinat sentuhan HP maupun klik Mouse laptop
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2); // Ukuran lingkaran penggosok
        ctx.fill();
        
        totalScratched++;
        // Batasan minimal gosokan sebelum tombol lanjut muncul otomatis
        if (totalScratched > 120) { 
            document.getElementById('btn-next-sketch').classList.remove('hidden');
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}


// --- NAVIGASI ANTAR KARTU ---
function nextStep(stepNumber) {
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
}


// --- LOGIKA TOMBOL "TIDAK" PINTAR MENGHINDAR ---
const btnTidak = document.getElementById('btn-tidak');
const lariDariKlik = () => {
    const container = document.querySelector('.canvas');
    
    // Rumus agar tombol acak posisinya aman di dalam bingkai box utama saja
    const maxX = container.clientWidth - btnTidak.clientWidth - 30;
    const maxY = container.clientHeight - btnTidak.clientHeight - 80;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    btnTidak.style.left = `${randomX}px`;
    btnTidak.style.top = `${randomY}px`;
};

// Responsif untuk kursor PC/Laptop maupun usapan kilat tangan di HP
btnTidak.addEventListener('mouseover', lariDariKlik);
btnTidak.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    lariDariKlik();
});


// --- INTEGRASI WHATSAPP KIRIM OTOMATIS ---
function kirimWA() {
    const teksWA = "iya bang, aku maafin tapi jangan di ulang ya bang";
    const formatTeks = encodeURIComponent(teksWA);
    const tautanTujuan = `https://api.whatsapp.com/send?phone=${NOMOR_WA}&text=${formatTeks}`;
    window.open(tautanTujuan, '_blank');
}
