<laravel-boost-guidelines>
=== foundation rules ===

# Pasaraya — Agent Instructions

## Stack
- Laravel, PHP 8.5, Inertia.js, React, TypeScript.
- Tailwind CSS, shadcn/ui (Nova preset), Lucide React.
- MySQL.
- Follow installed package versions; inspect `composer.json` and `package.json`.

## Project Rules
- Follow Laravel Boost guidelines and existing project conventions.
- Before editing files, read `.ai/rules/index.md` if `.ai/rules` exists, then read matching rules and search `.ai/rules` for relevant keywords.
- Activate relevant project skills before working in their domains.
- Inspect existing code and reuse components before creating new ones.
- Do not add dependencies or create documentation files without approval.
- Follow Laravel conventions and use Artisan generators where appropriate.

## Design System
- Style: modern, minimal SaaS marketplace for local MSMEs.
- Brand: emerald green; support light and dark themes.
- Font: Geist (Nova preset).
- Follow `docs/design-system.md` if available.
- Use semantic CSS variables and existing Tailwind tokens.
- Prefer shadcn/ui and Lucide React; avoid duplicate components and excessive effects.
- Keep layouts responsive, accessible, and visually consistent.

## Coding
- Use descriptive names, explicit PHP types and return types, and curly braces.
- Use TypeScript types and reusable components.
- Separate business logic from generic UI.
- Preserve existing architecture and unrelated functionality.
- Use named Laravel routes and Eloquent API Resources where appropriate.
- Follow existing authentication, authorization, validation, and error-handling patterns.

## Testing & Verification
- Run relevant tests and build/type checks after changes.
- For PHP changes, run `vendor/bin/pint --dirty --format agent`.
- Follow PHPUnit conventions and use factories for test data.
- Inspect browser logs when troubleshooting frontend errors.

## Deployment
- Follow Laravel deployment conventions.
- Activate the `deploying-to-cloud` skill for Laravel Cloud deployment tasks.

</laravel-boost-guidelines>
