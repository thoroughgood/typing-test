# AI Agents Setup and Next.js Version

This repository uses AI coding agents for automated upgrades and migrations.

- **Target Next.js version:** 16
- **Primary upgrade docs:** https://nextjs.org/docs/app/guides/upgrading/version-16
- **Codemod reference:** https://nextjs.org/docs/app/guides/upgrading/version-16#using-the-codemod

Agent checklist for Next.js 16 upgrades:

1. Use the official Next.js 16 upgrade guide as the source of truth.
2. Run the Next.js 16 codemod before making manual edits:
   - Example command: `npx @next/codemod@latest --to=next@16 .`

3. Run `npm install` / `pnpm install` to update dependencies and `next dev` and `next build` to verify.
4. If Turbopack is available (Next.js 16.3+), prefer `next dev` with Turbopack or the `next-dev-loop` skill.
5. Update this file if the project's Next.js version changes.

For more agent setup details, see: /docs/app/guides/upgrading/version-16#set-up-ai-agent-docs
