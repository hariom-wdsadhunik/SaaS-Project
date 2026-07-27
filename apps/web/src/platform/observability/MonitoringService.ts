export interface SystemAlert {
  id: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  component: string;
  message: string;
  timestamp: string;
}

export class MonitoringService {
  private static alerts: SystemAlert[] = [];

  public static recordAlert(severity: "INFO" | "WARNING" | "CRITICAL", component: string, message: string): SystemAlert {
    const alert: SystemAlert = {
      id: `alt-${Date.now()}`,
      severity,
      component,
      message,
      timestamp: new Date().toISOString(),
    };
    this.alerts.push(alert);
    return alert;
  }

  public static getActiveAlerts(): SystemAlert[] {
    return [...this.alerts];
  }
}
