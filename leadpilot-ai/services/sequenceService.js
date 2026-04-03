const { supabase } = require("../db/supabase");
const emailController = require("../controllers/emailController");
const smsController = require("../controllers/smsController");

class SequenceService {
  constructor() {
    this.processingInterval = null;
  }

  async getSequences(teamId) {
    try {
      const { data, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, sequences: data || [] };
    } catch (error) {
      console.error("Get sequences error:", error);
      return { success: false, error: error.message };
    }
  }

  async getSequence(id) {
    try {
      const { data, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { success: true, sequence: data };
    } catch (error) {
      console.error("Get sequence error:", error);
      return { success: false, error: "Sequence not found" };
    }
  }

  async createSequence({ name, description, trigger_type, trigger_config, steps, teamId, userId }) {
    try {
      if (!name || !trigger_type) {
        return { success: false, error: "Name and trigger type are required" };
      }

      const { data, error } = await supabase
        .from("sequences")
        .insert([
          {
            name,
            description,
            trigger_type,
            trigger_config: trigger_config || {},
            steps: steps || [],
            status: "inactive",
            team_id: teamId,
            created_by: userId,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, sequence: data };
    } catch (error) {
      console.error("Create sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async updateSequence(id, updates) {
    try {
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from("sequences")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, sequence: data };
    } catch (error) {
      console.error("Update sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteSequence(id) {
    try {
      const { error } = await supabase.from("sequences").delete().eq("id", id);
      if (error) throw error;

      await supabase.from("sequence_enrollments").delete().eq("sequence_id", id);
      return { success: true };
    } catch (error) {
      console.error("Delete sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async enrollLead(leadId, sequenceId) {
    try {
      const { data: existing } = await supabase
        .from("sequence_enrollments")
        .select("*")
        .eq("lead_id", leadId)
        .eq("sequence_id", sequenceId)
        .single();

      if (existing) {
        return { success: false, error: "Lead already enrolled in this sequence" };
      }

      const { data, error } = await supabase
        .from("sequence_enrollments")
        .insert([
          {
            lead_id: leadId,
            sequence_id: sequenceId,
            status: "active",
            current_step: 0,
            enrolled_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, enrollment: data };
    } catch (error) {
      console.error("Enroll lead error:", error);
      return { success: false, error: error.message };
    }
  }

  async enrollMultipleLeads(leadIds, sequenceId) {
    const results = { success: [], failed: [] };

    for (const leadId of leadIds) {
      const result = await this.enrollLead(leadId, sequenceId);
      if (result.success) {
        results.success.push(leadId);
      } else {
        results.failed.push({ leadId, error: result.error });
      }
    }

    return results;
  }

  async processSequenceStep(enrollment, sequence, lead) {
    try {
      const step = sequence.steps[enrollment.current_step];
      if (!step) {
        await this.completeEnrollment(enrollment.id);
        return { success: true, completed: true };
      }

      const now = new Date();
      const scheduledAt = new Date(enrollment.enrolled_at);
      let delayMinutes = step.delay_days ? step.delay_days * 24 * 60 : step.delay_hours ? step.delay_hours * 60 : 0;
      scheduledAt.setMinutes(scheduledAt.getMinutes() + delayMinutes);

      if (now < scheduledAt) {
        return { success: true, waiting: true, nextStepAt: scheduledAt };
      }

      switch (step.action) {
        case "email":
          await this.sendSequenceEmail(lead, step);
          break;
        case "sms":
          await this.sendSequenceSMS(lead, step);
          break;
        case "note":
          await this.addSequenceNote(lead, step, enrollment);
          break;
        case "update_status":
          await this.updateLeadStatus(lead.id, step.status);
          break;
        case "assign":
          await this.assignLead(lead.id, step.user_id);
          break;
      }

      await this.advanceEnrollment(enrollment.id);

      return { success: true, stepExecuted: step.action };
    } catch (error) {
      console.error("Process sequence step error:", error);
      await this.markEnrollmentFailed(enrollment.id, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendSequenceEmail(lead, step) {
    try {
      const { subject, body, template_id } = step;
      await emailController.sendToLead({
        leadId: lead.id,
        subject: this.replaceVariables(subject, lead),
        body: this.replaceVariables(body, lead),
        templateId: template_id,
        variables: { leadId: lead.id },
      });
    } catch (error) {
      console.error("Sequence email error:", error);
    }
  }

  async sendSequenceSMS(lead, step) {
    try {
      const { message, template_id } = step;
      await smsController.sendToLead({
        leadId: lead.id,
        body: this.replaceVariables(message, lead),
        templateId: template_id,
        variables: { leadId: lead.id },
      });
    } catch (error) {
      console.error("Sequence SMS error:", error);
    }
  }

  async addSequenceNote(lead, step, enrollment) {
    try {
      const noteContent = this.replaceVariables(step.note_content || "Sequence step completed", lead);
      await supabase.from("notes").insert([
        {
          lead_id: lead.id,
          note_type: "System",
          content: `[Sequence: ${enrollment.sequence_name}] ${noteContent}`,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Sequence note error:", error);
    }
  }

  async updateLeadStatus(leadId, status) {
    try {
      await supabase.from("leads").update({ status }).eq("id", leadId);
    } catch (error) {
      console.error("Update lead status error:", error);
    }
  }

  async assignLead(leadId, userId) {
    try {
      await supabase
        .from("leads")
        .update({ assigned_to: userId, assigned_at: new Date().toISOString() })
        .eq("id", leadId);
    } catch (error) {
      console.error("Assign lead error:", error);
    }
  }

  async advanceEnrollment(enrollmentId) {
    try {
      await supabase
        .from("sequence_enrollments")
        .update({ current_step: supabase.rpc("increment_step"), last_action_at: new Date().toISOString() })
        .eq("id", enrollmentId);
    } catch (error) {
      await supabase
        .from("sequence_enrollments")
        .update({ current_step: 999, last_action_at: new Date().toISOString() })
        .eq("id", enrollmentId);
    }
  }

  async completeEnrollment(enrollmentId) {
    try {
      await supabase
        .from("sequence_enrollments")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", enrollmentId);

      await this.updateSequenceStats(enrollmentId);
    } catch (error) {
      console.error("Complete enrollment error:", error);
    }
  }

  async markEnrollmentFailed(enrollmentId, error) {
    try {
      await supabase
        .from("sequence_enrollments")
        .update({ status: "failed", error_message: error })
        .eq("id", enrollmentId);
    } catch (err) {
      console.error("Mark enrollment failed error:", err);
    }
  }

  async updateSequenceStats(sequenceId) {
    try {
      const { data: enrollments } = await supabase
        .from("sequence_enrollments")
        .select("status")
        .eq("sequence_id", sequenceId);

      if (enrollments) {
        const stats = {
          entered: enrollments.length,
          completed: enrollments.filter((e) => e.status === "completed").length,
          stopped: enrollments.filter((e) => e.status === "stopped" || e.status === "failed").length,
        };

        await supabase.from("sequences").update({ stats }).eq("id", sequenceId);
      }
    } catch (error) {
      console.error("Update sequence stats error:", error);
    }
  }

  replaceVariables(text, lead) {
    if (!text) return "";
    const vars = {
      "{{lead_name}}": lead.name || "Customer",
      "{{lead_phone}}": lead.phone || "",
      "{{lead_email}}": lead.email || "",
      "{{lead_budget}}": lead.budget || "",
      "{{lead_location}}": lead.location || "",
    };
    let result = text;
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, "g"), value);
    });
    return result;
  }

  async processAllEnrollments() {
    try {
      const { data: activeEnrollments } = await supabase
        .from("sequence_enrollments")
        .select("*, sequences(*)")
        .eq("status", "active");

      if (!activeEnrollments || activeEnrollments.length === 0) return;

      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .in(
          "id",
          activeEnrollments.map((e) => e.lead_id)
        );

      const leadsMap = {};
      leads?.forEach((l) => (leadsMap[l.id] = l));

      for (const enrollment of activeEnrollments) {
        const lead = leadsMap[enrollment.lead_id];
        if (!lead) {
          await this.markEnrollmentFailed(enrollment.id, "Lead not found");
          continue;
        }

        await this.processSequenceStep(enrollment, enrollment.sequences, lead);
      }
    } catch (error) {
      console.error("Process all enrollments error:", error);
    }
  }

  startProcessor(intervalMinutes = 5) {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    this.processingInterval = setInterval(() => {
      this.processAllEnrollments();
    }, intervalMinutes * 60 * 1000);

    console.log(`Sequence processor started (every ${intervalMinutes} minutes)`);
  }

  stopProcessor() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log("Sequence processor stopped");
    }
  }
}

const sequenceService = new SequenceService();

const getSequences = async (req, res) => {
  const result = await sequenceService.getSequences(req.user?.team_id);
  res.json(result);
};

const getSequence = async (req, res) => {
  const { id } = req.params;
  const result = await sequenceService.getSequence(id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
};

const createSequence = async (req, res) => {
  const result = await sequenceService.createSequence({
    ...req.body,
    teamId: req.user?.team_id,
    userId: req.user?.id,
  });
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
};

const updateSequence = async (req, res) => {
  const { id } = req.params;
  const result = await sequenceService.updateSequence(id, req.body);
  res.json(result);
};

const deleteSequence = async (req, res) => {
  const { id } = req.params;
  const result = await sequenceService.deleteSequence(id);
  res.json(result);
};

const enrollLeads = async (req, res) => {
  const { sequenceId, leadIds } = req.body;

  if (!sequenceId || !leadIds || !Array.isArray(leadIds)) {
    return res.status(400).json({ error: "sequenceId and leadIds array are required" });
  }

  const result = await sequenceService.enrollMultipleLeads(leadIds, sequenceId);
  res.json(result);
};

const enrollSingleLead = async (req, res) => {
  const { sequenceId, leadId } = req.body;

  if (!sequenceId || !leadId) {
    return res.status(400).json({ error: "sequenceId and leadId are required" });
  }

  const result = await sequenceService.enrollLead(leadId, sequenceId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
};

const getEnrollments = async (req, res) => {
  try {
    const { sequenceId } = req.query;
    let query = supabase
      .from("sequence_enrollments")
      .select("*, leads(name, phone), sequences(name)")
      .order("enrolled_at", { ascending: false });

    if (sequenceId) {
      query = query.eq("sequence_id", sequenceId);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ enrollments: data || [] });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

module.exports = {
  sequenceService,
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence,
  enrollLeads,
  enrollSingleLead,
  getEnrollments,
};
