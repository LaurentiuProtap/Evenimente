// =========================================================================
// CONFIGURARE WEB3FORMS
// 1. Intră pe https://web3forms.com
// 2. Introduce e-mailul tău în căsuță și apasă pe "Create Access Key"
// 3. Verifică-ți e-mailul, copiază cheia primită și pune-o între ghilimele mai jos:
// =========================================================================
const WEB3FORMS_ACCESS_KEY = "8c6d3148-3b83-4aee-88ac-cae3943ed19a"; 

// Dacă vrei să blochezi manual anumite zile din cod, le adaugi în listă (Format YYYY-MM-DD)
// Exemplu: data de 4 Mai este blocată
let dateOcupate = ['2026-05-04']; 

const inputData = document.getElementById('data-rezervare');
const mesajStatus = document.getElementById('mesaj-status');
const form = document.getElementById('form-rezervare');

// Setăm automat data minimă ca fiind ziua de azi (să nu poată rezerva în trecut)
const azi = new Date().toISOString().split('T')[0];
inputData.setAttribute('min', azi);

// Verificăm dacă data aleasă de client este pe lista celor blocate
inputData.addEventListener('change', function() {
    if (dateOcupate.includes(this.value)) {
        mesajStatus.innerHTML = "<span class='eroare'>Ne pare rău, această dată este deja rezervată sau indisponibilă. Te rugăm să alegi altă zi.</span>";
        this.value = '';
    } else {
        mesajStatus.innerHTML = "";
    }
});

// Trimiterea formularului prin Web3Forms direct pe e-mail
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Verificare siguranță dacă ai uitat să schimbi cheia
    if (WEB3FORMS_ACCESS_KEY === "AICI_PUI_CHEIA_PRIMITA_PE_EMAIL") {
        mesajStatus.innerHTML = "<span class='eroare'>Eroare de configurare! Adaugă cheia de la Web3Forms în fișierul script.js.</span>";
        return;
    }

    const dataSelectata = inputData.value;
    const numeClient = document.getElementById('nume').value;
    const telefonClient = document.getElementById('telefon').value;

    // Verificăm din nou data chiar și la trimitere
    if (dateOcupate.includes(dataSelectata)) {
        mesajStatus.innerHTML = "<span class='eroare'>Această dată este ocupată. Reîmprospătează pagina și alege altă zi.</span>";
        return;
    }

    const btn = this.querySelector('button');
    btn.innerText = "Se trimite solicitarea...";
    btn.disabled = true;
    mesajStatus.innerHTML = "";

    // Construim obiectul cu datele care îți vor apărea în e-mail
    const dateFormular = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Rezervare Nouă Proțap - ${numeClient}`,
        from_name: "Site-ul tău de Booking",
        "Nume Client": numeClient,
        "Telefon Contact": telefonClient,
        "Data Evenimentului": dataSelectata
    };

    // Trimitem datele către API-ul Web3Forms utilizând Fetch
    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(dateFormular)
    })
    .then(async (response) => {
        let rezultat = await response.json();
        if (response.status == 200) {
            mesajStatus.innerHTML = "<span class='succes'>Cererea a fost trimisă cu succes! Te vom contacta în cel mai scurt timp pentru confirmare.</span>";
            form.reset(); // Curățăm formularul
        } else {
            console.error(rezultat);
            mesajStatus.innerHTML = "<span class='eroare'>A apărut o eroare: " + rezultat.message + "</span>";
        }
    })
    .catch(error => {
        console.error(error);
        mesajStatus.innerHTML = "<span class='eroare'>Nu s-a putut trimite cererea. Verifică conexiunea la internet și încearcă din nou.</span>";
    })
    .finally(() => {
        // Resetăm butonul în starea inițială
        btn.innerText = "Trimite Solicitarea";
        btn.disabled = false;
    });
});
