async function handleSaveConfigurationButtonClick() {
  const knowledgeBaseId = document.getElementById('knowledgeBaseId').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  const language = document.getElementById('language').value;
  const minAnswerConfidence = document.getElementById('minAnswerConfidence').value;
  const noMatchBehavior = document.getElementById('noMatchBehavior').value;
  const createKnowledgeArticles = document.getElementById('createKnowledgeArticles').checked;
  const wrapUpIds = createKnowledgeArticles ? document.getElementById('wrapUpIds').value : '';
  const model = document.getElementById('model').value;
  const temperature = document.getElementById('temperature').value;
  const maxTokens = document.getElementById('maxTokens').value;

  // Compruebe si todos los campos están llenos
  if (!knowledgeBaseId || !systemPrompt || !language || !minAnswerConfidence || !noMatchBehavior || !model || !temperature || !maxTokens) {
    alert('Please fill in all the configuration fields.');
    return;
  }

  // Utiliza ensureDataTableExists() en lugar de createConfigurationDataTable()
  await ensureDataTableExists();

  const rowInserted = await insertConfigurationRow(window.datatableId, window.selectedKnowledgeBaseId, systemPrompt, language, parseFloat(minAnswerConfidence), noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, parseFloat(temperature), parseInt(maxTokens, 10));

  if (rowInserted) {
    alert('Configuration saved.');
  } else {
    alert('Error saving the configuration.');
  }
}


async function handleUpdateConfigurationButtonClick() {
  const knowledgeBaseId = document.getElementById('knowledgeBaseId').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  const language = document.getElementById('language').value;
  const minAnswerConfidence = document.getElementById('minAnswerConfidence').value;
  const noMatchBehavior = document.getElementById('noMatchBehavior').value;
  const createKnowledgeArticles = document.getElementById('createKnowledgeArticles').checked;
  const wrapUpIds = createKnowledgeArticles ? document.getElementById('wrapUpIds').value : '';
  const model = document.getElementById('model').value;
  const temperature = document.getElementById('temperature').value;
  const maxTokens = document.getElementById('maxTokens').value;
  
  await getConfigurationDataTableId();

  if (!window.datatableId) {
    console.log('Error al obtener dataTableId en handleUpdateConfigurationButtonClick');
  } else {
    console.log('Se ha encontrado una data table con id: ' + window.datatableId);
  }

  const rowUpdated = await updateConfigurationRow(window.datatableId, window.selectedKnowledgeBaseId, systemPrompt, language, parseFloat(minAnswerConfidence), noMatchBehavior, createKnowledgeArticles, wrapUpIds, model, parseFloat(temperature), parseInt(maxTokens, 10));

  if (rowUpdated) {
    alert('Configuration updated.');
  } else {
    alert('Error updating the configuration.');
  }
}

async function handleGetKnowledgeBasesButtonClick() {
  const knowledgeBases = await getKnowledgeBases();
  createKnowledgeBasesTable(knowledgeBases);
}

function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  const saveConfigurationBtn = document.getElementById('saveConfigurationBtn');
  const updateConfigurationBtn = document.getElementById('updateConfigurationBtn');
  const knowledgeBasesTableBody = document.getElementById('knowledgeBasesTableBody');

  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
  saveConfigurationBtn.addEventListener('click', handleSaveConfigurationButtonClick);
  updateConfigurationBtn.addEventListener('click', handleUpdateConfigurationButtonClick);
  knowledgeBasesTableBody.addEventListener('change', async (event) => {
    if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
      window.selectedKnowledgeBaseId = event.target.value;
      await displayConfiguration(window.selectedKnowledgeBaseId);

      // Comprueba si el elemento con el ID 'knowledgeBaseId' existe antes de llamar a 'updateKnowledgeBaseId'
      if (document.getElementById('knowledgeBaseId') !== null) {
        updateKnowledgeBaseId(window.selectedKnowledgeBaseId);
      }
    }
  });  
}

function adjustInputSize(input, maxSize) {
  if (input.value.length > maxSize) {
    input.size = input.value.length;
  } else {
    input.size = maxSize;
  }
}

function toggleWrapUpIdsField() {
  var createKnowledgeArticlesCheckbox = document.getElementById("createKnowledgeArticles");
  var wrapUpIdsDiv = document.getElementById("wrapUpIdsDiv");

  if (createKnowledgeArticlesCheckbox.checked) {
    wrapUpIdsDiv.style.display = "block";
  } else {
    wrapUpIdsDiv.style.display = "none";
  }
}

function registerToggleWrapUpIdsFieldHandler() {
  const createKnowledgeArticlesCheckbox = document.getElementById('createKnowledgeArticles');
  createKnowledgeArticlesCheckbox.addEventListener('change', toggleWrapUpIdsField);
}


