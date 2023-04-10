async function getConfigurationDataTableId() {
  const dataTableId = await findDataTable();
  return dataTableId;
}

async function createConfigurationDataTable() {
  const dataTable = await createDataTable();
  return dataTable.id;
}

async function insertConfigurationRow(dataTableId, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, temperature, maxTokens) {
  const newRow = {
    "Temperature": parseFloat(temperature),
    "Minimum Answer Confidence": parseFloat(minAnswerConfidence),
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Language": language,
    "MaxTokens": parseInt(maxTokens, 10),
    "Model": model,
    "No Match Behavior": noMatchBehavior,
    "key": knowledgeBaseId,
    "System Prompt": systemPrompt,
    "Wrap up ids for knowledge articles": wrapUpIds
  };
  
  try {
    await createRow(dataTableId, newRow);
    return true;
  } catch (error) {
    console.error('Error al llamar a createRow desde insertConfigurationRow: ', error);
    return false;
  }  
}

async function updateConfigurationRow(dataTableId, knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, temperature, maxTokens) {
  const newRow = {
    "Temperature": parseFloat(temperature),
    "Minimum Answer Confidence": parseFloat(minAnswerConfidence),
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Language": language,
    "MaxTokens": parseInt(maxTokens, 10),
    "Model": model,
    "No Match Behavior": noMatchBehavior,
    "key": knowledgeBaseId,
    "System Prompt": systemPrompt,
    "Wrap up ids for knowledge articles": wrapUpIds
  };
  
  try {
    const dataTableId = getConfigurationDataTableId();
    await updateRow(dataTableId, newRow, knowledgeBaseId);
    return true;
  } catch (error) {
    console.error('Error al llamar a updateRow desde updateConfigurationRow: ', error);
    return false;
  }  
}




