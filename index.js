const COHORT = "2408-DEMO2-QIANNI_ZHANG";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

// === State ===

let parties = [];

// NOTE: This solution uses arrow function syntax!

/** Updates state with parties from the API */
const getParties = async () => {
  try {
    const response = await fetch(API_URL);
    const parsed = await response.json();

    if (!response.ok) {
      throw new Error(parsed.error.message);
    }

    parties = parsed.data;
    
  } catch (e) {
    console.error(e);
  }
};

/** Sends a POST request to the API */
const addParty = async (party) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });
    if (!response.ok) {
      const parsed = await response.json();
      throw new Error(parsed.error.message);
    }
  } catch (e) {
    console.error(e);
  }
};

/** Sends a DELETE request to the API for the selected party */
const deleteParty = async (id) => {
  try {
    const response = await fetch(API_URL + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      const parsed = await response.json();
      throw new Error(parsed.error.message);
    }
  } catch (e) {
    console.error(e);
  }
};

// === Render ===

/** Renders the parties in state as a list */
const renderParties = () => {
  const $partyList = document.querySelector("ul.parties");

  if (!parties.length) {
    $partyList.innerHTML = `
      <li>No parties near you :(</li>
    `;
    return;
  }

  const $parties = parties.map((party) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
      <h2>${party.name}</h2>
      <time datetime="${party.date}">${party.date}</time>
      <address>${party.location}</address>
      <p>${party.description}</p>
      <button>Delete Party</button>
    `;

    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
      await deleteParty(party.id);
      await getParties();
      renderParties();
    });

    return $li;
  });

  $partyList.replaceChildren(...$parties);
};

// === Script ===
const init = async () => {
  await getParties();
  renderParties();
};

init();

// Add a new party when form is submitted
const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = new Date($form.date.value).toISOString();
  const party = {
    name: $form.name.value,
    description: $form.description.value,
    date,
    location: $form.location.value,
  };

  await addParty(party);

  await getParties();
  renderParties();
});