# Environment Configuration

## Setting Up Environment Variables

Create a `.env.local` file in the `next-app` folder with the following content:

```env
# Environment: 'local' or 'production'
# Set to 'local' for full admin access (create/edit/delete)
# Set to 'production' for read-only mode (view only)
NEXT_PUBLIC_APP_ENV=local
```

## Environment Modes

| Mode | Value | Admin Actions |
|------|-------|---------------|
| **Local** | `NEXT_PUBLIC_APP_ENV=local` | Full access - can issue warnings, edit members |
| **Production** | `NEXT_PUBLIC_APP_ENV=production` | Read-only - view-only mode for public deployment |

## Vercel Deployment

When deploying to Vercel:

1. Go to **Project Settings** → **Environment Variables**
2. Add: `NEXT_PUBLIC_APP_ENV` = `production`

This will enable read-only mode on the production site since Vercel has a read-only filesystem.
