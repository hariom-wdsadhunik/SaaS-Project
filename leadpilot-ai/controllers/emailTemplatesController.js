const { supabase } = require("../db/supabase");

const ALLOWED_VARIABLES = [
  "lead_name",
  "lead_phone",
  "lead_email",
  "lead_budget",
  "lead_location",
  "lead_status",
  "lead_score",
  "property_name",
  "property_price",
  "appointment_date",
  "agent_name",
  "company_name",
];

exports.getTemplates = async (req, res) => {
  try {
    const { type, is_active } = req.query;
    const teamId = req.user?.team_id;

    let query = supabase.from("email_templates").select("*");

    if (type) {
      query = query.eq("type", type);
    }

    if (is_active !== undefined) {
      query = query.eq("is_active", is_active === "true");
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ templates: data || [] });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json({ template: data });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(404).json({ error: "Template not found" });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, subject, body, type = "custom", variables = [], is_active = true } = req.body;
    const userId = req.user?.id;
    const teamId = req.user?.team_id;

    if (!name || !subject || !body) {
      return res.status(400).json({ error: "name, subject, and body are required" });
    }

    const { data, error } = await supabase
      .from("email_templates")
      .insert([
        {
          name,
          subject,
          body,
          type,
          variables: variables.length > 0 ? variables : ALLOWED_VARIABLES.slice(0, 5),
          is_active,
          user_id: userId,
          team_id: teamId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Template created", template: data });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({ error: "Failed to create template" });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, body, type, variables, is_active } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (subject !== undefined) updates.subject = subject;
    if (body !== undefined) updates.body = body;
    if (type !== undefined) updates.type = type;
    if (variables !== undefined) updates.variables = variables;
    if (is_active !== undefined) updates.is_active = is_active;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("email_templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Template updated", template: data });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ error: "Failed to update template" });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("email_templates").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "Template deleted" });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ error: "Failed to delete template" });
  }
};

exports.previewTemplate = async (req, res) => {
  try {
    const { subject, body, variables } = req.body;

    if (!body) {
      return res.status(400).json({ error: "body is required" });
    }

    let previewSubject = subject || "Preview Subject";
    let previewBody = body;

    Object.entries(variables || {}).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });

    res.json({
      preview: {
        subject: previewSubject,
        body: previewBody,
      },
      availableVariables: ALLOWED_VARIABLES,
    });
  } catch (error) {
    console.error("Preview template error:", error);
    res.status(500).json({ error: "Failed to preview template" });
  }
};

exports.getVariables = async (req, res) => {
  res.json({
    variables: ALLOWED_VARIABLES.map((v) => ({
      name: v,
      description: `The ${v.replace(/_/g, " ")} of the lead or property`,
      syntax: `{{${v}}}`,
    })),
  });
};

exports.duplicateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const teamId = req.user?.team_id;

    const { data: original, error: fetchError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("email_templates")
      .insert([
        {
          name: `${original.name} (Copy)`,
          subject: original.subject,
          body: original.body,
          type: original.type,
          variables: original.variables,
          is_active: false,
          user_id: userId,
          team_id: teamId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Template duplicated", template: data });
  } catch (error) {
    console.error("Duplicate template error:", error);
    res.status(500).json({ error: "Failed to duplicate template" });
  }
};
