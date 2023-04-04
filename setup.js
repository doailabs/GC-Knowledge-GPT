const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

async function getKnowledgeBases() {
  const apiInstance = new platformClient.KnowledgeApi();

  try {
    const response = await apiInstance.getKnowledgeKnowledgebases();
    return response.entities;
  } catch (error) {
    console.error('Error al obtener las Knowledge Bases:', error);
  }
}

async function findDataTable() {
  let apiInstance = new platformClient.ArchitectApi();
  let opts = { 
    "name": "Open AI - Knowledge Integration"
  };

  try {
      const data = await apiInstance.getFlowsDatatablesDivisionviews(opts);

      if (data && data.entities && data.entities.length > 0) {
        const dataTableId = data.entities[0].id;
        console.log('dataTableId encontrado: ' + dataTableId);
        return dataTableId;
      } else {
        console.log('No se encontró la dataTable');
        return null;
      }
  } catch (err) {
      console.log("There was a failure calling findDataTable");
      console.error(err);
      return null;
  }
}

async function getConfigurationDataTableId() {
const dataTableId = await findDataTable();
return dataTableId;
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
        "Language": {
          "title": "Language",
          "type": "string",
          "$id": "/properties/Language",
          "minLength": 0,
          "maxLength": 8
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
    "key": knowledgeBaseId,
    "System Prompt": systemPrompt,
    "Language": language,
    "Minimum Answer Confidence": parseFloat(minAnswerConfidence),
    "No Match Behavior": noMatchBehavior,
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Wrap up ids for knowledge articles": wrapUpIds,
    "Model": model,
    "Temperature": parseFloat(temperature),
    "MaxTokens": parseInt(maxTokens, 10)
  };

  await createRow(dataTableId, newRow);
}

async function createRow(dataTableId, rowData) {
  const apiInstance = new platformClient.ArchitectApi();

  try {
    await apiInstance.postFlowsDatatableRows(dataTableId, rowData);
    console.log('Row inserted successfully');
    return true;
  } catch (error) {
    console.error('Error al insertar la fila en la DataTable: ', error);
    return false;
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

async function handleGetKnowledgeBasesButtonClick() {
  const knowledgeBases = await getKnowledgeBases();
  createKnowledgeBasesTable(knowledgeBases);
}

async function handleKnowledgeBaseSelection(event) {
  const selectedKnowledgeBaseId = event.target.value;

  // Buscar la datatable con nombre "Open AI - Knowledge Integration"
  const dataTableId = await findDataTable();

  if (dataTableId) {
    // Buscar la fila con el campo clave (key) igual al knowledge base Id seleccionado por el usuario
    const datatableRow = await findDatatableRow(dataTableId, selectedKnowledgeBaseId);

    if (datatableRow) {
      // Crear el subapartado "Current configuration"
      createCurrentConfigurationSubsection(datatableRow);

      // Comprueba si el elemento con el ID 'knowledgeBaseId' existe antes de llamar a 'updateKnowledgeBaseId'
      if (document.getElementById('knowledgeBaseId') !== null) {
        updateKnowledgeBaseId(selectedKnowledgeBaseId);
      }
    } else {
      // Crear el subapartado "New configuration"
      createNewConfigurationSubsection();

      // Comprueba si el elemento con el ID 'knowledgeBaseId' existe antes de llamar a 'updateKnowledgeBaseId'
      if (document.getElementById('knowledgeBaseId') !== null) {
        updateKnowledgeBaseId(selectedKnowledgeBaseId);
      }
    }
  } else {
    console.error('No se pudo encontrar la datatable "Open AI - Knowledge Integration"');
  }
}

async function getConfigurationDataTableId() {
  const { dataTableId } = await findDataTable();
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
    const createdDataTable = await createConfigurationDataTable();
    dataTableId = createdDataTable.id;
  } else {
    console.log('Se ha encontrado una data table con id: ' + dataTableId);
  }

  const rowInserted = await insertConfigurationRow(dataTableId, knowledgeBaseId, systemPrompt, language, parseFloat(minAnswerConfidence), noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, parseFloat(temperature), parseInt(maxTokens, 10));

  if (rowInserted) {
    alert('Configuration saved.');
  } else {
    alert('Error saving the configuration.');
  }
}   
  
function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  const saveConfigurationBtn = document.getElementById('saveConfigurationBtn');
  const knowledgeBasesTableBody = document.getElementById('knowledgeBasesTableBody');

  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
  saveConfigurationBtn.addEventListener('click', handleSaveConfigurationButtonClick);
  document.getElementById('getKnowledgeBasesBtn').addEventListener('click', getKnowledgeBases);
  knowledgeBasesTableBody.addEventListener('change', async (event) => {
    if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
      const knowledgeBaseId = event.target.value;
      await displayConfiguration(knowledgeBaseId);
    }
  });
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


