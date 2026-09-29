import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {import('./types.js').Case} Case
 */

/**
 * CaseManager manages the lifecycle and persistence of investigation cases.
 * It uses localStorage for persistence.
 */
export class CaseManager {
  /** @type {Map<string, import('./types.js').Case>} */
  #cases = new Map();
  /** @type {string | null} */
  #activeCaseId = null;
  /** @type {Set<Function>} */
  #listeners = new Set();
  /** @type {string} */
  #STORAGE_KEY = 'gev_osint_cases';

  constructor() {
    this.#loadFromStorage();
  }

  /**
   * Creates a new case.
   * @param {string} name
   * @param {string} [description]
   * @returns {import('./types.js').Case}
   */
  createCase(name, description) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const newCase = {
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      annotationIds: [],
    };

    this.#cases.set(id, newCase);
    this.#saveToStorage();
    this.#notify();
    return newCase;
  }

  /**
   * Retrieves a case by ID.
   * @param {string} id
   * @returns {import('./types.js').Case | undefined}
   */
  getCase(id) {
    return this.#cases.get(id);
  }

  /**
   * Returns all cases.
   * @returns {import('./types.js').Case[]}
   */
  listCases() {
    return Array.from(this.#cases.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Deletes a case.
   * @param {string} id
   */
  deleteCase(id) {
    if (this.#cases.delete(id)) {
      if (this.#activeCaseId === id) {
        this.#activeCaseId = null;
      }
      this.#saveToStorage();
      this.#notify();
    }
  }

  /**
   * Adds an annotation ID to a case.
   * @param {string} caseId
   * @param {string} annotationId
   */
  addAnnotationToCase(caseId, annotationId) {
    const c = this.#cases.get(caseId);
    if (c && !c.annotationIds.includes(annotationId)) {
      c.annotationIds.push(annotationId);
      c.updatedAt = Date.now();
      this.#saveToStorage();
      this.#notify();
    }
  }

  /**
   * Removes an annotation ID from a case.
   * @param {string} caseId
   * @param {string} annotationId
   */
  removeAnnotationFromCase(caseId, annotationId) {
    const c = this.#cases.get(caseId);
    if (c) {
      const index = c.annotationIds.indexOf(annotationId);
      if (index !== -1) {
        c.annotationIds.splice(index, 1);
        c.updatedAt = Date.now();
        this.#saveToStorage();
        this.#notify();
      }
    }
  }

  /**
   * Sets the currently active case.
   * @param {string | null} id
   */
  setActiveCase(id) {
    if (this.#activeCaseId !== id) {
      this.#activeCaseId = id;
      this.#notify();
    }
  }

  /**
   * Gets the ID of the active case.
   * @returns {string | null}
   */
  getActiveCaseId() {
    return this.#activeCaseId;
  }

  /**
   * Subscribes to changes in cases or the active case.
   * @param {Function} listener
   * @returns {Function} unsubscribe function
   */
  subscribe(listener) {
    this.#listeners.add(listener);
    // Immediately notify with current state
    listener({
      cases: this.listCases(),
      activeCaseId: this.#activeCaseId,
    });
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    const state = {
      cases: this.listCases(),
      activeCaseId: this.#activeCaseId,
    };
    for (const listener of this.#listeners) {
      try {
        listener(state);
      } catch (e) {
        console.error('[CaseManager] Listener failed:', e);
      }
    }
  }

  #saveToStorage() {
    try {
      const data = JSON.stringify({
        cases: Array.from(this.#cases.entries()),
        activeCaseId: this.#activeCaseId,
      });
      localStorage.setItem(this.#STORAGE_KEY, data);
    } catch (e) {
      console.error('[CaseManager] Failed to save to localStorage:', e);
    }
  }

  #loadFromStorage() {
    try {
      const data = localStorage.getItem(this.#STORAGE_KEY);
      if (!data) return;

      const parsed = JSON.parse(data);
      this.#cases = new Map(parsed.cases);
      this.#activeCaseId = parsed.activeCaseId || null;
    } catch (e) {
      console.error('[CaseManager] Failed to load from localStorage:', e);
      this.#cases = new Map();
    }
  }
}
