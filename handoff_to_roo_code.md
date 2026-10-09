# Task Overview
Integrate the `CaseManagementPanel` into the application's cockpit UI using the standard `PanelChrome` lifecycle and `LayerPresentation` mounting pattern. This ensures it behaves identically to existing panels (like Data Layers, CCTV, etc.) regarding visibility, layering, and collapse/expand functionality.

# Status
**COMPLETED**

# Summary of Work Done

## 1. Architecture Integration
Instead of manually mounting a DOM element, we implemented a `Presentation` layer that coordinates between the business logic (`CaseManager`) and the UI lifecycle (`PanelChrome`).

- **Created `src/ui/caseManagementPresentation.js`**: This class acts as the bridge, managing the lifecycle of the panel and ensuring it integrates with the main application's `PanelChrome` instance (owned by `StyleManager`).
- **Refactored `src/ui/caseManagementPanel.js`**: Updated the panel to use standard CSS classes (`panel`, `panel-collapsible`, `panel-header`, `panel-collapse-btn`, `panel-content`) and added `data-collapse-target="case-management-panel"` to allow `PanelChrome` to discover and control it.
- **Updated `src/app/tools.js`**: Replaced manual mounting logic with the new `CaseManagementPresentation.mount('left-panel-stack')` pattern, ensuring proper cleanup via `presentation.destroy()`.

## 2. Bug Fixes & Improvements

### Fixed: `TypeError: this._chrome?.mount is not a function`
- **Cause**: An attempt was made to call `.mount()` on a `PanelChrome` instance. `PanelChrome` is a controller that manages existing DOM elements; it is not a mountable component itself.
- **Resolution**: Removed the invalid `.mount()` call.

### Fixed: Non-functional Collapse/Expand Buttons
- **Cause**: Because panels are often added to the DOM dynamically, the `PanelChrome` controller (which scans the DOM for collapse buttons during initialization) was unaware of the new elements.
- **Resolution**: Added a `refresh()` method to `src/ui/panelChrome.js`. This method triggers a re-scan of the DOM for new elements with `data-collapse-target` attributes. `CaseManagementPresentation` now calls `this._chrome.refresh()` immediately after mounting the panel.

### Fixed: Visual Layering (Z-Order) Issues
- **Cause**: The panel was previously being managed by an isolated `PanelChrome` instance.
- **Resolution**: The panel now uses the primary `StyleManager.panelChrome` instance, ensuring it participates in the unified cockpit layout and respects correct z-order and layering.

### Enabled: Voice Control
- **Updated `src/voice/gevActions.js`**: Registered `'case-management-panel'` in `PANEL_IDS` and added natural language aliases (`'cases'`, `'investigation'`) in `PANEL_ALIASES`.

# Technical Details

- **Pattern**: `Presentation` manages `Panel` (DOM) + `PanelChrome` (Layout Controller).
- **Dynamic Discovery**: `PanelChrome.refresh()` is used to bind events to dynamically injected DOM elements.
- **Z-Order**: Managed by the main `StyleManager.panelChrome` instance.

# Files Modified
- `src/ui/caseManagementPresentation.js` (New)
- `src/ui/caseManagementPanel.js` (Refactored)
- `src/ui/panelChrome.js` (Added `refresh()`)
- `src/app/tools.js` (Refactored)
- `src/voice/gevActions.js` (Updated)

# Next Steps
- Final verification of visual layering and collapse/expand responsiveness in the live application.
- Final verification of voice command functionality.
