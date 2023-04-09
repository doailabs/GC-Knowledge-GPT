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

  await createRow(dataTableId, newRow);
}




