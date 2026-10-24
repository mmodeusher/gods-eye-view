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
   * @param {import('../../investigation/osintService.js').OSINTService} [options.osintService]
   */
  constructor(options) {
    const opts = options || {};
    this.annotationEngine = opts.annotationEngine;
    this.annotationPersistence = opts.annotationPersistence;
    this.caseManager = opts.caseManager;
    this.onMetadataChanged = opts.onMetadataChanged;
    this.osintService = opts.osintService || null;
    this._chrome = opts.panelChrome || null;
    this._lifetime = new UiLifetime();
    this._container = null;
    this._form = null;
    this._currentAnnotationId = null;
    this._currentPhoneOSINT = null;

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

    // OSINT results section (phone number lookup results)
    const osintSection = this._createOSINTResultsSection();

    inner.appendChild(header);
    inner.appendChild(content);
    this._panel.appendChild(glow);
    this._panel.appendChild(inner);

    this._kvContainer = kvContainer;
    this._osintResultsContainer = osintSection;
    this._collapseBtn = collapseBtn;
  }

  /**
   * Create the OSINT results display section
   * @returns {HTMLElement}
   * @private
   */
  _createOSINTResultsSection() {
    const section = document.createElement('div');
    section.className = 'osint-results-section';
    section.style.marginTop = '12px';
    section.style.borderTop = '1px solid #397080';
    section.style.paddingTop = '8px';

    // Section header
    const header = document.createElement('div');
    header.className = 'osint-results-header';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '6px';
    header.style.marginBottom = '8px';

    const icon = document.createElement('span');
    icon.className = 'osint-icon';
    icon.textContent = '\uD83D\uDD0D';
    icon.style.fontSize = '14px';

    const title = document.createElement('span');
    title.className = 'osint-results-title';
    title.textContent = 'OSINT Results';
    title.style.fontSize = '12px';
    title.style.fontWeight = '600';
    title.style.color = '#e3faff';
    title.style.letterSpacing = '0.5px';

    header.append(icon, title);

    // Results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'osint-results-container';
    resultsContainer.style.fontSize = '11px';
    resultsContainer.style.color = '#8ab4c0';
    resultsContainer.style.lineHeight = '1.5';

    section.append(header, resultsContainer);

    this._osintResultsContainer = resultsContainer;

    return section;
  }

  /**
   * Set OSINT phone lookup results for display
   * @param {import('../../investigation/osintService.js').PhoneOSINTResult|null} osintData
   */
  setOSINTResults(osintData) {
    this._currentPhoneOSINT = osintData;
    
    if (!this._osintResultsContainer) return;

    if (!osintData || !osintData.success) {
      this._osintResultsContainer.innerHTML = '<div style="color: #668899; font-style: italic;">No OSINT data available</div>';
      return;
    }

    let html = '';

    // Phone number display
    if (osintData.parsed) {
      html += `<div class="osint-phone-number" style="color: #4ade80; font-weight: 600; margin-bottom: 6px;">`;
      html += `📞 ${osintData.parsed.national || osintData.parsed.e164 || osintData.phoneNumber}`;
      html += `</div>`;

      // Type badge
      if (osintData.parsed.type === 'toll-free') {
        html += `<div class="osint-type-badge" style="display: inline-block; padding: 2px 6px; background: #1a3a4a; border: 1px solid #397080; border-radius: 3px; font-size: 10px; color: #fbbf24; margin-bottom: 6px;">TOLL-FREE</div>`;
      } else if (osintData.parsed.type === 'premium') {
        html += `<div class="osint-type-badge" style="display: inline-block; padding: 2px 6px; background: #1a3a4a; border: 1px solid #397080; border-radius: 3px; font-size: 10px; color: #ef4444; margin-bottom: 6px;">PREMIUM RATE</div>`;
      }
    }

    // Geolocation data
    if (osintData.geolocation) {
      const geo = osintData.geolocation;
      html += `<div class="osint-geolocation" style="margin-top: 6px;">`;
      html += `<div class="osint-geo-row" style="display: flex; gap: 4px; margin-bottom: 3px;">`;
      html += `<span style="color: #668899;">Area Code:</span> <span style="color: #e3faff;">${geo.areaCode}</span>`;
      html += `</div>`;
      html += `<div class="osint-geo-row" style="display: flex; gap: 4px; margin-bottom: 3px;">`;
      html += `<span style="color: #668899;">Location:</span> <span style="color: #e3faff;">${geo.city}, ${geo.state}</span>`;
      html += `</div>`;
      
      if (geo.latitude && geo.longitude) {
        html += `<div class="osint-geo-row" style="display: flex; gap: 4px; margin-bottom: 3px;">`;
        html += `<span style="color: #668899;">Coordinates:</span> <span style="color: #e3faff;">${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}</span>`;
        html += `</div>`;
      }

      if (geo.counties && geo.counties.length > 0) {
        html += `<div class="osint-geo-row" style="display: flex; gap: 4px; margin-bottom: 3px;">`;
        html += `<span style="color: #668899;">Counties:</span> <span style="color: #e3faff;">${geo.counties.slice(0, 3).join(', ')}</span>`;
        html += `</div>`;
      }

      if (geo.timezones && geo.timezones.length > 0) {
        const tz = geo.primaryTimezone || geo.timezones[0];
        html += `<div class="osint-geo-row" style="display: flex; gap: 4px;">`;
        html += `<span style="color: #668899;">Timezone:</span> <span style="color: #e3faff;">${tz?.abbreviation || 'N/A'} (${tz?.name || 'Unknown'})</span>`;
        html += `</div>`;
      }

      html += `</div>`;
    }

    // Carrier info
    if (osintData.carrier) {
      html += `<div class="osint-carrier" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #2a4a5a;">`;
      html += `<div class="osint-carrier-row" style="display: flex; gap: 4px; margin-bottom: 3px;">`;
      html += `<span style="color: #668899;">Type:</span> <span style="color: #e3faff; text-transform: capitalize;">${osintData.carrier.type}</span>`;
      html += `</div>`;
      if (osintData.carrier.note) {
        html += `<div class="osint-carrier-note" style="font-size: 10px; color: #668899; font-style: italic;">${osintData.carrier.note}</div>`;
      }
      html += `</div>`;
    }

    // Timestamp
    if (osintData.timestamp) {
      const lookupTime = new Date(osintData.timestamp);
      html += `<div class="osint-timestamp" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #2a4a5a; font-size: 10px; color: #668899;">`;
      html += `Lookup: ${lookupTime.toLocaleString()}`;
      html += `</div>`;
    }

    this._osintResultsContainer.innerHTML = html;
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

    // Check for OSINT phone data in annotation metadata
    if (ext.metadata?.type === 'phone_osint') {
      this.setOSINTResults({
        success: true,
        phoneNumber: ext.metadata.phoneNumber,
        parsed: ext.metadata.parsed,
        geolocation: ext.metadata.geolocation,
        carrier: ext.metadata.carrier,
        tollFree: ext.metadata.tollFree || false,
        premiumRate: ext.metadata.premiumRate || false,
        timestamp: ext.metadata.timestamp
      });
    } else {
      this.setOSINTResults(null);
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
