// Initialize
function init(clientId) {
    startGCSDKs(clientId).then(() => {
      document.addEventListener('DOMContentLoaded', () => {
          registerEventHandlers();
          registerToggleWrapUpIdsFieldHandler();
      });
    });

    document.getElementById('knowledgeBasesTable').addEventListener('change', function (event) {
      const selectedKnowledgeBaseId = event.target.value;
      document.getElementById('knowledgeBaseIdNew').value = selectedKnowledgeBaseId;
      displayConfiguration(selectedKnowledgeBaseId);
    });
}
