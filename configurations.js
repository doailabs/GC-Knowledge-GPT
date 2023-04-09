
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

function displayConfiguration(knowledgeBaseId) {
  const existingConfigurationSection = document.getElementById('existingConfiguration');
  const newConfigurationSection = document.getElementById('newConfiguration');
  
  // Buscar la tabla "Open AI - Knowledge Integration"
  findDataTable()
    .then((dataTableId) => {
      // Si se encuentra la tabla, buscar la fila correspondiente
      return findDatatableRow(dataTableId, knowledgeBaseId);
    })
    .then((rowData) => {
      if (rowData) {
        // Si se encuentra la fila, mostrar la sección Existing configuration y llenar los campos
        existingConfigurationSection.style.display = 'block';
        newConfigurationSection.style.display = 'none';

        document.getElementById('knowledgeBaseIdExisting').value = rowData.knowledge_base_id;
        document.getElementById('language').value = rowData.language;
        document.getElementById('minAnswerConfidence').value = rowData.min_answer_confidence;
        document.getElementById('systemPrompt').value = rowData.system_prompt;
        document.getElementById('noMatchBehavior').value = rowData.no_match_behavior;
        document.getElementById('createKnowledgeArticles').checked = rowData.create_knowledge_articles;
        document.getElementById('wrapUpIds').value = rowData.wrap_up_ids;
        document.getElementById('model').value = rowData.model;
        document.getElementById('temperature').value = rowData.temperature;
        document.getElementById('maxTokens').value = rowData.max_tokens;
      } else {
        // Si no se encuentra la fila, mostrar la sección New configuration y llenar el campo Knowledge Base Id
        existingConfigurationSection.style.display = 'none';
        newConfigurationSection.style.display = 'block';

        document.getElementById('knowledgeBaseIdNew').value = knowledgeBaseId;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}


