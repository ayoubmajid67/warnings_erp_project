# Fix: Missing ExternalLink Import

## Issue
The user encountered a reference error because `<ExternalLink />` was used in `src/app/warnings/[warningId]/page.js` but it was not imported from `lucide-react`.

## Resolution
Added `ExternalLink` to the named imports from `lucide-react`.

```javascript
import { 
  // ... other icons
  Shield,
  ExternalLink // Added this
} from 'lucide-react';
```

## Verification
The `View Document` button which uses `<ExternalLink size={16} />` should now render correctly without crashing the page.
