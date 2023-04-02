// setup.js

// API Calls
async function getKnowledgeBases() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();

  try {
    const response = await apiInstance.getKnowledgeKnowledgebases();
    return response.entities;
  } catch (error) {
    console.error('Error al obtener las Knowledge Bases:', error);
  }
}

// Table Management
function createKnowledgeBasesTable(knowledgeBases) {
  const tableBody = document.getElementById('knowledgeBasesTableBody');

  knowledgeBases.forEach((knowledgeBase) => {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const radioCell = document.createElement('td');
    const radioInput = document.createElement('input');

    idCell.textContent = knowledgeBase.id;
    nameCell.textContent = knowledgeBase.name;

    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'knowledgeBaseRadio');
    radioInput.setAttribute('value', knowledgeBase.id);
    radioInput.addEventListener('change', handleKnowledgeBaseSelection);

    radioCell.appendChild(radioInput);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(radioCell);

    tableBody.appendChild(row);
  });
}

function updateKnowledgeBaseId(knowledgeBaseId) {
  const knowledgeBaseIdInput = document.getElementById('knowledgeBaseId');
  knowledgeBaseIdInput.value = knowledgeBaseId;
}

// Event Handlers
async function handleGetKnowledgeBasesButtonClick() {
  const knowledgeBases = await getKnowledgeBases();
  createKnowledgeBasesTable(knowledgeBases);
}

function handleKnowledgeBaseSelection(event) {
  updateKnowledgeBaseId(event.target.value);
}

function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
}
