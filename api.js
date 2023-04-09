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

function saveNewConfiguration() {
  const architectApi = new platformClient.ArchitectApi();
  const newConfig = {
    knowledge_base_id: document.getElementById('knowledgeBaseIdNew').value,
    language: document.getElementById('language').value,
    min_answer_confidence: document.getElementById('minAnswerConfidence').value,
    system_prompt: document.getElementById('systemPrompt').value,
    no_match_behavior: document.getElementById('noMatchBehavior').value,
    create_knowledge_articles: document.getElementById('createKnowledgeArticles').checked,
    wrap_up_ids: document.getElementById('wrapUpIds').value,
    model: document.getElementById('model').value,
    temperature: document.getElementById('temperature').value,
    max_tokens: document.getElementById('maxTokens').value
  };

  findDataTable()
    .then((dataTableId) => {
      if (dataTableId) {
        const row = {
          key_value_data: newConfig
        };
        return architectApi.postFlowsDatatableRows(dataTableId, row);
      } else {
        throw new Error('Data table not found.');
      }
    })
    .then((response) => {
      console.log('New configuration saved:', response);
    })
    .catch((error) => {
      console.error('Error saving new configuration:', error);
    });
}





