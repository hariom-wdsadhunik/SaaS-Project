const { supabase } = require("../db/supabase");

const REQUIRED_FIELDS = ["phone"];
const OPTIONAL_FIELDS = ["name", "email", "budget", "location", "message", "source", "status"];

const parseCSV = (content) => {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    data.push(row);
  }

  return data;
};

const validateLead = (lead) => {
  const errors = [];

  if (!lead.phone && !lead.phone_number) {
    errors.push("Phone number is required");
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.push("Invalid email format");
  }

  const validSources = ["whatsapp", "website", "referral", "cold_call", "other"];
  if (lead.source && !validSources.includes(lead.source.toLowerCase())) {
    errors.push(`Invalid source. Must be one of: ${validSources.join(", ")}`);
  }

  const validStatuses = ["new", "contacted", "follow-up", "closed"];
  if (lead.status && !validStatuses.includes(lead.status.toLowerCase())) {
    errors.push(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  return errors;
};

const normalizeLead = (row) => {
  return {
    phone: row.phone || row.phone_number || row.mobile || row.contact || "",
    name: row.name || row.customer_name || row.full_name || "",
    email: row.email || row.email_address || "",
    budget: row.budget || row.price_range || row.price || "",
    location: row.location || row.city || row.address || "",
    message: row.message || row.notes || row.description || "",
    source: (row.source || row.lead_source || "import").toLowerCase(),
    status: (row.status || row.lead_status || "new").toLowerCase(),
  };
};

exports.importLeads = async (req, res) => {
  try {
    const { fileData, fileName } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "File data is required" });
    }

    let leads;
    try {
      const decoded = Buffer.from(fileData, "base64").toString("utf-8");
      leads = parseCSV(decoded);
    } catch (parseError) {
      return res.status(400).json({ error: "Failed to parse CSV file: " + parseError.message });
    }

    const results = {
      total: leads.length,
      imported: 0,
      skipped: 0,
      errors: [],
      importedIds: [],
    };

    const teamId = req.user?.team_id;
    const userId = req.user?.id;

    for (let i = 0; i < leads.length; i++) {
      const row = leads[i];
      const lead = normalizeLead(row);
      const errors = validateLead(lead);

      if (errors.length > 0) {
        results.skipped++;
        results.errors.push({
          row: i + 2,
          data: row,
          errors,
        });
        continue;
      }

      try {
        const { data: existing } = await supabase
          .from("leads")
          .select("id")
          .eq("phone", lead.phone)
          .single();

        if (existing) {
          results.skipped++;
          results.errors.push({
            row: i + 2,
            data: lead,
            errors: [`Lead with phone ${lead.phone} already exists`],
          });
          continue;
        }

        const { data: newLead, error } = await supabase
          .from("leads")
          .insert([
            {
              phone: lead.phone,
              name: lead.name || null,
              email: lead.email || null,
              budget: lead.budget || null,
              location: lead.location || null,
              message: lead.message || null,
              source: lead.source,
              status: lead.status,
              team_id: teamId,
              created_by: userId,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        results.imported++;
        results.importedIds.push(newLead.id);

        await supabase.from("notes").insert([
          {
            lead_id: newLead.id,
            note_type: "System",
            content: `Lead imported from ${fileName || "CSV"}`,
            created_by: userId,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (importError) {
        results.skipped++;
        results.errors.push({
          row: i + 2,
          data: lead,
          errors: [importError.message],
        });
      }
    }

    await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        team_id: teamId,
        action: "import_leads",
        description: `Imported ${results.imported} leads from ${fileName || "CSV"}`,
        metadata: { total: results.total, imported: results.imported, skipped: results.skipped },
        created_at: new Date().toISOString(),
      },
    ]);

    res.json({
      message: `Import complete: ${results.imported} imported, ${results.skipped} skipped`,
      results,
    });
  } catch (error) {
    console.error("Import leads error:", error);
    res.status(500).json({ error: "Failed to import leads: " + error.message });
  }
};

exports.getImportTemplate = async (req, res) => {
  const template = {
    headers: REQUIRED_FIELDS.concat(OPTIONAL_FIELDS),
    sample: [
      {
        phone: "+91 98765 43210",
        name: "John Doe",
        email: "john@example.com",
        budget: "50-70 Lakhs",
        location: "Mumbai, Maharashtra",
        message: "Looking for 2BHK in Andheri",
        source: "website",
        status: "new",
      },
    ],
    instructions: [
      "Phone number is required for each lead",
      "Email should be valid format",
      "Source options: whatsapp, website, referral, cold_call, other",
      "Status options: new, contacted, follow-up, closed",
      "UTF-8 encoding recommended for non-English characters",
    ],
  };

  res.json(template);
};

exports.exportLeads = async (req, res) => {
  try {
    const { leadIds, format = "csv", filters } = req.body;
    const teamId = req.user?.team_id;
    const userId = req.user?.id;

    let query = supabase.from("leads").select("*").eq("team_id", teamId);

    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      query = query.in("id", leadIds);
    }

    if (filters) {
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.source) query = query.eq("source", filters.source);
      if (filters.ai_priority) query = query.eq("ai_priority", filters.ai_priority);
      if (filters.assigned_to) query = query.eq("assigned_to", filters.assigned_to);
    }

    const { data: leads, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    const csvRows = ["Phone,Name,Email,Budget,Location,Status,Source,AI Score,Priority,Created At"];

    leads.forEach((lead) => {
      csvRows.push(
        [
          `"${lead.phone || ""}"`,
          `"${lead.name || ""}"`,
          `"${lead.email || ""}"`,
          `"${lead.budget || ""}"`,
          `"${lead.location || ""}"`,
          `"${lead.status || ""}"`,
          `"${lead.source || ""}"`,
          lead.ai_score || "",
          `"${lead.ai_priority || ""}"`,
          `"${lead.created_at ? new Date(lead.created_at).toISOString() : ""}"`,
        ].join(",")
      );
    });

    const csv = csvRows.join("\n");
    const base64 = Buffer.from(csv).toString("base64");

    await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        team_id: teamId,
        action: "export_leads",
        description: `Exported ${leads.length} leads`,
        metadata: { count: leads.length, format },
        created_at: new Date().toISOString(),
      },
    ]);

    res.json({
      message: `Exported ${leads.length} leads`,
      format: "csv",
      data: base64,
      filename: `leads_export_${new Date().toISOString().split("T")[0]}.csv`,
    });
  } catch (error) {
    console.error("Export leads error:", error);
    res.status(500).json({ error: "Failed to export leads: " + error.message });
  }
};
