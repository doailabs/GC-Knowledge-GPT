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

function displayConfiguration(knowledgeBaseId) {
  const configurationSection = document.getElementById('configuration');
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
        // Si se encuentra la fila, llenar los campos
        document.getElementById('knowledgeBaseId').value = rowData.key;
        document.getElementById('language').value = rowData.Language;
        document.getElementById('minAnswerConfidence').value = rowData['Minimum Answer Confidence'];
        document.getElementById('systemPrompt').value = rowData['System Prompt'];
        document.getElementById('noMatchBehavior').value = rowData['No Match Behavior'];
        document.getElementById('createKnowledgeArticles').checked = rowData['Create knowledge articles based on wrap ups'];
        document.getElementById('wrapUpIds').value = rowData['Wrap up ids for knowledge articles'] || '';
        document.getElementById('model').value = rowData.Model;
        document.getElementById('temperature').value = rowData.Temperature;
        document.getElementById('maxTokens').value = rowData.MaxTokens;

        // Mostrar la sección de configuración y ocultar el botón "Guardar configuración"
        configurationSection.style.display = 'block';
        document.getElementById('saveConfigurationBtn').style.display = 'none';
        document.getElementById('updateConfigurationBtn').style.display = 'inline-block';
      } else {
        // Si no se encuentra la fila, mostrar la sección de configuración y llenar el campo Knowledge Base Id
        document.getElementById('knowledgeBaseId').value = knowledgeBaseId;

        // Mostrar la sección de configuración y ocultar el botón "Actualizar configuración"
        configurationSection.style.display = 'block';
        document.getElementById('saveConfigurationBtn').style.display = 'inline-block';
        document.getElementById('updateConfigurationBtn').style.display = 'none';
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
