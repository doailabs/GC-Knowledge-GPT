async function getConfigurationDataTableId() {
  const { dataTableId } = await findDataTable();
  return dataTableId;
}

async function createConfigurationDataTable() {
  const dataTable = await createDataTable();
  return dataTable.id;
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
        return genesysCloudClient.flows.postFlowsDatatableRows(dataTableId, row);
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

