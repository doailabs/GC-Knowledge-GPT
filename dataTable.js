async function ensureDataTableExists() {
  if (!window.datatableId) {
    const createdDataTable = await createConfigurationDataTable();
    window.datatableId = createdDataTable.id;
  }
}

async function getConfigurationDataTableId() {
  const dataTableId = await findDataTable();
  return dataTableId;
}

async function createConfigurationDataTable() {
  const dataTable = await createDataTable();
  return dataTable.id;
}

async function insertConfigurationRow(knowledgeBaseId, systemPrompt, language, minAnswerConfidence, noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, temperature, maxTokens) {
  // Asegurarse de que se ha creado la tabla de datos antes de insertar una fila
  await ensureDataTableExists();

  const rowData = {
    key: knowledgeBaseId,
    "Language": language,
    "System Prompt": systemPrompt,
    "Minimum Answer Confidence": minAnswerConfidence,
    "No Match Behavior": noMatchBehavior,
    "Create knowledge articles based on wrap ups": createKnowledgeArticles,
    "Wrap up ids for knowledge articles": wrapUpIds,
    "Model": model,
    "Temperature": temperature,
    "MaxTokens": maxTokens
  };

  const existingRow = await findDatatableRow(knowledgeBaseId);

  if (existingRow) {
    console.log('La fila ya existe en la DataTable, actualizando la fila existente');
    return await updateRow(window.datatableId, rowData, existingRow.id);
  } else {
    console.log('Insertando una nueva fila en la DataTable');
    return await createRow(window.datatableId, rowData);
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
    const dataTableId = await getConfigurationDataTableId();
    await updateRow(dataTableId, newRow, knowledgeBaseId);
    return true;
  } catch (error) {
    console.error('Error al llamar a updateRow desde updateConfigurationRow: ', error);
    return false;
  }  
}




