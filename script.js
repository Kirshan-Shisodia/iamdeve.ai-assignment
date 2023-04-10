const BASE_URL = "https://test.iamdave.ai";
const HEADERS = {
  "Content-Type": "application/json",
  "X-I2CE-ENTERPRISE-ID": "dave_vs_covid",
  "X-I2CE-USER-ID": "ananth+covid@i2ce.in",
  "X-I2CE-API-KEY": "0349234-38472-1209-2837-3432434",
};

// Keep track of the current page number
let currentPage = 1;

async function fetchSuppliers(
  category,
  channel,
  state,
  pageNumber = currentPage
) {
  let url = `${BASE_URL}/list/supply?_page_number=${pageNumber}`;

  if (category) {
    url += `&category=${category}`;
  } else if (state) {
    url += `&state=${state}`;
  } else if (channel) {
    url += `&channel=${channel}`;
  }

  const response = await fetch(url, { headers: HEADERS });
  const data = await response.json();
  console.log(data);
  return data;
}

// Get the supplier container element
const supplierContainer = document.querySelector("#supplier-container");

async function displaySuppliers(category, channel, state) {
  // Fetch the supplier data from the API
  const data = await fetchSuppliers(category, channel, state);

  // Get the array of suppliers
  const suppliers = data.data;

  // Clear the supplier container
  supplierContainer.innerHTML = "";

  // Loop through the array of suppliers and create a card for each one
  suppliers.forEach((supplier) => {
    // Create a new div element for the card
    const card = document.createElement("div");
    card.classList.add("supplier-card");

    // Add the supplier information to the card
    card.innerHTML = `
      <h2>${supplier.category}</h2>
      <p>${supplier.channel}</p>
      <p>${supplier.request_description}</p>
      <p>${supplier.contact_numbers}</p>
      <p>${supplier.state}</p>
      <p>${supplier.district}</p>
      <p>${supplier.source_time}</p>
    `;

    // Append the card to the supplier container
    supplierContainer.appendChild(card);
  });

  // Check if it is the last page of suppliers
  if (data.is_last) {
    // Disable or hide the pagination button
    paginationButton.disabled = true;
  } else {
    // Enable the pagination button
    paginationButton.disabled = false;
  }
}

// Create a button for pagination
const paginationButton = document.createElement("button");
paginationButton.textContent = "Load More";
paginationButton.addEventListener("click", () => {
  // Increment the current page number
  currentPage++;
  const category = document.getElementById("category").value;
  const state = document.getElementById("state").value;
  const channel = document.getElementById("channel").value;
  displaySuppliers(category, state, channel);
});

// Append the pagination button to the body
document.body.appendChild(paginationButton);

function handleOnChangeCategory() {
  const category = document.getElementById("category").value;
  currentPage = 1;
  displaySuppliers(category, "", "");
}

function handleOnChangeChannel() {
  const channel = document.getElementById("channel").value;
  currentPage = 1;
  displaySuppliers("", channel, "");
}

function handleOnChangestate() {
  const state = document.getElementById("state").value;
  currentPage = 1;
  displaySuppliers("", "", state);
}

// Fetch and display the suppliers on page load
displaySuppliers();
