
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

function displayCurrentConfiguration(datatableRow) {
  document.getElementById('currentConfiguration').style.display = 'block';
  document.getElementById('newConfiguration').style.display = 'none';
  document.getElementById('updateConfigurationBtn').style.display = 'inline-block';
  document.getElementById('saveConfigurationBtn').style.display = 'none';

  // Rellena los campos de "Current configuration" con los valores de la fila de la datatable
  document.getElementById('systemPrompt').value = datatableRow['System Prompt'];
  document.getElementById('language').value = datatableRow['Language'];
  document.getElementById('minAnswerConfidence').value = datatableRow['Minimum Answer Confidence'];
  document.getElementById('noMatchBehavior').value = datatableRow['No Match Behavior'];
  document.getElementById('createKnowledgeArticles').checked = datatableRow['Create knowledge articles based on wrap ups'];
  document.getElementById('wrapUpIds').value = datatableRow['Wrap up ids for knowledge articles'];
  document.getElementById('model').value = datatableRow['Model'];
  document.getElementById('temperature').value = datatableRow['Temperature'];
  document.getElementById('maxTokens').value = datatableRow['Max Tokens'];
}

function displayNewConfiguration() {
  document.getElementById('currentConfiguration').style.display = 'none';
  document.getElementById('newConfiguration').style.display = 'block';
  document.getElementById('updateConfigurationBtn').style.display = 'none';
  document.getElementById('saveConfigurationBtn').style.display = 'inline-block';
}
