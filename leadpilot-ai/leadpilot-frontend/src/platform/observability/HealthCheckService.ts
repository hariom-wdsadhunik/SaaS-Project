import { supabase } from "@/lib/supabase/client";

export interface SystemHealthStatus {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  checks: {
    database: boolean;
    storage: boolean;
    realtime: boolean;
    eventBus: boolean;
    workflowEngine: boolean;
  };
  uptimeSeconds: number;
  timestamp: string;
}

export class HealthCheckService {
  private static startTime = Date.now();

  public static async checkHealth(): Promise<SystemHealthStatus> {
    let dbStatus = false;
    try {
      const { data } = await supabase.from("profiles").select("id").limit(1);
      dbStatus = data !== null;
    } catch {
      dbStatus = false;
    }

    const checks = {
      database: dbStatus,
      storage: true,
      realtime: true,
      eventBus: true,
      workflowEngine: true,
    };

    const isHealthy = Object.values(checks).every(Boolean);

    return {
      status: isHealthy ? "HEALTHY" : "DEGRADED",
      checks,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
    };
  }
}
