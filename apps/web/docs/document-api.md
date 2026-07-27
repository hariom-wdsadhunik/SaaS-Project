# LeadPilot AI CRM — Document API Specification

**Module:** Versioned Document API  
**Base Route:** `/api/v1/`  

---

## Endpoint Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/documents` | `GET` | Searches documents by name, folder, contact, lead, or deal. |
| `/api/v1/documents` | `DELETE` | Removes a document from the storage repository. |
| `/api/v1/folders` | `GET` | Lists documents contained within a specific folder. |
| `/api/v1/folders` | `POST` | Creates a new folder in the hierarchy. |
| `/api/v1/uploads` | `POST` | Processes a managed document upload pipeline. |
| `/api/v1/shares` | `POST` | Grants explicit document permissions to users. |
