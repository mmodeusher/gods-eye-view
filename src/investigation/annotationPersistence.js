/**
 * @typedef {import('./types.js').Case} Case
 * @typedef {import('./types.js').OSINTAnnotationExtension} OSINTAnnotationExtension
 */

import { CaseManager } from './caseManager.js';

/**
 * AnnotationPersistence manages the synchronization between the 
 * AnnotationEngine and persistent storage (localStorage).
 */
export class AnnotationPersistence {
  /** @type {CaseManager} */
  #caseManager;
  /** @type {string} */
  #STORAGE_KEY = 'gev_osint_annotations';
  /** @type {Map<string, import('./types.js').OSINTAnnotationExtension>} */
  #persistentAnnotations = new Map();

  /**
   * @param {CaseManager} caseManager
   */
  constructor(caseManager) {
    this.#caseManager = caseManager;
    this.#loadFromStorage();
  }

  /**
   * Persists an annotation's OSINT metadata and persistence flag.
   * @param {string} annotationId
   * @param {import('./types.js').OSINTAnnotationExtension} extension
   */
  persist(annotationId, extension) {
    this.#persistentAnnotations.set(annotationId, extension);
    this.#saveToStorage();
  }

  /**
   * Removes an annotation from persistence.
   * @param {string} annotationId
   */
  remove(annotationId) {
    this.#persistentAnnotations.delete(annotationId);
    this.#saveToStorage();
  }

  /**
   * Retrieves the extension for an annotation.
   * @param {string} annotationId
   * @returns {import('./types.js').OSINTAnnotationExtension | undefined}
   */
  get(annotationId) {
    return this.#persistentAnnotations.get(annotationId);
  }

  /**
   * Returns all persisted annotations.
   * @returns {Map<string, import('./types.js').OSINTAnnotationExtension>}
   */
  getAll() {
    return this.#persistentAnnotations;
  }

  #saveToStorage() {
    try {
      const data = JSON.stringify(Array.from(this.#persistentAnnotations.entries()));
      localStorage.setItem(this.#STORAGE_KEY, data);
    } catch (e) {
      console.error('[AnnotationPersistence] Failed to save:', e);
    }
  }

  #loadFromStorage() {
    try {
      const data = localStorage.getItem(this.#STORAGE_KEY);
      if (!data) return;
      this.#persistentAnnotations = new Map(JSON.parse(data));
    } catch (e) {
      console.error('[AnnotationPersistence] Failed to load:', e);
      this.#persistentAnnotations = new Map();
    }
  }
}
