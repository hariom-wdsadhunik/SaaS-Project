const { supabase } = require("../db/supabase");

exports.getGoals = async (req, res) => {
  try {
    const { period } = req.query;
    const teamId = req.user?.team_id;
    const userId = req.user?.id;

    let query = supabase.from("goals").select("*").order("created_at", { ascending: false });

    if (period === "monthly") {
      query = query.eq("period", "monthly");
    } else if (period === "quarterly") {
      query = query.eq("period", "quarterly");
    } else if (period === "yearly") {
      query = query.eq("period", "yearly");
    }

    const { data, error } = await query;
    if (error) throw error;

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

    const { data, error } = await supabase
      .from("goals")
      .insert([
        {
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
        },
      ])
      .select()
      .single();

    if (error) throw error;

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

    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

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

    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) throw error;

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

    const { data: goal, error } = await supabase.from("goals").select("*").eq("id", id).single();
    if (error) throw error;

    const progress = await calculateGoalProgress(goal, teamId);

    res.json({ goal: { ...goal, progress } });
  } catch (error) {
    console.error("Get goal progress error:", error);
    res.status(500).json({ error: "Failed to get goal progress" });
  }
};

async function calculateGoalProgress(goal, teamId) {
  try {
    let query = supabase.from("leads").select("id, status");

    if (goal.start_date) {
      query = query.gte("created_at", goal.start_date);
    }
    if (goal.end_date) {
      query = query.lte("created_at", goal.end_date);
    }

    const { data: leads, error } = await query;
    if (error) throw error;

    let current = 0;
    let target = parseFloat(goal.target_value) || 1;

    switch (goal.metric) {
      case "leads":
        current = leads?.length || 0;
        break;
      case "converted_leads":
        current = leads?.filter((l) => l.status === "closed").length || 0;
        break;
      case "calls":
        const { data: callNotes } = await supabase
          .from("notes")
          .select("id")
          .eq("note_type", "Call")
          .gte("created_at", goal.start_date)
          .lte("created_at", goal.end_date);
        current = callNotes?.length || 0;
        break;
      case "meetings":
        const { data: meetings } = await supabase
          .from("appointments")
          .select("id")
          .eq("status", "Completed")
          .gte("scheduled_at", goal.start_date)
          .lte("scheduled_at", goal.end_date);
        current = meetings?.length || 0;
        break;
      case "deals_won":
        const { data: wonDeals } = await supabase
          .from("deals")
          .select("id, deal_value")
          .eq("deal_stage", "Closed Won")
          .eq("team_id", teamId)
          .gte("actual_close_date", goal.start_date)
          .lte("actual_close_date", goal.end_date);
        current = wonDeals?.length || 0;
        break;
      case "revenue":
        const { data: revenueDeals } = await supabase
          .from("deals")
          .select("id, commission_amount")
          .eq("deal_stage", "Closed Won")
          .eq("team_id", teamId)
          .gte("actual_close_date", goal.start_date)
          .lte("actual_close_date", goal.end_date);
        current = revenueDeals?.reduce((sum, d) => sum + (parseFloat(d.commission_amount) || 0), 0) || 0;
        break;
      default:
        current = parseFloat(goal.current_value) || 0;
    }

    const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
    const remaining = Math.max(target - current, 0);
    const daysRemaining = Math.ceil((new Date(goal.end_date) - new Date()) / (1000 * 60 * 60 * 24));

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
