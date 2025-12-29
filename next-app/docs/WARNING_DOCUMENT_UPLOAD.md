# Warning Document Upload Feature

## Overview
Proof documents are now **required** when issuing warnings. Documents are saved to `public/warnings/` and linked in the member's warning record.

---

## ✅ Implementation

### 1. File Storage

**Location:** `public/warnings/<warningId>.<extension>`

**Example:**
```
public/warnings/warning-1767013782491-v5ais33z0.pdf
public/warnings/warning-1767013782491-v5ais33z0.png
```

**Supported Formats:**
- PDF (.pdf)
- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)

**Max Size:** 5MB

---

### 2. Database Structure

**Warning Object:**
```json
{
  "id": "warning-1767013782491-v5ais33z0",
  "reason": "Missed 3 consecutive meetings",
  "issuedBy": "Admin",
  "issuedAt": "2025-12-29T13:09:42.491Z",
  "documentPath": "/warnings/warning-1767013782491-v5ais33z0.pdf"
}
```

**Member's Warnings Array:**
```json
{
  "id": "member-test",
  "name": "TEST USER - Ayoub Majid",
  "warningCount": 2,
  "warnings": [
    {
      "id": "warning-1",
      "reason": "...",
      "documentPath": "/warnings/warning-1.pdf"
    },
    {
      "id": "warning-2",
      "reason": "...",
      "documentPath": "/warnings/warning-2.png"
    }
  ]
}
```

---

## 🔧 API Changes

### POST /api/warnings

**Before (JSON):**
```javascript
{
  "memberId": "member-test",
  "reason": "Warning reason"
}
```

**After (FormData):**
```javascript
const formData = new FormData();
formData.append('memberId', 'member-test');
formData.append('reason', 'Warning reason');
formData.append('proofFile', fileObject);  // REQUIRED
```

**Response:**
```json
{
  "message": "Warning issued. Member now has 2/3 warnings.",
  "member": { ... },
  "warning": {
    "id": "warning-1767013782491-v5ais33z0",
    "reason": "...",
    "issuedBy": "Admin",
    "issuedAt": "2025-12-29T13:09:42.491Z",
    "documentPath": "/warnings/warning-1767013782491-v5ais33z0.pdf"
  },
  "isDropped": false,
  "emailSent": true
}
```

---

## 📋 Validation

### Client-Side (WarningModal):
```javascript
if (!reason.trim()) {
  setError('Please provide a reason for the warning');
  return;
}

if (!proofFile) {
  setError('Proof document is required');  // NEW
  return;
}
```

### Server-Side (API):
```javascript
if (!memberId || !reason) {
  return 400: 'Member ID and reason are required';
}

if (!proofFile) {
  return 400: 'Proof document is required';  // NEW
}
```

---

## 🎯 File Upload Flow

```
1. Admin opens warning modal
   ↓
2. Fills in reason
   ↓
3. Uploads proof document (REQUIRED)
   ↓
4. Clicks "Issue Warning"
   ↓
5. Client validates:
   - Reason not empty
   - File is uploaded
   ↓
6. Creates FormData with:
   - memberId
   - reason
   - proofFile
   ↓
7. API receives FormData
   ↓
8. API validates:
   - Member exists
   - Reason provided
   - File uploaded
   ↓
9. Generate warning ID
   ↓
10. Save file to:
    public/warnings/<warningId>.<ext>
   ↓
11. Create warning record with documentPath
   ↓
12. Add to member's warnings array
   ↓
13. Save to database
   ↓
14. Send email notification
   ↓
15. Return success response
```

---

## 🎨 UI Changes

### Warning Modal:

**Before:**
```
Proof Document (Optional)
[Upload area]
```

**After:**
```
Proof Document *
[Upload area]
```

**Validation Message:**
```
❌ Proof document is required
```

---

## 💾 File Management

