const Rezervari_Protap = 'Sheet1'; // Asigură-te că foaia ta se numește așa

// Funcția asta trimite site-ului tău datele deja ocupate (pentru a le bloca)
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(Rezervari_Protap);
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues(); 
  
  let dateOcupate = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] != "") {
      // Formatăm data pentru a fi comparată ușor cu site-ul
      let dateObj = new Date(data[i][0]);
      let formattedDate = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
      dateOcupate.push(formattedDate);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(dateOcupate)).setMimeType(ContentService.MimeType.JSON);
}

// Funcția asta primește programarea nouă de pe site și o scrie în tabel
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(Rezervari_Protap);
  const body = JSON.parse(e.postData.contents);
  
  // Adăugăm un rând nou
  sheet.appendRow([body.data, body.nume, body.telefon]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "succes"})).setMimeType(ContentService.MimeType.JSON);
}
