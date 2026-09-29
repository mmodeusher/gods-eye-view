# OSINT Case Management Design Specification

## Overview
This document outlines the design for extending **God's Eye View** with OSINT capabilities, specifically focusing on **Case Management** and **Persistent Annotations**.

## 1. Data Models

### 1.1 Case
A `Case` is a logical grouping of annotations related to a specific investigation.

```typescript
interface Case {
  id: string;             // Unique UUID
  name: string;           // Human-readable name
  description?: string;   // Optional detailed description
  createdAt: number;      // Timestamp
  updatedAt: number;      // Timestamp
  annotationIds: string[]; // List of annotation IDs belonging to this case
}
```

### 1.2 OSINT Annotation
An extension of the existing `Annotation` type in `src/annotations/annotationEngine.js`.

```typescript
interface OSINTAnnotation extends Annotation {
  caseId: string;         // Reference to the parent Case
  source: 'manual' | 'voice' | 'import';
  metadata: Record<string, any>; // Flexible storage for OSINT-specific data (e.g., vessel IMO, owner)
  isPersistent: boolean;  // If true, ignores the default TTL
}
```

## 2. Core Services

### 2.1 `CaseManager`
A singleton service responsible for the lifecycle of cases.

**Responsibilities:**
*   CRUD operations for `Case` objects.
*   Maintaining the mapping between `Case` and `Annotation`.
*   Persistence of `Case` data to `localStorage`.
*   Providing an observable state for the UI.

**Proposed API:**
*   `createCase(name: string, description?: string): Case`
*   `getCase(id: string): Case | undefined`
*   `listCases(): Case[]`
*   `deleteCase(id: string): void`
*   `addAnnotationToCase(caseId: string, annotationId: string): void`
*   `removeAnnotationFromCase(caseId: string, annotationId: string): void`
*   `getActiveCaseId(): string | null`
*   `setActiveCase(id: string | null): void`

### 2.2 `AnnotationPersistence`
A service to handle the serialization and deserialization of annotations.

**Responsibilities:**
*   Saving/loading `OSINTAnnotation` objects to `localStorage`.
*   Ensuring that when an annotation is deleted from the `annotationEngine`, it is also removed from the `CaseManager` and storage.

## 3. Integration Points

### 3.1 `AnnotationEngine` (Modification)
The `annotationEngine.js` must be updated to:
1.  Accept an optional `caseId` and `metadata` in its `annotate()` method.
2.  Support an `isPersistent` flag to bypass the `DEFAULT_TTL_MS` logic.
3.  Emit events when annotations are created/removed that `CaseManager` can listen to.

### 3.2 `ApplicationTools` (Extension)
The `createApplicationTools` function will instantiate the `CaseManager` and `AnnotationPersistence`.

### 3.3 UI Components (Future)
*   **Case Panel:** A sidebar to manage cases.
*   **Annotation Detail Panel:** To view/edit metadata of a selected annotation.
*   **Data Toggles:** Integration with existing layer management to show/hide annotations by case.

## 4. Implementation Roadmap
1.  **[Phase 1]** Define interfaces and implement `CaseManager` with `localStorage` persistence.
2.  **[Phase 2]** Modify `AnnotationEngine` to support `caseId` and persistence.
3.  **[Phase 3]** Implement `AnnotationPersistence` to sync engine state with storage.
4.  **[Phase 4]** Build UI components for case selection and annotation metadata.
