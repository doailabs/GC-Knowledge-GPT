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
    "columns": {
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
        "default": 0.85, // Actualiza esto con el valor por defecto que tienes en la tabla HTML
        "minimum": 0,
        "maximum": 1
      },
      "No Match Behavior": {
        "title": "No Match Behavior",
        "type": "string",
        "$id": "/properties/NoMatchBehavior",
        "minLength": 0,
        "maxLength": 36000
      },
      "Create knowledge articles based on wrap ups": {
        "name": "Create knowledge articles based on wrap ups",
        "type": "boolean",
        "$id": "/properties/CreateKnowledgeArticles",
        "default": false
      },
      "Wrap up ids for knowledge articles": {
        "name": "Wrap up ids for knowledge articles",
        "type": "string",
        "$id": "/properties/WrapUpIdsForArticles",
      }  
    }
  };

  try {
    const response = await apiInstance.postFlowsDatatables(dataTableSchema);
    return response;
  } catch (error) {
    console.error('Error al crear la DataTable:', error);
  }
}

async function insertConfigurationRow(dataTableId, configNumber, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds) {
  const newRow = {
    "Configuration Number": configNumber,
    "Knowledge Base Id": knowledgeBaseId,
    "System prompt": systemPrompt,
    "Language": language,
    "Minimum answer confidence": minAnswerConfidence,
    "No match behavior": noMatchBehavior,
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Wrap up ids for knowledge articles": wrapUpIds
  };

  const rowData = {
    "action": "append",
    "data": [newRow]
  };

  await createRow(dataTableId, rowData);
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
  const minAnswerConfidence = document.getElementById('minAnswerConfidence').value;
  const noMatchBehavior = document.getElementById('noMatchBehavior').value;
  const createKnowledgeArticles = document.getElementById('createKnowledgeArticles').checked;
  const wrapUpIds = document.getElementById('wrapUpIds').value;

  if (!knowledgeBaseId || !systemPrompt || !language || !minAnswerConfidence || !noMatchBehavior) {
    alert('Please fill in all required fields.');
    return;
  }

  const dataTableId = await getConfigurationDataTableId();

  if (!dataTableId) {
    await createConfigurationDataTable();
  }

  const newConfigNumber = await getNextConfigurationNumber(dataTableId);

  await insertConfigurationRow(dataTableId, newConfigNumber, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds);

  alert('Configuration saved.');

  // Clear input fields
  document.getElementById('knowledgeBaseId').value = '';
  document.getElementById('systemPrompt').value = '';
  document.getElementById('minAnswerConfidence').value = 0.85;
  document.getElementById('createKnowledgeArticles').checked = false;
  document.getElementById('wrapUpIds').value = '';
  toggleWrapUpIdsField(); // Hide the Wrap up ids field
}


function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  const saveConfigurationBtn = document.getElementById('saveConfigurationBtn');

  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
  saveConfigurationBtn.addEventListener('click', handleSaveConfigurationButtonClick);
}

