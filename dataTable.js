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



