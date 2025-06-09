# ✅ Post-Holiday To-Do List

## 🔐 Security & Cleanup

- [ ] Change current test/default user passwords to secure ones (re-hash with bcrypt).
- [ ] Confirm all sensitive logic (e.g., reset password) uses token authentication.

## 🧪 Testing with Vitest

- [ ] Set up Vitest environment.
- [ ] Write unit tests for:
  - [ ] AuthContext logic
  - [ ] Utility functions (authValidation)
- [ ] Write integration tests for:
  - [ ] Protected routes
  - [ ] Password reset flow
  - [ ] API route behaviors

## 🚀 Deployment

- [ ] Replace all `localhost` URLs with environment variables.
- [ ] Set up production build process.
- [ ] Deploy backend & frontend.
- [ ] End-to-end test of deployed environment.

## 🧹 Polish

- [ ] Break up large route/controller files into reusable modules.
- [ ] Audit and refactor frontend components.
- [ ] Add user feedback (e.g., toasts) for logout and password reset actions.