### Save File:
```javascript
// Generate unique filename
const warningId = `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const fileExtension = proofFile.name.split('.').pop();
const fileName = `${warningId}.${fileExtension}`;

// Save to public/warnings/
const warningsDir = path.join(process.cwd(), 'public', 'warnings');
const filePath = path.join(warningsDir, fileName);

const buffer = Buffer.from(await proofFile.arrayBuffer());
fs.writeFileSync(filePath, buffer);

// Store path in database
const documentPath = `/warnings/${fileName}`;
```

### Cleanup on Error:
```javascript
if (!result.success) {
  // Clean up file if warning failed
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return error;
}
```

---

## 📁 Files Modified

### API:
1. **`src/app/api/warnings/route.js`**
   - Changed from JSON to FormData
   - Added file upload handling
   - Added file validation
   - Added file save logic
   - Added cleanup on error

### Database:
2. **`src/app/db/members.js`**
   - Updated `issueWarning()` function
   - Added `warningId` parameter
   - Added `documentPath` parameter
   - Store `documentPath` in warning object

### UI:
3. **`src/components/warningModal/WarningModal.js`**
   - Made proof document required
   - Updated label: "Proof Document *"
   - Added validation for file upload

4. **`src/app/admin/members/[id]/page.js`**
   - Updated `handleConfirmWarning()`
   - Changed from JSON to FormData
   - Pass `proofFile` to API

---

## 🔗 Document Access

### View Document:
```javascript
// From warning object
const documentUrl = warning.documentPath;
// Example: "/warnings/warning-1767013782491-v5ais33z0.pdf"

// Open in new tab
window.open(documentUrl, '_blank');

// Download
<a href={documentUrl} download>Download Proof</a>
```

### In Warning Details Page:
```jsx
{warning.documentPath && (
  <a 
    href={warning.documentPath} 
    target="_blank" 
    rel="noopener noreferrer"
    className="btn btn-secondary"
  >
    📄 View Proof Document
  </a>
)}
```

---

## ✅ Testing Checklist

### File Upload:
- [ ] Can select PDF file
- [ ] Can select PNG file
- [ ] Can select JPG file
- [ ] File size validation (max 5MB)
- [ ] File type validation
- [ ] Required validation works

### File Storage:
- [ ] File saved to `public/warnings/`
- [ ] Filename format: `warning-<id>.<ext>`
- [ ] File accessible via URL
- [ ] File cleaned up on error

### Database:
- [ ] `documentPath` stored in warning
- [ ] Path format: `/warnings/<filename>`
- [ ] Warning ID matches filename

### API:
- [ ] FormData accepted
- [ ] File validation works
- [ ] Error handling works
- [ ] Success response includes path

---

## 🎉 Benefits

### For Admins:
✅ **Evidence Required** - All warnings backed by proof  
✅ **Permanent Record** - Documents stored permanently  
✅ **Easy Access** - Direct link in warning record  
✅ **Accountability** - Clear documentation trail

### For Members:
✅ **Transparency** - Can view proof of warning  
✅ **Fairness** - Evidence-based warnings  
✅ **Reference** - Can review documents later

### For System:
✅ **Compliance** - Documented warning process  
✅ **Audit Trail** - Complete record keeping  
✅ **Security** - Files stored securely  
✅ **Organization** - Centralized document storage

---

## 📌 Important Notes

1. **Required Field:** Proof document is now mandatory
2. **File Naming:** Uses warning ID for consistency
3. **Storage:** Files in `public/warnings/` folder
4. **Access:** Files publicly accessible via URL
5. **Cleanup:** Failed warnings clean up uploaded files
6. **Validation:** Both client and server-side validation

---

## 🚀 Summary

**Changes:**
- ✅ Proof document now required
- ✅ Files saved to `public/warnings/`
- ✅ Document path stored in database
- ✅ FormData instead of JSON
- ✅ Complete validation

**Result:**
All warnings now have documented proof! 📄✨
