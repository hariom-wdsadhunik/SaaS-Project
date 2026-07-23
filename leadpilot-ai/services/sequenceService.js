const repository = require("../db");
const emailController = require("../controllers/emailController");
const smsController = require("../controllers/smsController");

class SequenceService {
  async getSequences(teamId) {
    try {
      const data = await repository.getSequences(teamId);
      return { success: true, sequences: data || [] };
    } catch (error) {
      console.error("Get sequences error:", error);
      return { success: false, error: error.message };
    }
  }

  async getSequence(id) {
    try {
      const data = await repository.getSequenceById(id);
      if (!data) return { success: false, error: "Sequence not found" };
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

      const data = await repository.createSequence({
        name,
        description,
        trigger_type,
        trigger_config: trigger_config || {},
        steps: steps || [],
        status: "inactive",
        team_id: teamId,
        created_by: userId,
        created_at: new Date().toISOString(),
      });

      return { success: true, sequence: data };
    } catch (error) {
      console.error("Create sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async updateSequence(id, updates) {
    try {
      updates.updated_at = new Date().toISOString();
      const data = await repository.updateSequence(id, updates);
      if (!data) return { success: false, error: "Sequence not found" };
      return { success: true, sequence: data };
    } catch (error) {
      console.error("Update sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteSequence(id) {
    try {
      const success = await repository.deleteSequence(id);
      const enrollments = await repository.getSequenceEnrollments({ sequence_id: id });
      for (const enr of (enrollments || [])) {
        await repository.deleteSequenceEnrollment(enr.id);
      }
      return { success: true };
    } catch (error) {
      console.error("Delete sequence error:", error);
      return { success: false, error: error.message };
    }
  }

  async enrollLead(leadId, sequenceId) {
    try {
      const existing = await repository.getSequenceEnrollments({ lead_id: leadId, sequence_id: sequenceId });
      if (existing && existing.length > 0) {
        return { success: false, error: "Lead already enrolled in this sequence" };
      }

      const data = await repository.createSequenceEnrollment({
        lead_id: leadId,
        sequence_id: sequenceId,
        status: "active",
        current_step: 0,
        enrolled_at: new Date().toISOString(),
      });

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
      const stepIndex = enrollment.current_step;
      const step = sequence?.steps?.[stepIndex];
      if (!step) {
        await this.completeEnrollment(enrollment.id);
        return { success: true, completed: true };
      }

      // Step 2: Idempotency check before execution
      const isProcessed = await repository.isStepAlreadyProcessed(enrollment.id, stepIndex);
      if (isProcessed) {
        console.log(`Step ${stepIndex} already processed for enrollment ${enrollment.id}. Advancing step...`);
        await this.advanceEnrollment(enrollment);
        return { success: true, skipped: true, reason: "Step already processed" };
      }

      const now = new Date();
      const scheduledAt = new Date(enrollment.enrolled_at);
      let delayMinutes = step.delay_days ? step.delay_days * 24 * 60 : step.delay_hours ? step.delay_hours * 60 : 0;
      scheduledAt.setMinutes(scheduledAt.getMinutes() + delayMinutes);

      if (now < scheduledAt) {
        await repository.releaseEnrollmentLock(enrollment.id, { status: "active" });
        return { success: true, waiting: true, nextStepAt: scheduledAt };
      }

      // Step 4: Deterministic idempotency key
      const idempotencyKey = `seq_${sequence.id}_lead_${lead.id}_step_${stepIndex}`;

      // Step 5: Execute step action
      switch (step.action) {
        case "email":
          await this.sendSequenceEmail(lead, step, idempotencyKey);
          break;
        case "sms":
          await this.sendSequenceSMS(lead, step, idempotencyKey);
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

      // Step 6: Record processed step idempotency record immediately after side effect
      await repository.recordProcessedStep({
        enrollment_id: enrollment.id,
        sequence_id: sequence.id,
        lead_id: lead.id,
        step_index: stepIndex,
        action: step.action,
        status: "completed",
        idempotency_key: idempotencyKey,
        processed_at: new Date().toISOString(),
        metadata: { stepAction: step.action }
      });

      // Step 7: Advance enrollment & release lock
      await this.advanceEnrollment(enrollment);

      return { success: true, stepExecuted: step.action, idempotencyKey };
    } catch (error) {
      console.error("Process sequence step error:", error);
      await repository.releaseEnrollmentLock(enrollment.id, {
        status: "failed",
        error_message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  async sendSequenceEmail(lead, step, idempotencyKey) {
    try {
      const { subject, body, template_id } = step;
      await emailController.sendToLead({
        leadId: lead.id,
        subject: this.replaceVariables(subject, lead),
        body: this.replaceVariables(body, lead),
        templateId: template_id,
        variables: { leadId: lead.id, idempotencyKey },
      });
    } catch (error) {
      console.error("Sequence email error:", error);
    }
  }

  async sendSequenceSMS(lead, step, idempotencyKey) {
    try {
      const { message, template_id } = step;
      await smsController.sendToLead({
        leadId: lead.id,
        body: this.replaceVariables(message, lead),
        templateId: template_id,
        variables: { leadId: lead.id, idempotencyKey },
      });
    } catch (error) {
      console.error("Sequence SMS error:", error);
    }
  }

  async addSequenceNote(lead, step, enrollment) {
    try {
      const noteContent = this.replaceVariables(step.note_content || "Sequence step completed", lead);
      await repository.createNote({
        lead_id: lead.id,
        note_type: "System",
        content: `[Sequence: ${enrollment.sequence_name || 'Workflow'}] ${noteContent}`,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Sequence note error:", error);
    }
  }

  async updateLeadStatus(leadId, status) {
    try {
      await repository.updateLead(leadId, { status });
    } catch (error) {
      console.error("Update lead status error:", error);
    }
  }

  async assignLead(leadId, userId) {
    try {
      await repository.updateLead(leadId, { assigned_to: userId, assigned_at: new Date().toISOString() });
    } catch (error) {
      console.error("Assign lead error:", error);
    }
  }

  async advanceEnrollment(enrollment) {
    try {
      const nextStep = (enrollment.current_step || 0) + 1;
      await repository.releaseEnrollmentLock(enrollment.id, {
        current_step: nextStep,
        status: "active"
      });
    } catch (error) {
      await repository.releaseEnrollmentLock(enrollment.id, {
        current_step: 999,
        status: "failed",
        error_message: error.message
      });
    }
  }

  async completeEnrollment(enrollmentId) {
    try {
      await repository.releaseEnrollmentLock(enrollmentId, {
        status: "completed",
        completed_at: new Date().toISOString()
      });

      const enr = await repository.getSequenceEnrollmentById(enrollmentId);
      if (enr) {
        await this.updateSequenceStats(enr.sequence_id);
      }
    } catch (error) {
      console.error("Complete enrollment error:", error);
    }
  }

  async markEnrollmentFailed(enrollmentId, error) {
    try {
      await repository.releaseEnrollmentLock(enrollmentId, {
        status: "failed",
        error_message: error
      });
    } catch (err) {
      console.error("Mark enrollment failed error:", err);
    }
  }

  async updateSequenceStats(sequenceId) {
    try {
      const enrollments = await repository.getSequenceEnrollments({ sequence_id: sequenceId });

      if (enrollments) {
        const stats = {
          entered: enrollments.length,
          completed: enrollments.filter((e) => e.status === "completed").length,
          stopped: enrollments.filter((e) => e.status === "stopped" || e.status === "failed").length,
        };

        await repository.updateSequence(sequenceId, { stats });
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
      const activeEnrollments = await repository.getSequenceEnrollments({ status: "active" });

      if (!activeEnrollments || activeEnrollments.length === 0) return;

      for (const rawEnrollment of activeEnrollments) {
        // Step 1: Acquire lock atomically
        const lockedEnrollment = await repository.acquireEnrollmentLock(rawEnrollment.id);
        if (!lockedEnrollment) {
          // Locked by another worker -> skip
          continue;
        }

        try {
          const lead = await repository.getLeadById(lockedEnrollment.lead_id);
          const sequence = await repository.getSequenceById(lockedEnrollment.sequence_id);

          if (!lead || !sequence) {
            await repository.releaseEnrollmentLock(lockedEnrollment.id, {
              status: "failed",
              error_message: "Lead or Sequence not found"
            });
            continue;
          }

          await this.processSequenceStep(lockedEnrollment, sequence, lead);
        } catch (err) {
          console.error("Enrollment processing error:", err);
          await repository.releaseEnrollmentLock(lockedEnrollment.id, {
            status: "failed",
            error_message: err.message
          });
        }
      }
    } catch (error) {
      console.error("Process all enrollments error:", error);
    }
  }

  async processPendingJobs() {
    try {
      const startTime = new Date();
      await this.processAllEnrollments();
      const endTime = new Date();
      return {
        success: true,
        message: 'Pending sequence jobs processed successfully',
        timestamp: endTime.toISOString(),
        durationMs: endTime - startTime
      };
    } catch (error) {
      console.error('Process pending jobs error:', error);
      return { success: false, error: error.message };
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
    const enrollments = await repository.getSequenceEnrollments({ sequence_id: sequenceId });

    res.json({ enrollments: enrollments || [] });
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
