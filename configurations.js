function createKnowledgeBasesTable(knowledgeBases) {
  const tableBody = document.getElementById('knowledgeBasesTableBody');

  function idExists(id) {
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const currentRow = rows[i];
      const currentId = currentRow.getElementsByTagName('td')[0].textContent;
      if (currentId === id) {
        return true;
      }
    }
    return false;
  }

  knowledgeBases.forEach((knowledgeBase) => {
    if (!idExists(knowledgeBase.id)) {
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

      radioCell.appendChild(radioInput);

      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(radioCell);

      tableBody.appendChild(row);
    }
  });
}

function updateKnowledgeBaseId(knowledgeBaseId) {
  const knowledgeBaseIdInput = document.getElementById('knowledgeBaseId');
  knowledgeBaseIdInput.value = knowledgeBaseId;
}

function updateInputFields(rowData) {
  const knowledgeBaseIdInput = document.getElementById('knowledgeBaseId');
  const languageInput = document.getElementById('language');
  const minAnswerConfidenceInput = document.getElementById('minAnswerConfidence');
  const systemPromptInput = document.getElementById('systemPrompt');
  const noMatchBehaviorInput = document.getElementById('noMatchBehavior');
  const createKnowledgeArticlesInput = document.getElementById('createKnowledgeArticles');
  const wrapUpIdsInput = document.getElementById('wrapUpIds');
  const modelInput = document.getElementById('model');
  const temperatureInput = document.getElementById('temperature');
  const maxTokensInput = document.getElementById('maxTokens');

  knowledgeBaseIdInput.value = rowData.key || '';
  languageInput.value = rowData.Language || '';
  minAnswerConfidenceInput.value = rowData['Minimum Answer Confidence'] || '';
  systemPromptInput.value = rowData['System Prompt'] || '';
  noMatchBehaviorInput.value = rowData['No Match Behavior'] || '';
  createKnowledgeArticlesInput.checked = rowData['Create knowledge articles based on wrap ups'] || false;
  wrapUpIdsInput.value = rowData['Wrap up ids for knowledge articles'] || '';
  modelInput.value = rowData.Model || '';
  temperatureInput.value = rowData.Temperature || '';
  maxTokensInput.value = rowData.MaxTokens || '';
}

function showConfigurationSection() {
  document.getElementById('configuration').style.display = 'block';
}

async function displayConfiguration(knowledgeBaseId) {
  const row = await findDatatableRow(knowledgeBaseId);
  
  // Configuración encontrada
  if (row) {
    document.getElementById('knowledgeBaseIdNew').value = row.key;
    document.getElementById('systemPrompt').value = row.properties['System Prompt'];
    document.getElementById('language').value = row.properties['Language'];
    document.getElementById('minAnswerConfidence').value = row.properties['Minimum Answer Confidence'];
    document.getElementById('noMatchBehavior').value = row.properties['No Match Behavior'];
    document.getElementById('createKnowledgeArticles').checked = row.properties['Create knowledge articles based on wrap ups'];
    document.getElementById('wrapUpIds').value = row.properties['Wrap-up IDs'];
    document.getElementById('model').value = row.properties['Model'];
    document.getElementById('temperature').value = row.properties['Temperature'];
    document.getElementById('maxTokens').value = row.properties['MaxTokens'];

    // Muestra el apartado de "Configuration"
    showConfigurationSection();

    document.getElementById('updateConfigurationBtn').style.display = 'block';
    document.getElementById('saveConfigurationBtn').style.display = 'none';
  } else {
    document.getElementById('knowledgeBaseIdNew').value = knowledgeBaseId;

    // Muestra el apartado de "Configuration"
    showConfigurationSection();

    document.getElementById('updateConfigurationBtn').style.display = 'none';
    document.getElementById('saveConfigurationBtn').style.display = 'block';
  }
}
