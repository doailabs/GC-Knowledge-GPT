// Initialize
function init() {
    startGCSDKs(clientId).then(() => {
      registerEventHandlers();
    });

    document.getElementById('knowledgeBasesTable').addEventListener('change', function (event) {
      const selectedKnowledgeBaseId = event.target.value;
      document.getElementById('knowledgeBaseIdNew').value = selectedKnowledgeBaseId;
      displayConfiguration(selectedKnowledgeBaseId);
    });

    document.addEventListener('DOMContentLoaded', () => {
      registerEventHandlers();
      registerToggleWrapUpIdsFieldHandler();
    });
}
