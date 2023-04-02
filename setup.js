este es mi fichero setup.js completo:

const platformClient = require('platformClient');

// API Calls
async function getKnowledgeBases() {
  const apiInstance = new platformClient.KnowledgeApi();

  try {
    const response = await apiInstance.getKnowledgeKnowledgebases();
    return response.entities;
  } catch (error) {
    console.error('Error al obtener las Knowledge Bases:', error);
  }
}

async function findDataTableAndMaxConfigNumber() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.FlowApi();

  try {
    const response = await apiInstance.getFlowsDatatables();
    const targetDataTable = response.entities.find(
      (dataTable) => dataTable.name === 'Open AI - Knowledge Integration'
    );

    if (targetDataTable) {
      const dataTableDetails = await apiInstance.getFlowsDatatablesDatatableId(targetDataTable.id);
      const maxConfigNumber = Math.max(
        ...dataTableDetails.rows.map((row) => row.fields['Config Number'])
      );

      return {
        dataTableId: targetDataTable.id,
        maxConfigNumber
      };
    }
  } catch (error) {
    console.error('Error al obtener las DataTables y el maxConfigNumber:', error);
  }

  return {
    dataTableId: null,
    maxConfigNumber: null
  };
}

async function createDataTable() {
  const apiInstance = new platformClient.FlowApi();

  const dataTableSchema = {
    "name": "Open AI - Knowledge Integration",
    "columns": [
      "key": {
        "title": "configNumber",
        "type": "string",
        "$id": "/properties/key",
        "displayOrder": 0,
        "minLength": 1,
        "maxLength": 256
      },
      "Knowledge Base ID": {
        "title": "Knowledge Base ID",
        "type": "string",
        "$id": "/properties/KnowledgeBaseID",
        "minLength": 0,
        "maxLength": 36
      },
      "System Prompt": {
        "title": "System Prompt",
        "type": "string",
        "$id": "/properties/SystemPrompt",
        "minLength": 0,
        "maxLength": 36000
      },	  
      "Minimum Answer Confidence": {
        "title": "Minimum Answer Confidence",
        "type": "number",
        "$id": "/properties/MinimumAnswerConfidence",
        "default": <el valor introducido como default value en la tabla html para el campo Minimum Answer Confidence>,
        "minimum": 0,
        "maximum": 1
      },
      "No Match Behavior": {
        "title": "No Match Behavior",
        "type": "string",
        "$id": "/properties/NoMatchBehavior",
        "minLength": 0,
        "maxLength": 36000
      }
    ]
  };

  try {
    const response = await apiInstance.postFlowsDatatables(dataTableSchema);
    return response;
  } catch (error) {
    console.error('Error al crear la DataTable:', error);
  }
}


async function insertConfigurationRow(dataTableId, configNumber, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior) {
  const apiInstance = new platformClient.FlowApi();

  const newRow = {
    "Config Number": configNumber,
    "Knowledge Base ID": knowledgeBaseId,
    "System Prompt": systemPrompt,
    "Language": language,
    "Minimum Answer Confidence": minAnswerConfidence,
    "No Match Behavior": noMatchBehavior
  };

  try {
    const response = await apiInstance.postFlowsDatatablesRows(dataTableId, newRow);
    return response;
  } catch (error) {
    console.error('Error al insertar la fila en la DataTable:', error);
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

async function handleSaveConfigurationButtonClick() {
  const knowledgeBaseId = document.getElementById('knowledgeBaseId').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  const language = document.getElementById('language').value;
  const minAnswerConfidence = parseFloat(document.getElementById('minAnswerConfidence').value);
  const noMatchBehavior = document.getElementById('noMatchBehavior').value;

  if (!knowledgeBaseId || !systemPrompt || !language || !minAnswerConfidence || !noMatchBehavior) {
    let missingFields = [];

    if (!knowledgeBaseId) missingFields.push('Knowledge Base ID');
    if (!systemPrompt) missingFields.push('System Prompt');
    if (!language) missingFields.push('Language');
    if (!minAnswerConfidence) missingFields.push('Minimum Answer Confidence');
    if (!noMatchBehavior) missingFields.push('No match behavior');

    alert('All fields must be filled: ' + missingFields.join(', '));
    return;
  }

  const existingDataTable = await findDataTable('Open AI - Knowledge Integration');
  let dataTableId = null;
  let maxConfigNumber = 0;

  if (existingDataTable) {
    dataTableId = existingDataTable.id;
    const rows = await getDataTableRows(dataTableId);
    rows.forEach(row => {
      if (row.configNumber > maxConfigNumber) {
        maxConfigNumber = row.configNumber;
      }
    });
  } else {
    const createdDataTable = await createDataTable();
    dataTableId = createdDataTable.id;
  }

  const newConfigNumber = maxConfigNumber + 1;
  await insertConfigurationRow(dataTableId, newConfigNumber, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior);

  alert('Configuration saved successfully.');
}


function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  const saveConfigurationBtn = document.getElementById('saveConfigurationBtn');

  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
  saveConfigurationBtn.addEventListener('click', handleSaveConfigurationButtonClick);
}


dime si el código cumple los requisitos descritos para el campo "No match behavior"
