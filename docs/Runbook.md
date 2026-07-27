# Operations Runbook

## Emergency Incidents

### Database Connection Outage
1. Check Supabase Status dashboard.
2. Verify connection pooling pool size.
3. Failover to secondary read replica if necessary.

### Background Job Failures
1. Inspect `WorkflowExecutionLog` via `WorkflowRepository`.
2. Retry failed jobs via `JobScheduler.retry()`.
