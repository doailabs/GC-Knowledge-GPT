async function handleGetKnowledgeBasesButtonClick() {
  const knowledgeBases = await getKnowledgeBases();
  createKnowledgeBasesTable(knowledgeBases);
}

async function handleKnowledgeBaseSelection(event) {
  const selectedKnowledgeBaseId = event.target.value;

  // Buscar la datatable con nombre "Open AI - Knowledge Integration"
  const dataTableId = await findDataTable();

  if (dataTableId) {
    // Mostrar la configuración actual o la nueva según la existencia de la fila correspondiente en la datatable
    displayConfiguration(selectedKnowledgeBaseId);

    // Comprueba si el elemento con el ID 'knowledgeBaseId' existe antes de llamar a 'updateKnowledgeBaseId'
    if (document.getElementById('knowledgeBaseId') !== null) {
      updateKnowledgeBaseId(selectedKnowledgeBaseId);
    }
  } else {
    console.error('No se pudo encontrar la datatable "Open AI - Knowledge Integration"');
  }
}

function registerEventHandlers() {
  const getKnowledgeBasesBtn = document.getElementById('getKnowledgeBasesBtn');
  const saveConfigurationBtn = document.getElementById('saveConfigurationBtn');
  const knowledgeBasesTableBody = document.getElementById('knowledgeBasesTableBody');

  getKnowledgeBasesBtn.addEventListener('click', handleGetKnowledgeBasesButtonClick);
  document.getElementById('getKnowledgeBasesBtn').addEventListener('click', getKnowledgeBases);
  knowledgeBasesTableBody.addEventListener('change', async (event) => {
    if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
      const knowledgeBaseId = event.target.value;
      await displayConfiguration(knowledgeBaseId);
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
  const createKnowledgeArticlesCheckbox = document.getElementById('createKnowledgeArticles');
  const wrapUpIdsFieldWrapper = document.getElementById('wrapUpIdsFieldWrapper');

  if (createKnowledgeArticlesCheckbox.checked) {
    wrapUpIdsFieldWrapper.style.display = 'block';
  } else {
    wrapUpIdsFieldWrapper.style.display = 'none';
  }
}

function registerToggleWrapUpIdsFieldHandler() {
  const createKnowledgeArticlesCheckbox = document.getElementById('createKnowledgeArticles');
  createKnowledgeArticlesCheckbox.addEventListener('change', toggleWrapUpIdsField);
}


