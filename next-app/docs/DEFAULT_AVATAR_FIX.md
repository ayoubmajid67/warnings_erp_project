# Default Avatar Placeholder

The test user references `/profiles/default-avatar.png` which doesn't exist yet.

## Quick Fix Options:

### Option 1: Use an existing profile image
Update the test user in `members.json` to use an existing profile:
```json
"profileImage": "/profiles/Alae_Eddine_Acheache/profile.png"
```

### Option 2: Create a default avatar
Place a default avatar image at:
```
public/profiles/default-avatar.png
```

### Option 3: Use initials fallback
The system already handles missing images by showing initials, so this error is just a warning and won't break functionality.

## Recommended Solution:
Update the test user to use initials by setting profileImage to null or an empty string:

```json
"profileImage": null
```

This will automatically show "TU" (TEST USER) as initials in a circle.
