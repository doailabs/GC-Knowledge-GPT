const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

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
  let apiInstance = new platformClient.ArchitectApi();

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
  let apiInstance = new platformClient.ArchitectApi();
  const dataTableSchema = {  
   "$schema":"http://json-schema.org/draft-04/schema#",
   "additionalProperties":false,
   "name":"Open AI - Knowledge Integration",
   "type":"object",
   "schema":{
      "$schema":"http://json-schema.org/draft-04/schema#",
      "type":"object",
      "additionalProperties":false,
      "properties":{  
        "key": {
          "title": "Knowledge Base ID",
          "type": "string",
          "$id": "/properties/key",
          "displayOrder": 0,
          "minLength": 1,
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
          "default": 0.85,
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
          "title": "Create knowledge articles based on wrap ups",
          "type": "boolean",
          "$id": "/properties/CreateKnowledgeArticles",
          "default": false
        },
        "Wrap up ids for knowledge articles": {
          "title": "Wrap up ids for knowledge articles",
          "type": "string",
          "$id": "/properties/WrapUpIdsForArticles"
        },
        "Model": {
          "title": "Model",
          "type": "string",
          "$id": "/properties/Model",
          "default": "gpt-3.5-turbo"
        },
        "Temperature": {
          "title": "Temperature",
          "type": "number",
          "$id": "/properties/Temperature",
          "default": 0,
          "minimum": 0,
          "maximum": 1
        },
        "MaxTokens": {
          "title": "Max Tokens",
          "type": "integer",
          "$id": "/properties/MaxTokens",
          "default": 512
        }        
      },
      "required":[
         "key"
      ]
   }
  };

  try {
    const response = await apiInstance.postFlowsDatatables(dataTableSchema);
    return response;
  } catch (error) {
    console.error('Error al crear la DataTable:', error);
  }
}

async function insertConfigurationRow(dataTableId, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, temperature, maxTokens) {
  const newRow = {
    "Knowledge Base Id": knowledgeBaseId,
    "System prompt": systemPrompt,
    "Language": language,
    "Minimum answer confidence": minAnswerConfidence,
    "No match behavior": noMatchBehavior,
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Wrap up ids for knowledge articles": wrapUpIds,
    "Model": model,
    "Temperature": temperature,
    "Max Tokens": maxTokens    
  };

  const rowData = {
    "action": "append",
    "data": [newRow]
  };

  await createRow(dataTableId, rowData);
}

async function createRow(dataTableId, rowData) {
  const apiInstance = new platformClient.ArchitectApi();

  try {
    await apiInstance.postFlowsDatatableRows(dataTableId, rowData.data);
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

async function getConfigurationDataTableId() {
  const { dataTableId } = await findDataTableAndMaxConfigNumber();
  return dataTableId;
}

async function createConfigurationDataTable() {
  const dataTable = await createDataTable();
  return dataTable.id;
}

async function handleSaveConfigurationButtonClick() {
  const knowledgeBaseId = document.getElementById('knowledgeBaseId').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  const language = document.getElementById('language').value;
  const minAnswerConfidence = document.getElementById('minAnswerConfidence').value;
  const noMatchBehavior = document.getElementById('noMatchBehavior').value;
  const createKnowledgeArticles = document.getElementById('createKnowledgeArticles').checked;
  const wrapUpIds = document.getElementById('wrapUpIds').value;
  const model = document.getElementById('model').value;
  const temperature = document.getElementById('temperature').value;
  const maxTokens = document.getElementById('maxTokens').value;

  // Compruebe si todos los campos están llenos
  if (!knowledgeBaseId || !systemPrompt || !language || !minAnswerConfidence || !noMatchBehavior || !model || !temperature || !maxTokens) {
    alert('Please fill in all the configuration fields.');
    return;
  }

  let dataTableId = await getConfigurationDataTableId();

  if (!dataTableId) {
    dataTableId = await createConfigurationDataTable();
  }

  await insertConfigurationRow(dataTableId, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, temperature, maxTokens);

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

function toggleWrapUpIdsField() {
  const createKnowledgeArticlesCheckbox = document.getElementById('createKnowledgeArticles');
  const wrapUpIdsFieldWrapper = document.getElementById('wrapUpIdsFieldWrapper');

  if (createKnowledgeArticlesCheckbox.checked) {
    wrapUpIdsFieldWrapper.style.display = 'block';
  } else {
    wrapUpIdsFieldWrapper.style.display = 'none';
  }
}

function registerToggleWrapUpIdsFieldHandler() {
  const createKnowledgeArticlesCheckbox = document.getElementById('createKnowledgeArticles');
  createKnowledgeArticlesCheckbox.addEventListener('change', toggleWrapUpIdsField);
}

// Initialize
function init() {
  registerEventHandlers();
  registerToggleWrapUpIdsFieldHandler();
}

init();

