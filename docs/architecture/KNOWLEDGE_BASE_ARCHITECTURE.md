# OmniLife — Knowledge Base & Personal Information Hub Architecture

**Project:** OmniLife  
**Module:** Knowledge Base 2.0 (Phase 15)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 15 establishes OmniLife's **Knowledge Base & Personal Information Hub**. 

The core architectural principle of Phase 15 is:
> **Knowledge Base is a structured, interconnected metadata layer built on top of OmniLife's existing Notes system.**

Existing Notes are preserved 100% without data loss or duplicate tables.

---

## 2. Entity Model & Relationship Diagram

```text
                     KNOWLEDGE BASE
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           TOPICS         TAGS        REFERENCES
             │
             ▼
           NOTES
             │
       ┌─────┼─────────────┐
       ▼     ▼             ▼
   ACADEMIC PROJECTS    PERSONAL
       │     │             │
       └─────┼─────────────┘
             ▼
        RELATIONSHIPS
             │
             ▼
       GLOBAL SEARCH
```

---

## 3. Data Models & Metadata Contracts

- **Topics (`TopicItem`)**: `id`, `name`, `description`, `color`, `icon`, `parentTopicId`, `isArchived`.
- **Note Relationships (`NoteRelationshipItem`)**: `id`, `sourceNoteId`, `targetNoteId`, `relationshipType` (`RELATED`, `REFERENCE`, `DERIVED_FROM`, `PART_OF`).
- **External References (`NoteReferenceItem`)**: `id`, `noteId`, `title`, `type` (`WEBSITE`, `BOOK`, `VIDEO`, `DOCUMENT`, `ARTICLE`, `OTHER`), `url`, `description`.
- **Knowledge Types**: `GENERAL`, `STUDY`, `REFERENCE`, `CONCEPT`, `IDEA`, `GUIDE`, `PERSONAL`, `ACADEMIC`.

---

## 4. Cross-Module & Global Search Integration

- **Phase 14 Academic & Phase 13 Projects**: Notes reference `courseId` or `projectId` directly inside `notesService.ts` metadata.
- **Phase 11 Global Search**: `KnowledgeSearchProvider.ts` indexes Topics, Notes, Tags, and External References for `Ctrl + K` Command Palette searches.
