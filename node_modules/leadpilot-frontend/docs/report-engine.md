# Report Engine & Export Architecture

**Module:** Report Engine  
**Location:** `src/platform/analytics/reports/`  

---

## 1. Export Formats

- **CSV (`ReportExporter.toCSV`)**: Standard comma-separated values format.
- **Excel (`ReportExporter.toExcel`)**: Formatted tab-separated values for Microsoft Excel compatibility.
- **PDF (`ReportExporter.toPDFMock`)**: Binary stream representation for visual reports.

## 2. Automated Delivery Scheduling

`ReportScheduler.ts` connects with `JobScheduler` to deliver scheduled cron reports to designated recipient email lists automatically.
