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

function displayConfiguration(knowledgeBaseId) {
  const fetchDataAndDisplayConfiguration = async () => {
    // Si window.datatableId es "", llama a la función findDataTable() para obtener el ID.
    if (window.datatableId === "") {
      await findDataTable();
    }

    // Llama a findDatatableRow con el ID de la base de conocimientos
    return findDatatableRow(knowledgeBaseId);
  };

  fetchDataAndDisplayConfiguration()
    .then((rowData) => {
      if (rowData) {
        updateInputFields(rowData);
      } else {
        const newConfiguration = {
          key: knowledgeBaseId,
        };
        updateInputFields(newConfiguration);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
