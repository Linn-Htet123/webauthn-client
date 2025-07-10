## WebAuthn Client

This project is a WebAuthn client built with Next.js and TypeScript. It provides a modern web interface for user registration and authentication using the Web Authentication API (WebAuthn), enabling passwordless and secure login experiences.

### Features

- User registration and login with WebAuthn (FIDO2)
- Modern UI components built with React and TypeScript
- Modular structure for easy extension
- Example forms for registration and login

### Project Structure

```
├── app/                # Next.js app directory (pages, layout, global styles)
├── components/         # Reusable UI and form components
│   ├── login-form.tsx
│   ├── registration-form.tsx
│   └── ui/             # UI primitives (button, card, input, etc.)
├── lib/                # Utility and service functions
│   ├── utils.ts
│   └── webauthn-service.ts
├── public/             # Static assets
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── ...
```

### Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
