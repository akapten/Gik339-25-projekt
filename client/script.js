// Definiera API-slutpunktens URL
const url = "http://localhost:3000/bilr";

const bilForm = document.getElementById("bilForm");

window.addEventListener("load", fetchData);

function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((bilr) => {
      if (bilr.length > 0) {
        let html = "<section class='row'>";

        bilr.forEach((bil) => {
          html += `
          <div class="mb-3 col-12 col-md-6 col-lg-4"> 
            <div class="card">
              <div class="card-body" style="border: 5px solid ${bil.color.toLowerCase()};">
                <h5 class="card-title">${bil.model}</h5>
                <p class="card-text">Reg. number: ${bil.regnr}</p>
                <p class="card-text">Manufacturer: ${bil.mfr}</p>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-primary btn-sm me-2" onclick="deleteBilr(${
                    bil.id
                  })">Delete</button>
                  <button type="button" class="btn btn-primary btn-sm" onclick="setCurrentBilr(${
                    bil.id
                  })">Change</button>
                </div>
              </div>
            </div>
          </div>`;
        });

        html += "</section>";

        document.getElementById("cardContainer").innerHTML = html;

        modal("Upptaterad.");
        
      }
    });
}
function modal(message) {
  const feedbackModal = new bootstrap.Modal(document.getElementById("feedbackModal"), {
    keyboard: false,
  });

  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = `<p>${message}</p>`;

  feedbackModal.show();
}

//Som sätter nuvarande bil, när vi klickar på "Ändra"
function setCurrentBilr(id) {
  console.log("current", id);

  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((bil) => {
      console.log(bil);

      bilForm.regnr.value = bil.regnr;
      bilForm.model.value = bil.model;
      bilForm.mfr.value = bil.mfr;
      bilForm.color.value = bil.color;

      localStorage.setItem("currentId", bil.id);
    });
}
//Funktion för att ta bort en bil, går efter ID.
function deleteBilr(id) {
  console.log("delete", id);
  fetch(`${url}/${id}`, { method: "DELETE" }).then((result) => fetchData());
}

console.log(bilForm);
bilForm.addEventListener("submit", handleSubmit);
//Funktion som hanterar inskick av formuläter och skickar det till databasen
function handleSubmit(e) {
  e.preventDefault();
  const serverBilObject = {
    regnr: "",//samma namn som i databasen
    model: "",
    mfr: "",
    color: "",
  };// lägger från fälten till databasen
  serverBilObject.regnr = bilForm.regnr.value;
  serverBilObject.model = bilForm.model.value;
  serverBilObject.mfr = bilForm.mfr.value;
  serverBilObject.color = bilForm.color.value;

  const id = localStorage.getItem("currentId");
  if (id) {
    serverBilObject.id = id;
  }
 //Variabel för både post och put.
  const request = new Request(url, {
    method: serverBilObject.id ? "PUT" : "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(serverBilObject),
  });

  fetch(request).then((response) => {
    fetchData();

    localStorage.removeItem("currentId");
    bilForm.reset();
  });
}

const clearBilFormButton = document.querySelector("[name='clearBilForm']");
clearBilFormButton.addEventListener("click", handleClearForm);

function handleClearForm(e) {
  e.preventDefault();
  console.log("Clear button clicked!");
  bilForm.reset();
  localStorage.removeItem("currentId");
}
