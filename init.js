// Initialize
function init() {
  // Llama a registerEventHandlers cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    registerEventHandlers();
    registerToggleWrapUpIdsFieldHandler();
  });
}
