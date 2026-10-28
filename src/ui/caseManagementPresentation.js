import { CaseManagementPanel } from './caseManagementPanel.js';
import { governorRequestRender } from '../renderGovernor.js';

/** Own the case management panel and application reactions to lifecycle activity. */
export class CaseManagementPresentation {
  /**
   * @param {import('../../investigation/caseManager.js').CaseManager} manager
   * @param {object} [options]
   * @param {function} [options.onCaseSelected]
   * @param {function} [options.requestRender]
   * @param {import('./panelChrome.js').PanelChrome} [options.panelChrome]
   * @param {import('../../investigation/osintService.js').OSINTService} [options.osintService]
   */
  constructor(manager, {
    requestRender = governorRequestRender,
    onCaseSelected,
    panelChrome,
    osintService,
  } = {}) {
    this.manager = manager;
    this.onCaseSelected = onCaseSelected;
    this.requestRender = requestRender;
    this.osintService = osintService || null;
    this._panel = null;
    this._chrome = panelChrome || null;
    this._unsubscribe = manager.subscribe((state) => {
      this.requestRender('case-management-updated');
      this.refresh();
    });
  }

  get panel() {
    if (!this._panel) {
      this._panel = new CaseManagementPanel({
        caseManager: this.manager,
        onCaseSelected: this.onCaseSelected,
        panelChrome: this._chrome,
        osintService: this.osintService,
      });
    }
    return this._panel;
  }

  mount(container) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (el) {
      // DIAGNOSTIC: Verify panelChrome is available before mounting
      console.log('[CaseManagementPresentation] Mounting panel, chrome available:', Boolean(this._chrome));
      this.panel.mount(el);
      this._chrome?.refresh();
      
      // Listen for case selection events to show details
      window.addEventListener('case:selected', (event) => {
        this._showCaseDetails(event.detail);
      });
    }
  }
  
  _showCaseDetails(caseData) {
    console.log('[CaseManagementPresentation] Showing case details for:', caseData);
    // This would trigger the display of a case details panel
    // For now, we'll just log it - actual implementation would show a panel
    // In a real implementation, this would:
    // 1. Create a new panel or update existing one
    // 2. Fetch phone OSINT data for this case using osintService.getPhoneOSINTForCase(caseData.id)
    // 3. Display the data in a readable format
  }

  refresh() {
    this._panel?._refreshTogglePanel();
  }

  destroy() {
    this._chrome?.destroy();
    this._panel?.destroy();
    this._panel = null;
    this._unsubscribe?.();
    this._unsubscribe = null;
  }
}
