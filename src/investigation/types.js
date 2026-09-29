/**
 * @typedef {Object} Case
 * @property {string} id - Unique UUID
 * @property {string} name - Human-readable name
 * @property {string} [description] - Optional detailed description
 * @property {number} createdAt - Timestamp
 * @property {number} updatedAt - Timestamp
 * @property {string[]} annotationIds - List of annotation IDs belonging to this case
 */

/**
 * @typedef {Object} OSINTMetadata
 * @property {Record<string, any>} [data] - Flexible storage for OSINT-specific data
 */

/**
 * @typedef {Object} OSINTAnnotationExtension
 * @property {string} caseId - Reference to the parent Case
 * @property {'manual' | 'voice' | 'import'} source - How it was created
 * @property {OSINTMetadata} [metadata] - OSINT-specific data
 * @property {boolean} isPersistent - If true, ignores the default TTL
 */
