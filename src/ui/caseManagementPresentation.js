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
   */
  constructor(manager, {
    requestRender = governorRequestRender,
    onCaseSelected,
    panelChrome,
  } = {}) {
    this.manager = manager;
    this.onCaseSelected = onCaseSelected;
    this.requestRender = requestRender;
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
    }
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
