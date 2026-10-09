import { UiLifetime } from './uiLifetime.js';

/**
 * AnnotationMetadataPanel provides a UI for editing metadata of a selected annotation.
 * It is typically mounted to the right-side context rail.
 */
export class AnnotationMetadataPanel {
  /**
   * @param {object} options
   * @param {import('../../annotations/annotationEngine.js').AnnotationEngine} options.annotationEngine
   * @param {import('../../investigation/annotationPersistence.js').AnnotationPersistence} options.annotationPersistence
   * @param {import('../../investigation/caseManager.js').CaseManager} options.caseManager
   * @param {function} options.onMetadataChanged
   */
  constructor(options) {
    const opts = options || {};
    this.annotationEngine = opts.annotationEngine;
    this.annotationPersistence = opts.annotationPersistence;
    this.caseManager = opts.caseManager;
    this.onMetadataChanged = opts.onMetadataChanged;
    this._chrome = opts.panelChrome || null;
    this._lifetime = new UiLifetime();
    this._container = null;
    this._form = null;
    this._currentAnnotationId = null;

    this._createElements();
  }

  _createElements() {
    this._panel = document.createElement('div');
    this._panel.id = 'annotation-metadata-panel';
    this._panel.className = 'panel-collapsible collapsed';
    this._panel.setAttribute('data-panel-id', 'annotation-metadata-panel');

    // Glow layer for proper z-index and visual consistency
    const glow = document.createElement('div');
    glow.className = 'panel-glow';

    // Inner container holds header + content together (matching right rail pattern)
    const inner = document.createElement('div');
    inner.className = 'annotation-metadata-panel-inner';

    // Header inside inner container — must be inside for proper scrolling behavior
    const header = document.createElement('div');
    header.className = 'panel-header';
    const title = document.createElement('span');
    title.className = 'panel-title';
    title.textContent = 'DETAILS';
    const divider = document.createElement('span');
    divider.className = 'panel-divider';
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'panel-collapse-btn';
    collapseBtn.dataset.collapseTarget = 'annotation-metadata-panel';
    collapseBtn.textContent = '+';
    collapseBtn.setAttribute('aria-expanded', 'false');
    collapseBtn.setAttribute('aria-label', 'Collapse Annotation Details');

    header.append(title, divider, collapseBtn);

    const content = document.createElement('div');
    content.className = 'panel-content';

    this._form = document.createElement('form');
    this._form.className = 'metadata-form';
    this._form.addEventListener('submit', (e) => this._handleSubmit(e));

    const labelField = this._createField('label', 'Label', 'text');
    const sourceField = this._createField('source', 'Source', 'text');
    const caseField = this._createField('caseId', 'Case ID', 'text');

    this._form.append(labelField, sourceField, caseField);

    const kvContainer = document.createElement('div');
    kvContainer.id = 'metadata-kv-container';
    kvContainer.className = 'metadata-kv-container';

    const addKvBtn = document.createElement('button');
    addKvBtn.type = 'button';
    addKvBtn.textContent = '+ Add Metadata Field';
    addKvBtn.className = 'metadata-kv-add-btn';

    content.append(this._form, kvContainer, addKvBtn);

    inner.appendChild(header);
    inner.appendChild(content);
    this._panel.appendChild(glow);
    this._panel.appendChild(inner);

    this._kvContainer = kvContainer;
    this._collapseBtn = collapseBtn;
  }

  _createField(name, labelText, type) {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-row';
    wrapper.style.marginBottom = '8px';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.display = 'block';
    label.style.fontSize = '11px';
    label.style.color = '#668899';

    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.style.width = '100%';
    input.style.padding = '4px';
    input.style.backgroundColor = '#10242e';
    input.style.color = '#e3faff';
    input.style.border = '1px solid #397080';
    input.style.boxSizing = 'border-box';

    wrapper.append(label, input);
    return wrapper;
  }

