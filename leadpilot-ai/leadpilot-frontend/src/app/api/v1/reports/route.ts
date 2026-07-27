import { NextResponse } from "next/server";
import { ReportEngine } from "@/platform/analytics/reports/ReportEngine";
import { ExportFormat } from "@/platform/analytics/reports/ReportExporter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("id") || "rpt-default";
  const format = searchParams.get("export") as ExportFormat;

  const report = await ReportEngine.getReport(reportId);

  if (format && report) {
    const exportedContent = ReportEngine.exportReport(report, format);
    return new Response(exportedContent, {
      status: 200,
      headers: {
        "Content-Type": format === "CSV" ? "text/csv" : format === "EXCEL" ? "text/tab-separated-values" : "application/pdf",
        "Content-Disposition": `attachment; filename="${report.title}.${format.toLowerCase()}"`,
      },
    });
  }

  return NextResponse.json({ version: "v1", success: true, data: report });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const createdReport = await ReportEngine.createReport({
      title: body.title || "Custom Sales & Deal Velocity Report",
      category: body.category || "REVENUE",
      filters: body.filters,
      columns: body.columns,
    });

    return NextResponse.json({ version: "v1", success: true, data: createdReport }, { status: 201 });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Invalid report configuration payload" }, { status: 400 });
  }
}