async function displayConfiguration(knowledgeBaseId) {
  const datatable = await findOpenAiIntegrationDatatable();
  if (datatable) {
    const datatableRow = await findDatatableRow(datatable.id, knowledgeBaseId);
    if (datatableRow) {
      displayCurrentConfiguration(datatableRow);
    } else {
      displayNewConfiguration();
    }
  } else {
    console.error('No se encontró la datatable "Open AI - Knowledge Integration".');
  }
}

function displayCurrentConfiguration(datatableRow) {
  // Muestra el subapartado "Current configuration" y oculta "New configuration"
  document.getElementById('currentConfiguration').style.display = 'block';
  document.getElementById('newConfiguration').style.display = 'none';

  // Rellena los campos de "Current configuration" con los valores de la fila de la datatable
  document.getElementById('systemPrompt').value = datatableRow['System Prompt'];
  document.getElementById('language').value = datatableRow['Language'];
  document.getElementById('minAnswerConfidence').value = datatableRow['Minimum Answer Confidence'];
  document.getElementById('noMatchBehavior').value = datatableRow['No Match Behavior'];
  document.getElementById('createKnowledgeArticles').checked = datatableRow['Create knowledge articles based on wrap ups'];
  document.getElementById('wrapUpIds').value = datatableRow['Wrap up ids for knowledge articles'];
  document.getElementById('model').value = datatableRow['Model'];
  document.getElementById('temperature').value = datatableRow['Temperature'];
  document.getElementById('maxTokens').value = datatableRow['Max Tokens'];
}

function displayNewConfiguration() {
  // Oculta el subapartado "Current configuration" y muestra "New configuration"
  document.getElementById('currentConfiguration').style.display = 'none';
  document.getElementById('newConfiguration').style.display = 'block';

  // Limpia los campos de "New configuration"
  document.getElementById('systemPrompt').value = '';
  document.getElementById('language').value = '';
  document.getElementById('minAnswerConfidence').value = '';
  document.getElementById('noMatchBehavior').value = '';
  document.getElementById('createKnowledgeArticles').checked = false;
  document.getElementById('wrapUpIds').value = '';
  document.getElementById('model').value = '';
  document.getElementById('temperature').value = '';
  document.getElementById('maxTokens').value = '';
}

async function findDatatableRow(datatableId, knowledgeBaseId) {
  try {
    const architectApi = new platformClient.ArchitectApi();
    const opts = {
      'showbrief': false
    };

    const response = await architectApi.getFlowsDatatableRows(datatableId, opts);
    const row = response.entities.find(row => row.key === knowledgeBaseId);
    return row;
  } catch (error) {
    console.error(`Error finding datatable row with key '${knowledgeBaseId}':`, error);
  }
}

async function updateConfiguration(datatableId, rowId, config) {
  try {
    const architectApi = new platformClient.ArchitectApi();
    const response = await architectApi.putFlowsDatatableRow(datatableId, rowId, config);
    return response;
  } catch (error) {
    console.error('Error updating configuration:', error);
  }
}

async function saveNewConfiguration(datatableId, config) {
  try {
    const architectApi = new platformClient.ArchitectApi();
    const response = await architectApi.postFlowsDatatableRows(datatableId, config);
    return response;
  } catch (error) {
    console.error('Error saving new configuration:', error);
  }
}


// Initialize
function init() {
registerEventHandlers();
registerToggleWrapUpIdsFieldHandler();
}

init();

