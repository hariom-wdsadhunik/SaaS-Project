# LeadPilot AI CRM — Customer Health Score Engine

**Module:** Health Score Engine  
**Version:** v2.3.0  

---

## 1. Weighted Telemetry Scoring (0 - 100 Index)

$$\text{Health Score} = \text{Login (25)} + \text{Adoption (25)} + \text{AI (20)} + \text{Workflow (20)} + \text{Onboarding (10)} - \text{Tickets (5/ea)}$$

- **HEALTHY:** Score $\ge 75$
- **NEUTRAL:** $50 \le \text{Score} < 75$
- **AT_RISK:** Score $< 50$
