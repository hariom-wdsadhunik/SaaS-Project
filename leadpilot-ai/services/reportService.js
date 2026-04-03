const { supabase } = require("../db/supabase");

class ReportService {
  formatCurrency(amount) {
    if (!amount) return "₹0";
    if (amount >= 10000000) return "₹" + (amount / 10000000).toFixed(2) + " Cr";
    if (amount >= 100000) return "₹" + (amount / 100000).toFixed(2) + " L";
    if (amount >= 1000) return "₹" + (amount / 1000).toFixed(2) + " K";
    return "₹" + amount.toLocaleString("en-IN");
  }

  async generateLeadsReport({ teamId, startDate, endDate, filters }) {
    try {
      let query = supabase.from("leads").select("*").eq("team_id", teamId);

      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.source) {
        query = query.eq("source", filters.source);
      }

      const { data: leads, error } = await query;
      if (error) throw error;

      const total = leads.length;
      const byStatus = {};
      const bySource = {};
      const byPriority = {};
      const byMonth = {};

      leads.forEach((lead) => {
        byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;

        bySource[lead.source] = (bySource[lead.source] || 0) + 1;

        byPriority[lead.ai_priority] = (byPriority[lead.ai_priority] || 0) + 1;

        const month = new Date(lead.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        byMonth[month] = (byMonth[month] || 0) + 1;
      });

      const closed = leads.filter((l) => l.status === "closed").length;
      const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;

      const avgScore =
        leads.filter((l) => l.ai_score).reduce((sum, l) => sum + l.ai_score, 0) /
          leads.filter((l) => l.ai_score).length || 0;

      return {
        success: true,
        report: {
          type: "leads",
          generatedAt: new Date().toISOString(),
          dateRange: { startDate, endDate },
          summary: {
            total,
            closed,
            conversionRate: conversionRate + "%",
            averageScore: avgScore.toFixed(1),
          },
          byStatus,
          bySource,
          byPriority,
          byMonth,
          leads: leads.slice(0, 100),
        },
      };
    } catch (error) {
      console.error("Generate leads report error:", error);
      return { success: false, error: error.message };
    }
  }

