import { Report } from "@/domain/analytics/types";

export type ExportFormat = "CSV" | "EXCEL" | "PDF";

export class ReportExporter {
  public static export(report: Report, format: ExportFormat): string {
    switch (format) {
      case "CSV":
        return this.toCSV(report);
      case "EXCEL":
        return this.toExcel(report);
      case "PDF":
        return this.toPDFMock(report);
      default:
        return this.toCSV(report);
    }
  }

  private static toCSV(report: Report): string {
    const headers = report.columns.join(",");
    const rows = report.data.map((row) =>
      report.columns.map((col) => `"${String(row[col] ?? "")}"`).join(",")
    );
    return `${headers}\n${rows.join("\n")}`;
  }

  private static toExcel(report: Report): string {
    // Formatted Tab-Separated Spreadsheet representation for Excel compatibility
    const headers = report.columns.join("\t");
    const rows = report.data.map((row) =>
      report.columns.map((col) => String(row[col] ?? "")).join("\t")
    );
    return `${headers}\n${rows.join("\n")}`;
  }

  private static toPDFMock(report: Report): string {
    return `[PDF Binary Export Stream for Report: ${report.title} (${report.data.length} rows)]`;
  }
}
