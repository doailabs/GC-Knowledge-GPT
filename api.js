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
        const datatableId = data.entities[0].id;
        console.log('datatableId encontrado: ' + datatableId);
        window.datatableId = datatableId;
        return datatableId;
      } else {
        console.log('No se encontró la dataTable');
      }
  } catch (err) {
      console.log("There was a failure calling findDataTable");
      console.error(err);
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

async function findDatatableRow(knowledgeBaseId) {
  try { 
    const architectApi = new platformClient.ArchitectApi();
    const opts = {
      'showbrief': false
    };

    const response = await architectApi.getFlowsDatatableRows(window.datatableId, opts);
    const row = response.entities.find(row => row.key === knowledgeBaseId);
    console.log(`Se ha encontrado un fila coincidente en findDatatableRow: `, row);
    return row;
  } catch (error) {
    console.error(`Error encontrando una fila en la tabla con la clave '${knowledgeBaseId}':`, error);
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

async function updateRow(dataTableId, rowData, rowId) {
  const apiInstance = new platformClient.ArchitectApi();

  try {
    const response = await apiInstance.putFlowsDatatableRow(window.datatableId, rowId, rowData);
    return response;
  } catch (error) {
    console.error('Error al actualizar la fila de la DataTable::', error);
  }
}
