You are helping with a React + TypeScript + Vite project using TanStack Router, shadcn/ui, and React Query. Always follow these principles:

1. COMPONENT DESIGN:
- Use small, focused, reusable components.
- Prefer composition over prop drilling.
- Co-locate component files and styles (e.g., `components/button/`).
- File names must always use kebab-case (e.g., `user-card.tsx`).

2. UI/UX & DESIGN SYSTEM:
- Use as many `shadcn/ui` components as possible without modifying their styles to maintain a clean and consistent design system.
- Follow shadcn/ui design defaults for spacing, typography, shadows, border radius, and colors.
- Use `className` composition utilities like `clsx` or `cn()` for conditional styles.
- Avoid reinventing primitives — customize existing shadcn components with variants only if necessary.

3. FOLDER STRUCTURE:
- Use a page-based layout under `/pages/` (e.g., `/pages/home/`, `/pages/dashboard/`).
- Reusable components go in `/components/`.
- Hooks go in `/hooks/`.
- API-related logic goes in `/lib/api/`.
- Global stores and clients (e.g. queryClient) go in `/lib/`.
- Reusable utility functions go in `/lib/utils/`.
- Types go in `/types/`.

4. IMPORTS:
- Use only absolute imports with `@` prefix (e.g., `@/components/button`) following the shadcn/ui pattern.
- Never use relative imports like `../../`.

5. ROUTING (TANSTACK ROUTER):
- Co-locate routes inside `/pages/feature-name/route.tsx`.
- Keep route definitions shallow and declarative.
- Use `useMatch`, `useNavigate`, and `useLoaderData` for route-related logic.
- Use lazy loading for route components.

6. REACT QUERY:
- Centralize all queries and mutations under `/lib/api/`.
- Use `useQuery`, `useMutation`, and `queryClient.invalidateQueries()` responsibly.
- Show loading/success/error UI via shadcn `<Skeleton />`, `<Toast />`, `<Alert />`.

7. CODE STYLE:
- Use named exports by default.
- Use PascalCase for component names, camelCase for functions/variables.
- Use type-safe props with `interface` or `type`.
- Always type hook return values.
- Avoid anonymous default exports.

8. STATE MANAGEMENT:
- Prefer local state via `useState` or `useReducer`.
- Use React Query for server state.
- Use Zustand only when global client-side state is needed (store in `/lib/stores/`).

9. UI/UX BEST PRACTICES:
- Keep forms accessible with proper `label` and `htmlFor`.
- Use consistent spacing (usually multiples of 4 or 8).
- Use responsive utility classes from Tailwind (`sm:`, `md:`, etc.).
- Prefer subtle animations (`transition`, `ease-in-out`, `duration-150`) where possible.
- Avoid modals for critical flows unless necessary.
- Always confirm destructive actions.
- Toasts must auto-dismiss, use `<Toast duration={3000} />`.

10. NAMING CONVENTIONS:
- Components: `user-card.tsx`, `user-form.tsx`
- Hooks: `use-user-query.ts`, `use-create-user.ts`
- Utils: `format-date.ts`, `slugify.ts`
- API: `get-users.ts`, `create-user.ts`
- Types: `user.ts`, `auth.ts`

11. PERFORMANCE:
- Use `React.memo` only when profiling proves a bottleneck.
- Use `Suspense` + `lazy()` for route-level or modal components.
- Debounce expensive operations like search inputs.

12. DOCUMENTATION:
- Add brief JSDoc-style comments to public utilities and custom hooks.
- Keep README per domain if complexity warrants.

13. DO NOT WRITE COMMENTS NO MATTER WHAT

14. GENERIC + REUSABLE
- always prefer generic and reusable components.

Be opinionated and confident in applying these. Assume code quality matters and clarity > cleverness.