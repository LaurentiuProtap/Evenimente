// ==========================================================
// PUNE AICI LINK-UL GENERAT DE GOOGLE APPS SCRIPT (Deploy > Web app)
// Trebuie să se termine în /exec
// ==========================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3HgnxN207giL5INJujsgn3T9ESR3s7eSf7sd5HjHBV7yTvCQFr0WSAxan7vu9Zg2e/exec"; 

let dateOcupate = []; // se va umple automat din Google Sheets

const inputData = document.getElementById('data-rezervare');
const mesajStatus = document.getElementById('mesaj-status');
const form = document.getElementById('form-rezervare');

// Setăm data minimă ca fiind ziua de azi
const azi = new Date().toISOString().split('T')[0];
inputData.setAttribute('min', azi);

// La încărcarea paginii, luăm datele deja ocupate din Google Sheets
function incarcaDateOcupate() {
    if (GOOGLE_SCRIPT_URL === "URL_UL_TAU_AICI") return; // nu a fost configurat încă

    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            dateOcupate = data;
        })
        .catch(err => {
            console.error("Nu am putut încărca datele ocupate:", err);
        });
}
incarcaDateOcupate();

// Verificăm data când clientul o selectează
inputData.addEventListener('change', function() {
    if (dateOcupate.includes(this.value)) {
        mesajStatus.innerHTML = "<span class='eroare'>Ne pare rău, această dată este deja rezervată sau indisponibilă. Te rugăm să alegi altă zi.</span>";
        this.value = '';
    } else {
        mesajStatus.innerHTML = "";
    }
});

// Trimiterea reală a rezervării către Google Sheets
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL === "URL_UL_TAU_AICI") {
        mesajStatus.innerHTML = "<span class='eroare'>Formularul nu este încă conectat. Adaugă link-ul Google Script în cod.</span>";
        return;
    }

    const data = inputData.value;
    const nume = document.getElementById('nume').value;
    const telefon = document.getElementById('telefon').value;

    if (dateOcupate.includes(data)) {
        mesajStatus.innerHTML = "<span class='eroare'>Această dată tocmai a fost rezervată de altcineva. Alege altă zi.</span>";
        return;
    }

    const btn = this.querySelector('button');
    btn.innerText = "Se procesează...";
    btn.disabled = true;
    mesajStatus.innerHTML = "";

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ data: data, nume: nume, telefon: telefon })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "succes") {
            mesajStatus.innerHTML = "<span class='succes'>Cererea a fost trimisă cu succes! Te vom contacta în scurt timp.</span>";
            dateOcupate.push(data);
            form.reset();
        } else {
            mesajStatus.innerHTML = "<span class='eroare'>A apărut o eroare. Încearcă din nou sau sună-ne direct.</span>";
        }
    })
    .catch(err => {
        console.error(err);
        mesajStatus.innerHTML = "<span class='eroare'>Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou.</span>";
    })
    .finally(() => {
        btn.innerText = "Trimite Solicitarea";
        btn.disabled = false;
    });
});
