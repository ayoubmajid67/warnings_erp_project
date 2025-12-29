# Member Dashboard - View Warning Details

## Feature Overview
Members can now view the full details of their warnings directly from their dashboard.

## Changes Made

### 1. Dashboard Page (`/dashboard/warnings`)
- **File:** `src/app/dashboard/warnings/page.js`
- **Change:** Added a "View Details" button to each warning card in the timeline.
- **Icon:** Added `Eye` icon for better UX.

### 2. Styles (`warnings.css`)
- **File:** `src/app/dashboard/warnings/warnings.css`
- **Change:** Added `.timeline-footer` class to align the issuer info and the new button.

### 3. User Flow
1. Member logs in.
2. Navigates to "My Warnings" (`/dashboard/warnings`).
3. Sees list of warnings.
4. Clicks "View Details" on a specific warning.
5. Redirects to `/warnings/[warningId]` to see full details (reason, proof document, etc.).

## Visual Update
The warning timeline item now looks like this:

```
[Warning #1]     [Date]
-----------------------
Reason for warning...
-----------------------
Issued by: Admin     [👁️ View Details]
```
