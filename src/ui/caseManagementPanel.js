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
  constructor({ caseManager, onCaseSelected }) {
    this.caseManager = caseManager;
    this.onCaseSelected = onCaseSelected;
    this._lifetime = new UiLifetime();
    this._container = null;
    this._listContainer = null;
    this._unsubscribe = null;

    this._createElements();
  }

  _createElements() {
    this._panel = document.createElement('div');
    this._panel.id = 'case-management-panel';
    this._panel.className = 'panel collapsed';
    this._panel.dataset.panelId = 'case-management-panel';

    const header = document.createElement('header');
    header.className = 'panel-header';
    const title = document.createElement('span');
    title.className = 'panel-title';
    title.textContent = 'Investigation Cases';
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'panel-collapse-btn';
    collapseBtn.dataset.collapseTarget = 'case-management-panel';
    collapseBtn.textContent = '+';
    collapseBtn.setAttribute('aria-expanded', 'false');
    collapseBtn.setAttribute('aria-label', 'Expand Investigation Cases');

    header.append(title, collapseBtn);
    this._panel.appendChild(header);

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
    this._panel.appendChild(content);

    this._listContainer = listContainer;
    this._collapseBtn = collapseBtn;
  }

  mount(container) {
    this._container = container;
    this._container.appendChild(this._panel);

    this._unsubscribe = this.caseManager.subscribe((state) => {
      this._render(state.cases, state.activeCaseId);
    });
  }

  _render(cases, activeCaseId) {
    this._listContainer.innerHTML = '';

    if (cases.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No cases created.';
      empty.style.color = '#668899';
      empty.style.textAlign = 'center';
      empty.style.fontSize = '12px';
      this._listContainer.appendChild(empty);
      return;
    }

    for (const c of cases) {
      const item = document.createElement('div');
      item.className = `case-item ${c.id === activeCaseId ? 'active' : ''}`;
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.padding = '8px';
      item.style.borderRadius = '4px';
      item.style.cursor = 'pointer';
      item.style.backgroundColor = c.id === activeCaseId ? '#1a3a4a' : 'transparent';
      item.style.border = c.id === activeCaseId ? '1px solid #397080' : '1px solid transparent';

      const info = document.createElement('div');
      info.style.flex = '1';
      info.style.overflow = 'hidden';
      const name = document.createElement('div');
      name.textContent = c.name;
      name.style.fontWeight = '500';
      name.style.whiteSpace = 'nowrap';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      info.appendChild(name);

      const date = document.createElement('div');
      date.textContent = new Date(c.createdAt).toLocaleDateString();
      date.style.fontSize = '10px';
      date.style.color = '#668899';
      info.appendChild(date);

      item.appendChild(info);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.className = 'case-delete-btn';
      deleteBtn.style.background = 'transparent';
      deleteBtn.style.border = 'none';
      deleteBtn.style.color = '#ff4444';
      deleteBtn.style.fontSize = '18px';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.padding = '0 4px';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete case "${c.name}"?`)) {
          this.caseManager.deleteCase(c.id);
        }
      });

      item.appendChild(deleteBtn);

      item.addEventListener('click', () => {
        this.caseManager.setActiveCase(c.id);
        this.onCaseSelected(c);
      });

      this._listContainer.appendChild(item);
    }
  }

  destroy() {
    this._unsubscribe?.();
    this._panel.remove();
    this._lifetime.destroy();
  }
}
