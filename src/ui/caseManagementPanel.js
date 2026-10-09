import { UiLifetime } from './uiLifetime.js';

/**
 * CaseManagementPanel provides a UI for managing investigation cases.
 * It allows users to create, delete, and switch between active cases.
 */
export class CaseManagementPanel {
  /**
   * @param {object} options
   * @param {import('../../investigation/caseManager.js').CaseManager} options.caseManager
   * @param {function} options.onCaseSelected
   */
  constructor({ caseManager, onCaseSelected, panelChrome }) {
    this.caseManager = caseManager;
    this.onCaseSelected = onCaseSelected;
    this._panelChrome = panelChrome || null;
    this._listContainer = null;
    this._lifetime = new UiLifetime();

    this._createElements();
  }

  _createElements() {
    this._panel = document.createElement('div');
    this._panel.id = 'case-management-panel';
    this._panel.className = 'panel-collapsible collapsed';
    this._panel.setAttribute('data-panel-id', 'case-management-panel');

    // Glow layer for proper z-index and visual consistency (matches working panels)
    const glow = document.createElement('div');
    glow.className = 'panel-glow';

    // Inner container holds header + content together (matching CCTV/Scene pattern)
    const inner = document.createElement('div');
    inner.className = 'case-management-panel-inner';

    // Header inside inner container — must be inside for proper scrolling behavior
    const header = document.createElement('div');
    header.className = 'panel-header';
    const title = document.createElement('span');
    title.className = 'panel-title';
    title.textContent = 'CASES';
    const divider = document.createElement('span');
    divider.className = 'panel-divider';
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'panel-collapse-btn';
    collapseBtn.dataset.collapseTarget = 'case-management-panel';
    collapseBtn.textContent = '+';
    collapseBtn.setAttribute('aria-expanded', 'false');
    collapseBtn.setAttribute('aria-label', 'Collapse Investigation Cases');

    header.append(title, divider, collapseBtn);

    const content = document.createElement('div');
    content.className = 'panel-content';

    const listContainer = document.createElement('div');
    listContainer.className = 'case-list-container';
    listContainer.style.padding = '12px';
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'column';
    listContainer.style.gap = '8px';

    const actions = document.createElement('div');
    actions.className = 'case-actions';
    actions.style.padding = '12px';
    actions.style.borderTop = '1px solid #397080';

    const createBtn = document.createElement('button');
    createBtn.className = 'case-btn create-case-btn';
    createBtn.textContent = 'New Case';
    createBtn.style.width = '100%';
    createBtn.style.padding = '8px';
    createBtn.style.backgroundColor = '#10242e';
    createBtn.style.color = '#e3faff';
    createBtn.style.border = '1px solid #397080';
    createBtn.style.cursor = 'pointer';

    createBtn.addEventListener('click', () => {
      const name = prompt('Enter case name:');
      if (name) {
        this.caseManager.createCase(name);
      }
    });

    actions.appendChild(createBtn);
    content.append(listContainer, actions);
    inner.appendChild(header);
    inner.appendChild(content);
    this._panel.appendChild(glow);
    this._panel.appendChild(inner);

    this._listContainer = listContainer;
    this._collapseBtn = collapseBtn;
  }

  mount(container) {
     container.appendChild(this._panel);
     
     // DIAGNOSTIC: Verify data-panel-id attribute exists for PanelChrome binding
     console.log('[CaseManagementPanel] Mounted panel:', {
       id: this._panel.id,
       hasDataPanelIdAttr: this._panel.hasAttribute('data-panel-id'),
       datasetPanelId: this._panel.dataset.panelId,
       collapseBtnTarget: this._collapseBtn?.dataset.collapseTarget,
       buttonsFound: document.querySelectorAll('.panel-collapse-btn[data-collapse-target="case-management-panel"]').length,
       chromeAvailable: Boolean(this._panelChrome),
       panelClassName: this._panel.className,
       innerClassExists: Boolean(this._panel.querySelector('.case-management-panel-inner')),
     });
 
     // Tell PanelChrome to discover the new collapse button so disclosure works.
     this._panelChrome?.refresh();
 
     this._unsubscribe = this.caseManager.subscribe((state) => {
       this._render(state.cases, state.activeCaseId);
     });
   }

  _render(cases, activeCaseId) {
    this._listContainer.innerHTML = '';
    for (const c of cases) {
      const item = document.createElement('div');
      item.className = 'case-item';
      if (c.id === activeCaseId) item.classList.add('active');
      item.textContent = c.name;
      item.style.cursor = 'pointer';
      item.style.padding = '4px 8px';
      item.style.borderRadius = '4px';
      if (c.id === activeCaseId) {
        item.style.backgroundColor = '#397080';
      }
      item.addEventListener('click', () => this.onCaseSelected(c));
      this._listContainer.appendChild(item);
    }
  }

  _refreshTogglePanel() {
    this._collapseBtn.textContent = this._panel.classList.contains('collapsed') ? '+' : '−';
    this._collapseBtn.setAttribute('aria-expanded', String(!this._panel.classList.contains('collapsed')));
  }

  destroy() {
    this._unsubscribe?.();
    this._panel.remove();
    this._lifetime.destroy();
  }
}