  _addKvRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'metadata-kv-row';
    row.style.display = 'flex';
    row.style.gap = '4px';
    row.style.marginBottom = '4px';

    const keyInput = document.createElement('input');
    keyInput.name = 'kv-key';
    keyInput.placeholder = 'Key';
    keyInput.value = key;
    keyInput.style.width = '40%';
    keyInput.style.padding = '4px';
    keyInput.style.backgroundColor = '#10242e';
    keyInput.style.color = '#e3faff';
    keyInput.style.border = '1px solid #397080';
    keyInput.style.boxSizing = 'border-box';

    const valInput = document.createElement('input');
    valInput.name = 'kv-value';
    valInput.placeholder = 'Value';
    valInput.value = value;
    valInput.style.width = '50%';
    valInput.style.padding = '4px';
    valInput.style.backgroundColor = '#10242e';
    valInput.style.color = '#e3faff';
    valInput.style.border = '1px solid #397080';
    valInput.style.boxSizing = 'border-box';

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '×';
    delBtn.style.width = '10%';
    delBtn.style.cursor = 'pointer';
    delBtn.addEventListener('click', () => row.remove());

    row.append(keyInput, valInput, delBtn);
    this._kvContainer.appendChild(row);
  }

  mount(container) {
      this._container = container;
      this._container.appendChild(this._panel);
      
      // DIAGNOSTIC: Verify data-panel-id attribute exists for PanelChrome binding
      console.log('[AnnotationMetadataPanel] Mounted panel:', {
        id: this._panel.id,
        hasDataPanelIdAttr: this._panel.hasAttribute('data-panel-id'),
        datasetPanelId: this._panel.dataset.panelId,
        collapseBtnTarget: this._collapseBtn?.dataset.collapseTarget,
        buttonsFound: document.querySelectorAll('.panel-collapse-btn[data-collapse-target="annotation-metadata-panel"]').length,
        chromeAvailable: Boolean(this._chrome),
        panelClassName: this._panel.className,
        innerClassExists: Boolean(this._panel.querySelector('.annotation-metadata-panel-inner')),
      });
      
      // Trigger PanelChrome to discover the new collapse button
      this._chrome?.refresh();
    }

  _refreshTogglePanel() {
    this._collapseBtn.textContent = this._panel.classList.contains('collapsed') ? '+' : '−';
    this._collapseBtn.setAttribute('aria-expanded', String(!this._panel.classList.contains('collapsed')));
  }

  setAnnotation(annotation) {
    if (this._currentAnnotationId === annotation.id) return;
    this._currentAnnotationId = annotation.id;
    this._panel.classList.remove('collapsed');

    this._form.reset();
    const ext = annotation.extension || {};

    this._form.querySelector('[name="label"]').value = annotation.label || '';
    this._form.querySelector('[name="source"]').value = ext.source || '';
    this._form.querySelector('[name="caseId"]').value = ext.caseId || '';

    this._kvContainer.innerHTML = '';
    if (ext.metadata) {
      for (const [k, v] of Object.entries(ext.metadata)) {
        this._addKvRow(k, String(v));
      }
    }
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (!this._currentAnnotationId) return;

    const formData = new FormData(this._form);
    const extension = {
      source: formData.get('source') || undefined,
      caseId: formData.get('caseId') || undefined,
      metadata: {},
    };

    // Reconstruct custom metadata
    const kvRows = this._kvContainer.querySelectorAll('.metadata-kv-row');
    for (const row of kvRows) {
      const k = row.querySelector('[name="kv-key"]').value.trim();
      const v = row.querySelector('[name="kv-value"]').value.trim();
      if (k) extension.metadata[k] = v;
    }

    // In a real app, we would call annotationEngine.updateAnnotation(...)
    // For now, we just trigger the callback.
    this.onMetadataChanged(this._currentAnnotationId, extension);
  }

  destroy() {
    this._unsubscribe?.();
    this._panel.remove();
    this._lifetime.destroy();
  }
}