  async generateDealsReport({ teamId, startDate, endDate }) {
    try {
      let query = supabase.from("deals").select("*").eq("team_id", teamId);

      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data: deals, error } = await query;
      if (error) throw error;

      const totalValue = deals.reduce((sum, d) => sum + (parseFloat(d.deal_value) || 0), 0);
      const totalCommission = deals.reduce((sum, d) => sum + (parseFloat(d.commission_amount) || 0), 0);

      const byStage = {};
      const byMonth = {};
      const won = deals.filter((d) => d.deal_stage === "Closed Won");
      const lost = deals.filter((d) => d.deal_stage === "Closed Lost");

      deals.forEach((deal) => {
        byStage[deal.deal_stage] = (byStage[deal.deal_stage] || 0) + 1;

        const month = new Date(deal.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        byMonth[month] = byMonth[month] || { count: 0, value: 0 };
        byMonth[month].count++;
        byMonth[month].value += parseFloat(deal.deal_value) || 0;
      });

      const winRate = deals.length > 0 ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) : 0;

      return {
        success: true,
        report: {
          type: "deals",
          generatedAt: new Date().toISOString(),
          dateRange: { startDate, endDate },
          summary: {
            totalDeals: deals.length,
            totalValue: this.formatCurrency(totalValue),
            totalCommission: this.formatCurrency(totalCommission),
            wonCount: won.length,
            lostCount: lost.length,
            winRate: winRate + "%",
            avgDealValue: this.formatCurrency(deals.length > 0 ? totalValue / deals.length : 0),
          },
          byStage,
          byMonth,
          recentDeals: deals.slice(0, 20),
        },
      };
    } catch (error) {
      console.error("Generate deals report error:", error);
      return { success: false, error: error.message };
    }
  }

  async generatePerformanceReport({ teamId, startDate, endDate }) {
    try {
      const { data: teamMembers, error: membersError } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("team_id", teamId);

      if (leadsError) throw leadsError;

      const memberStats = teamMembers.map((member) => {
        const memberLeads = leads.filter((l) => l.assigned_to === member.id);
        const newLeads = memberLeads.filter((l) => l.status === "new").length;
        const contacted = memberLeads.filter((l) => l.status === "contacted").length;
        const closed = memberLeads.filter((l) => l.status === "closed").length;

        return {
          id: member.id,
          name: member.name,
          email: member.email,
          totalLeads: memberLeads.length,
          newLeads,
          contacted,
          closed,
          conversionRate: memberLeads.length > 0 ? ((closed / memberLeads.length) * 100).toFixed(1) + "%" : "0%",
        };
      });

      const topPerformers = [...memberStats]
        .sort((a, b) => b.closed - a.closed)
        .slice(0, 5);

      return {
        success: true,
        report: {
          type: "performance",
          generatedAt: new Date().toISOString(),
          dateRange: { startDate, endDate },
          summary: {
            totalTeamMembers: teamMembers.length,
            totalLeads: leads.length,
            overallClosed: leads.filter((l) => l.status === "closed").length,
            overallConversion:
              leads.length > 0
                ? (
                    (leads.filter((l) => l.status === "closed").length / leads.length) *
                    100
                  ).toFixed(1) + "%"
                : "0%",
          },
          byMember: memberStats,
          topPerformers,
        },
      };
    } catch (error) {
      console.error("Generate performance report error:", error);
      return { success: false, error: error.message };
    }
  }

  async generateActivityReport({ teamId, startDate, endDate }) {
    try {
      let query = supabase.from("activity_logs").select("*").eq("team_id", teamId);

      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data: activities, error } = await query;
      if (error) throw error;

      const byAction = {};
      const byUser = {};
      const byDay = {};

      activities.forEach((activity) => {
        byAction[activity.action] = (byAction[activity.action] || 0) + 1;

        const day = new Date(activity.created_at).toLocaleDateString();
        byDay[day] = (byDay[day] || 0) + 1;
      });

      return {
        success: true,
        report: {
          type: "activity",
          generatedAt: new Date().toISOString(),
          dateRange: { startDate, endDate },
          summary: {
            totalActivities: activities.length,
            uniqueActions: Object.keys(byAction).length,
          },
          byAction,
          byDay,
          recentActivities: activities.slice(0, 50),
        },
      };
    } catch (error) {
      console.error("Generate activity report error:", error);
      return { success: false, error: error.message };
    }
  }

  generatePDFHtml(report) {
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .header h1 { color: #3b82f6; margin: 0; }
        .header .subtitle { color: #666; margin-top: 5px; }
        .summary { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; }
        .summary-card { flex: 1; min-width: 150px; background: #f8fafc; padding: 20px; border-radius: 8px; }
        .summary-card .label { font-size: 12px; color: #666; text-transform: uppercase; }
        .summary-card .value { font-size: 24px; font-weight: bold; color: #1f2937; }
        .section { margin-bottom: 30px; }
        .section h2 { border-left: 4px solid #3b82f6; padding-left: 10px; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; }
        tr:hover { background: #f9fafb; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    `;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LeadPilot AI - ${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <h1>LeadPilot AI</h1>
          <div class="subtitle">${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</div>
          <div class="subtitle">Generated: ${new Date(report.generatedAt).toLocaleString()}</div>
        </div>
    `;

    if (report.summary) {
      html += `<div class="summary">`;
      Object.entries(report.summary).forEach(([key, value]) => {
        html += `
          <div class="summary-card">
            <div class="label">${key.replace(/([A-Z])/g, " $1").trim()}</div>
            <div class="value">${value}</div>
          </div>
        `;
      });
      html += `</div>`;
    }

    if (report.byStatus) {
      html += `
        <div class="section">
          <h2>Leads by Status</h2>
          <table>
            <tr><th>Status</th><th>Count</th></tr>
            ${Object.entries(report.byStatus)
              .map(([status, count]) => `<tr><td>${status}</td><td>${count}</td></tr>`)
              .join("")}
          </table>
        </div>
      `;
    }

    if (report.byStage) {
      html += `
        <div class="section">
          <h2>Deals by Stage</h2>
          <table>
            <tr><th>Stage</th><th>Count</th></tr>
            ${Object.entries(report.byStage)
              .map(([stage, count]) => `<tr><td>${stage}</td><td>${count}</td></tr>`)
              .join("")}
          </table>
        </div>
      `;
    }

    if (report.topPerformers) {
      html += `
        <div class="section">
          <h2>Top Performers</h2>
          <table>
            <tr><th>Name</th><th>Total Leads</th><th>Closed</th><th>Conversion Rate</th></tr>
            ${report.topPerformers
              .map((p) => `<tr><td>${p.name}</td><td>${p.totalLeads}</td><td>${p.closed}</td><td>${p.conversionRate}</td></tr>`)
              .join("")}
          </table>
        </div>
      `;
    }

    html += `
      <div class="footer">
        <p>Generated by LeadPilot AI CRM</p>
        <p>This report contains confidential business data.</p>
      </div>
    </body>
    </html>
    `;

    return html;
  }
}

const reportService = new ReportService();

exports.generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, filters, format = "json" } = req.body;
    const teamId = req.user?.team_id;
    const userId = req.user?.id;

    if (!teamId) {
      return res.status(400).json({ error: "Team ID required" });
    }

    if (!type) {
      return res.status(400).json({ error: "Report type is required" });
    }

    let result;
    switch (type) {
      case "leads":
        result = await reportService.generateLeadsReport({ teamId, startDate, endDate, filters });
        break;
      case "deals":
        result = await reportService.generateDealsReport({ teamId, startDate, endDate });
        break;
      case "performance":
        result = await reportService.generatePerformanceReport({ teamId, startDate, endDate });
        break;
      case "activity":
        result = await reportService.generateActivityReport({ teamId, startDate, endDate });
        break;
      default:
        return res.status(400).json({ error: "Invalid report type" });
    }

    if (!result.success) {
      return res.status(500).json(result);
    }

    await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        team_id: teamId,
        action: "generate_report",
        description: `Generated ${type} report`,
        metadata: { type, startDate, endDate },
        created_at: new Date().toISOString(),
      },
    ]);

    if (format === "html") {
      const html = reportService.generatePDFHtml(result.report);
      res.setHeader("Content-Type", "text/html");
      return res.send(html);
    }

    res.json(result);
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({ error: "Failed to generate report: " + error.message });
  }
};

exports.getReportTypes = async (req, res) => {
  res.json({
    types: [
      { id: "leads", name: "Leads Report", description: "Lead metrics, status distribution, sources, and AI scores" },
      { id: "deals", name: "Deals Report", description: "Pipeline value, commission, win/loss rates" },
      { id: "performance", name: "Performance Report", description: "Team member performance and top performers" },
      { id: "activity", name: "Activity Report", description: "User activity and action history" },
    ],
  });
};
