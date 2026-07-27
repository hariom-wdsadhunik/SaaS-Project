# Background Job Queue & Scheduler Specification

**Module:** Background Jobs  
**Location:** `src/platform/jobs/`  

---

## Supported Job Types

- `REMINDER_DELIVERY`
- `WORKFLOW_EXECUTION`
- `AI_TASK`
- `RECURRING_APPOINTMENT`
- `AUDIT_CLEANUP`

## Retry & Exponential Backoff

Jobs automatically retry upon error using `RetryPolicy` configured with exponential backoff:
$$\text{Delay}(n) = \text{initialDelay} \times \text{factor}^{n-1}$$
By default, 3 attempts are allowed with an initial delay of 100ms.
