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
        
        this.parentElement.querySelectorAll('.note').forEach(n => n.classList.remove('selected'));
        
        const existingIndex = userSelection.findIndex(item => item.str === stringNum);
        
        if (existingIndex !== -1 && userSelection[existingIndex].fret === fretNum) {
            userSelection.splice(existingIndex, 1);
        } else {
            if (existingIndex !== -1) userSelection.splice(existingIndex, 1);
            this.classList.add('selected');
            userSelection.push({str: stringNum, fret: fretNum});
        }
    });
});

document.getElementById('btn-check-chord').addEventListener('click', () => {
    let targetChord = chordOrder[currentChordIndex];
    let requiredNotes = chordsData[targetChord];
    
    let isMatch = requiredNotes.every(req => 
        userSelection.some(user => user.str === req.str && user.fret === req.fret)
    ) && userSelection.length === requiredNotes.length;

    if (isMatch) {
        currentChordIndex++;
        if (currentChordIndex < chordOrder.length) {
            alert(` Bagus sekali, Kunci ${targetChord} sukses. Lanjut bentuk kunci ${chordOrder[currentChordIndex]}!`);
            document.getElementById('target-chord').innerText = chordOrder[currentChordIndex];
            document.querySelectorAll('.note').forEach(n => n.classList.remove('selected'));
            userSelection = [];
        } else {
            alert("🎉 Hebat, Semua kunci gitar beres. Sekarang masuk ke puzzle kedua");
            nextStep(2);
        }
    } else {
        alert(`❌ Bentuk jari untuk kunci ${targetChord} belum pas, coba periksa letak senar dan fretnya lagi`);
    }
});


// --- LOGIKA PUZZLE 2: KETUK UNTUK MEMBUKA FOTO (SUDAH DIPERBARUI) ---
let clickCount = 0;
function revealPhoto() {
    const overlay = document.getElementById('scratchOverlay');
    clickCount++;

    if (clickCount === 1) {
        overlay.style.backgroundColor = "rgba(207, 216, 220, 0.7)";
        overlay.innerText = "Ketuk lagi... 👁";
    } else if (clickCount === 2) {
        overlay.style.backgroundColor = "rgba(207, 216, 220, 0.4)";
        overlay.innerText = "Sedikit lagi... ";
    } else if (clickCount >= 3) {
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.display = "none";
        }, 300);
        // Memunculkan tombol lanjut
        document.getElementById('btn-next-sketch').classList.remove('hidden');
    }
}


// --- NAVIGASI ANTAR KARTU ---
function nextStep(stepNumber) {
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).add ? document.getElementById(`step${stepNumber}`).classList.add('active') : document.getElementById(`step${stepNumber}`).classList.add('active');
}


// --- LOGIKA TOMBOL "TIDAK" PINTAR MENGHINDAR ---
const btnToggle = document.getElementById('btn-tidak');
const lariDariKlik = () => {
    const container = document.querySelector('.canvas');
    
    const maxX = container.clientWidth - btnToggle.clientWidth - 30;
    const maxY = container.clientHeight - btnToggle.clientHeight - 80;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    btnToggle.style.left = `${randomX}px`;
    btnToggle.style.top = `${randomY}px`;
};

btnToggle.addEventListener('mouseover', lariDariKlik);
btnToggle.addEventListener('touchstart', (e) => {
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
