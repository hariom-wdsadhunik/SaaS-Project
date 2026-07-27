const repository = require("../db");

exports.getGoals = async (req, res) => {
  try {
    const { period } = req.query;
    const teamId = req.user?.team_id;

    const data = await repository.getGoals({ period });

    const goalsWithProgress = await Promise.all(
      (data || []).map(async (goal) => {
        const progress = await calculateGoalProgress(goal, teamId);
        return { ...goal, progress };
      })
    );

    res.json({ goals: goalsWithProgress });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { name, metric, target_value, current_value = 0, period, start_date, end_date } = req.body;
    const teamId = req.user?.team_id;
    const userId = req.user?.id;

    if (!name || !metric || !target_value || !period) {
      return res.status(400).json({ error: "name, metric, target_value, and period are required" });
    }

    const validMetrics = ["leads", "converted_leads", "revenue", "calls", "meetings", "deals_won"];
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ error: `metric must be one of: ${validMetrics.join(", ")}` });
    }

    const validPeriods = ["monthly", "quarterly", "yearly"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: `period must be one of: ${validPeriods.join(", ")}` });
    }

    const data = await repository.createGoal({
      name,
      metric,
      target_value,
      current_value,
      period,
      start_date: start_date || getPeriodStart(period),
      end_date: end_date || getPeriodEnd(period),
      team_id: teamId,
      created_by: userId,
      created_at: new Date().toISOString(),
    });

    const progress = await calculateGoalProgress(data, teamId);

    res.status(201).json({ message: "Goal created", goal: { ...data, progress } });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_value, current_value, period, start_date, end_date } = req.body;
    const teamId = req.user?.team_id;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (target_value !== undefined) updates.target_value = target_value;
    if (current_value !== undefined) updates.current_value = current_value;
    if (period !== undefined) updates.period = period;
    if (start_date !== undefined) updates.start_date = start_date;
    if (end_date !== undefined) updates.end_date = end_date;
    updates.updated_at = new Date().toISOString();

    const data = await repository.updateGoal(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const progress = await calculateGoalProgress(data, teamId);

    res.json({ message: "Goal updated", goal: { ...data, progress } });
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteGoal(id);

    if (!success) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};

exports.getGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const teamId = req.user?.team_id;

    const goal = await repository.getGoalById(id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const progress = await calculateGoalProgress(goal, teamId);

    res.json({ goal: { ...goal, progress } });
  } catch (error) {
    console.error("Get goal progress error:", error);
    res.status(500).json({ error: "Failed to get goal progress" });
  }
};

async function calculateGoalProgress(goal, teamId) {
  try {
    const { data: leads } = await repository.getLeads({ limit: 500 });
    let current = 0;
    let target = parseFloat(goal.target_value) || 1;

    switch (goal.metric) {
      case "leads":
        current = (leads || []).length;
        break;
      case "converted_leads":
        current = (leads || []).filter((l) => l.status === "closed").length;
        break;
      case "calls":
        const callNotes = await repository.getNotes({ note_type: "Call" });
        current = (callNotes || []).length;
        break;
      case "meetings":
        const meetings = await repository.getAppointments({ status: "Completed" });
        current = (meetings || []).length;
        break;
      case "deals_won":
        const wonDeals = await repository.getDeals({ status: "Closed Won" });
        current = (wonDeals || []).length;
        break;
      case "revenue":
        const revenueDeals = await repository.getDeals({ status: "Closed Won" });
        current = (revenueDeals || []).reduce((sum, d) => sum + (parseFloat(d.commission_amount) || 0), 0);
        break;
      default:
        current = parseFloat(goal.current_value) || 0;
    }

    const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
    const remaining = Math.max(target - current, 0);
    const daysRemaining = Math.ceil((new Date(goal.end_date || Date.now()) - new Date()) / (1000 * 60 * 60 * 24));

    return {
      current,
      target,
      percentage,
      remaining,
      daysRemaining,
      isCompleted: current >= target,
      isOnTrack: percentage >= (daysRemaining / getPeriodDays(goal.period)) * 100,
    };
  } catch (error) {
    console.error("Calculate goal progress error:", error);
    return { current: 0, target: 0, percentage: 0, remaining: 0 };
  }
}

function getPeriodStart(period) {
  const now = new Date();
  switch (period) {
    case "monthly":
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    case "quarterly":
      const quarter = Math.floor(now.getMonth() / 3);
      return new Date(now.getFullYear(), quarter * 3, 1).toISOString();
    case "yearly":
      return new Date(now.getFullYear(), 0, 1).toISOString();
    default:
      return now.toISOString();
  }
}

function getPeriodEnd(period) {
  const now = new Date();
  switch (period) {
    case "monthly":
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    case "quarterly":
      const quarter = Math.floor(now.getMonth() / 3);
      return new Date(now.getFullYear(), (quarter + 1) * 3, 0).toISOString();
    case "yearly":
      return new Date(now.getFullYear(), 11, 31).toISOString();
    default:
      return now.toISOString();
  }
}

function getPeriodDays(period) {
  switch (period) {
    case "monthly":
      return 30;
    case "quarterly":
      return 90;
    case "yearly":
      return 365;
    default:
      return 30;
  }
}
