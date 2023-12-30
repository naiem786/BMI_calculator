// Get form elements
var ageInput = document.getElementById("age");
var heightInput = document.getElementById("height");
var weightInput = document.getElementById("weight");
var maleCheckbox = document.getElementById("m");
var femaleCheckbox = document.getElementById("f");
var form = document.getElementById("form");
var submitButton = document.getElementById("submit");

// Event listener for form submission
submitButton.addEventListener("click", validateForm);

// Function to validate form inputs
function validateForm() {
  if (
    ageInput.value === "" ||
    heightInput.value === "" ||
    weightInput.value === "" ||
    (maleCheckbox.checked === false && femaleCheckbox.checked === false)
  ) {
    alert("All fields are required!");
  } else {
    calculateBMI();
  }
}

// Event listener for BMI calculation
function calculateBMI() {
  // Gather user inputs
  var age = ageInput.value;
  var height = heightInput.value;
  var weight = weightInput.value;
  var gender = maleCheckbox.checked ? "male" : "female";

  // Reset the form
  //   form.reset();

  // Calculate BMI
  var bmi = calculateBMIValue(height, weight).toFixed(2);

  // Determine BMI category
  var result = getBMICategory(bmi);
  const data = {
    id: getIdToken() + 1,
    age,
    height,
    weight,
    gender,
    bmi,
  };
  incrmentIdToken();
  storeData(data);
  addRowToTable(data);
  displayResult(result,bmi)
}

// Function to calculate BMI value
function calculateBMIValue(height, weight) {
  return Number(weight) / ((Number(height) / 100) * (Number(height) / 100));
}

// Function to get BMI category
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (18.5 <= bmi && bmi <= 24.9) {
    return "Healthy";
  } else if (25 <= bmi && bmi <= 29.9) {
    return "Overweight";
  } else if (30 <= bmi && bmi <= 34.9) {
    return "Obese";
  } else if (35 <= bmi) {
    return "Extremely obese";
  }
}

// Function to display the result
function displayResult(category, bmiValue) {
  const resultParagraph = document.querySelector('.result')
  resultParagraph.innerHTML = `BMI: ${bmiValue} ${category}`
}

function getData() {
  const DATA = localStorage.getItem("data");
  if (DATA == null) localStorage.setItem("data", "[]");
  return JSON.parse(DATA) || [];
}
function storeData(data) {
  const _DATA = localStorage.getItem("data") || "[]";
  const DATA = JSON.parse(_DATA);
  console.log({ DATA });
  DATA.push(data);
  localStorage.setItem("data", JSON.stringify(DATA));
  return true;
}
function addRowToTable(newData) {
  const tableContainer = document.querySelector(".bmi-history");
  const table = tableContainer.querySelector(".bmi-history-table");
  console.log({ table });
  if (table) {
    // Create a new table row
    const newRow = document.createElement("tr");

    // Populate the new row with data
    Object.values(newData).forEach((value) => {
      const td = document.createElement("td");
      td.appendChild(document.createTextNode(value));
      newRow.appendChild(td);
    });
    const td = document.createElement("td");
    const actionBtn = document.createElement("button");
    actionBtn.innerHTML = "Delete";
    actionBtn.id = newData.id;
    actionBtn.onclick = () => {
		deleteHandler(actionBtn.id)
    };
    td.append(actionBtn);
    newRow.appendChild(td);

    // Add the new row to the table body
    const tbody = table.querySelector("tbody");
    tbody.appendChild(newRow);
  } else {
    console.log("No BMI history table found");
  }
}
function getIdToken() {
  return Number(localStorage.getItem("inc"));
}
function incrmentIdToken() {
  localStorage.setItem("inc", getIdToken() + 1);
}
function makeIdToken() {
  if (!getIdToken()) localStorage.setItem("inc", 0);
}
function renderDataInList() {
  const data = getData();

  const tableContainer = document.querySelector(".bmi-history"); // Assuming you have a container element in your HTML with the id 'bmi-history-container'

  // Create table element
  const table = document.createElement("table");
  table.className = "bmi-history-table"; // Optional: Add a class for styling

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Id", "Age", "Height", "Weight", "Gender", "BMI", "Action"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.appendChild(document.createTextNode(headerText));
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  // Populate table rows with data
  data.forEach((item) => {
    const row = document.createElement("tr");
    Object.values(item).forEach((value) => {
      const td = document.createElement("td");
      td.appendChild(document.createTextNode(value));
      row.appendChild(td);
    });
    const td = document.createElement("td");
    const actionBtn = document.createElement("button");
    actionBtn.innerHTML = "Delete";
    actionBtn.id = item.id;
    actionBtn.onclick = () => {
      console.log('hello',actionBtn.id);
	  deleteHandler(actionBtn.id)
    };
    td.append(actionBtn);
    row.appendChild(td);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  console.log({ tableContainer });
  // Add the table to the container
  tableContainer.innerHTML = ""; // Clear previous content
  tableContainer.appendChild(table);
}
function deleteHandler(id) {
	const data = getData().filter(data => data.id != id)
	console.log({data})
	localStorage.setItem('data',JSON.stringify(data))
	renderDataInList()
}
const historyBtn  = document.querySelector('#history-btn')
console.log()
function toggleHistory(){
  if(historyBtn.innerHTML == 'Show History'){
    renderDataInList()
    historyBtn.innerHTML = 'Hide History'
  }else{
  const tableContainer = document.querySelector(".bmi-history"); // Assuming you have a container element in your HTML with the id 'bmi-history-container'
    tableContainer.innerHTML = ''
    historyBtn.innerHTML = 'Show History'

  }
}
// renderDataInList();
makeIdToken();



