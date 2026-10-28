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
  constructor({ caseManager, onCaseSelected, panelChrome, osintService }) {
    this.caseManager = caseManager;
    this.onCaseSelected = onCaseSelected;
    this._panelChrome = panelChrome || null;
    this.osintService = osintService || null;
    this._listContainer = null;
    this._lifetime = new UiLifetime();

    this._createElements();
  }

  _createElements() {
    this._panel = document.createElement('div');
    this._panel.id = 'case-management-panel';
    this._panel.className = 'panel-collapsible';  // Start expanded so phone OSINT input is visible
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

    // Phone OSINT input section
    const phoneSection = this._createPhoneInputSection();

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
    content.append(phoneSection, listContainer, actions);
    inner.appendChild(header);
    inner.appendChild(content);
    this._panel.appendChild(glow);
    this._panel.appendChild(inner);

    this._listContainer = listContainer;
    this._collapseBtn = collapseBtn;
  }

  /**
   * Create the phone number OSINT input section
   * @returns {HTMLElement}
   * @private
   */
  _createPhoneInputSection() {
    const section = document.createElement('div');
    section.className = 'phone-osint-section';
    section.style.padding = '12px';
    section.style.borderBottom = '1px solid #397080';
    section.style.backgroundColor = '#0a1a20';

    // Section header
    const header = document.createElement('div');
    header.className = 'phone-osint-header';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '8px';

    const icon = document.createElement('span');
    icon.className = 'phone-icon';
    icon.textContent = '\uD83D\uDCF1';
    icon.style.fontSize = '14px';

    const title = document.createElement('span');
    title.className = 'phone-osint-title';
    title.textContent = 'Phone OSINT';
    title.style.fontSize = '12px';
    title.style.fontWeight = '600';
    title.style.color = '#e3faff';
    title.style.letterSpacing = '0.5px';

    header.append(icon, title);

    // Input row
    const inputRow = document.createElement('div');
    inputRow.className = 'phone-osint-input-row';
    inputRow.style.display = 'flex';
    inputRow.style.gap = '6px';

    const input = document.createElement('input');
    input.type = 'tel';
    input.className = 'phone-osint-input';
    input.placeholder = 'Enter phone number (e.g., 214-555-1234)';
    input.style.flex = '1';
    input.style.padding = '6px 8px';
    input.style.backgroundColor = '#10242e';
    input.style.color = '#e3faff';
    input.style.border = '1px solid #397080';
    input.style.borderRadius = '4px';
    input.style.fontSize = '12px';
    input.style.outline = 'none';

    // Lookup button
    const lookupBtn = document.createElement('button');
    lookupBtn.className = 'phone-osint-lookup-btn';
    lookupBtn.textContent = 'Lookup';
    lookupBtn.style.padding = '6px 12px';
    lookupBtn.style.backgroundColor = '#105676';
    lookupBtn.style.color = '#e3faff';
    lookupBtn.style.border = '1px solid #397080';
    lookupBtn.style.borderRadius = '4px';
    lookupBtn.style.cursor = 'pointer';
    lookupBtn.style.fontSize = '12px';
    lookupBtn.style.fontWeight = '500';
    lookupBtn.style.whiteSpace = 'nowrap';

    lookupBtn.addEventListener('click', () => this._handlePhoneLookup(input));

    // Keyboard shortcut (Enter key)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._handlePhoneLookup(input);
      }
    });

    inputRow.append(input, lookupBtn);

    // Status message area
    const status = document.createElement('div');
    status.className = 'phone-osint-status';
    status.style.fontSize = '11px';
    status.style.color = '#8ab4c0';
    status.style.marginTop = '6px';
    status.style.minHeight = '16px';
    status.style.fontStyle = 'italic';
    status.textContent = 'Create a case first, then enter a phone number to lookup';

    section.append(header, inputRow, status);

    this._phoneInput = input;
    this._phoneStatus = status;
    this._lookupBtn = lookupBtn;

    console.log('[CaseManagementPanel] Phone OSINT section created:', {
      hasPhoneInput: Boolean(this._phoneInput),
      hasPhoneStatus: Boolean(this._phoneStatus),
      hasLookupBtn: Boolean(this._lookupBtn),
      inputType: this._phoneInput?.type,
      inputPlaceholder: this._phoneInput?.placeholder,
      sectionVisible: section.offsetParent !== null,
      sectionHeight: section.offsetHeight,
    });

    return section;
  }

  /**
   * Handle phone number OSINT lookup
   * @param {HTMLInputElement} input - The phone input element
   * @private
   */
  async _handlePhoneLookup(input) {
    console.log('[CaseManagementPanel] _handlePhoneLookup called');
    console.log('[CaseManagementPanel] this.osintService:', this.osintService);
    console.log('[CaseManagementPanel] this.caseManager:', this.caseManager);
    
    const phoneNumber = input.value.trim();
    console.log('[CaseManagementPanel] Phone number entered:', phoneNumber);
    
    if (!phoneNumber) {
      console.warn('[CaseManagementPanel] Empty phone number');
      this._phoneStatus.textContent = 'Please enter a phone number.';
      this._phoneStatus.style.color = '#ff6b6b';
      return;
    }

    if (!this.osintService) {
      console.error('[CaseManagementPanel] osintService is null/undefined!');
      this._phoneStatus.textContent = 'OSINT service not available.';
      this._phoneStatus.style.color = '#ff6b6b';
      return;
    }

    // Get active case ID
    const activeCaseId = this.caseManager.getActiveCaseId();
    console.log('[CaseManagementPanel] Active case ID:', activeCaseId);
    
    if (!activeCaseId) {
      console.warn('[CaseManagementPanel] No active case ID');
      this._phoneStatus.textContent = 'Please create or select a case first.';
      this._phoneStatus.style.color = '#ff6b6b';
      return;
    }

    // Set loading state
    this._lookupBtn.textContent = '...';
    this._lookupBtn.disabled = true;
    this._phoneStatus.textContent = 'Looking up phone number...';
    this._phoneStatus.style.color = '#8ab4c0';

    try {
      console.log('[CaseManagementPanel] Calling osintService.lookupPhoneNumber with:', phoneNumber, activeCaseId);
      const result = await this.osintService.lookupPhoneNumber(phoneNumber, {
        caseId: activeCaseId,
        saveToCase: true
      });
      console.log('[CaseManagementPanel] osintService.lookupPhoneNumber result:', result);

      if (result.success) {
        let statusMsg = `Found: ${result.parsed?.national || phoneNumber}`;
        
        if (result.geolocation) {
          statusMsg += ` — ${result.geolocation.city}, ${result.geolocation.state}`;
        }
        
        if (result.tollFree) {
          statusMsg += ' (Toll-Free)';
        } else if (result.premiumRate) {
          statusMsg += ' (Premium Rate)';
        }

        console.log('[CaseManagementPanel] Lookup successful:', statusMsg);
        this._phoneStatus.textContent = statusMsg;
        this._phoneStatus.style.color = '#4ade80';
        
        // Emit event for DETAILS panel to refresh OSINT data
        window.dispatchEvent(new CustomEvent('osint:phone-lookup-complete', { detail: result }));
        console.log('[CaseManagementPanel] Dispatched osint:phone-lookup-complete event');
        
        // Also dispatch case update event to refresh case list
        window.dispatchEvent(new CustomEvent('case:updated'));
      } else {
        console.error('[CaseManagementPanel] Lookup failed:', result.error);
        this._phoneStatus.textContent = `Lookup failed: ${result.error || 'Unknown error'}`;
        this._phoneStatus.style.color = '#ff6b6b';
      }
    } catch (error) {
      console.error('[CaseManagementPanel] Phone OSINT lookup error:', error);
      this._phoneStatus.textContent = `Error: ${error.message || 'Lookup failed'}`;
      this._phoneStatus.style.color = '#ff6b6b';
    } finally {
      this._lookupBtn.textContent = 'Lookup';
      this._lookupBtn.disabled = false;
    }
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
      // Add click handler to show case details
      item.addEventListener('click', () => {
        this.onCaseSelected(c);
        // Dispatch event to show case details panel
        window.dispatchEvent(new CustomEvent('case:selected', { detail: c }));
      });
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
