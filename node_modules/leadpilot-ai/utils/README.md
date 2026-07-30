# Utils

Utility functions for LeadPilot AI.

## Files

- **parser.js** - Message parsing utilities
  - `parseMessage(text)` - Extracts budget and location from lead messages
  - Returns: `{ budget: string|null, location: string|null }`

## Example

```javascript
const { parseMessage } = require("./utils/parser");

const parsed = parseMessage("Looking for 2BHK in Mumbai under 80L");
// Result: { budget: "80L", location: "Mumbai" }
```
