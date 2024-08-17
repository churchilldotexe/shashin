![Camera SVG for Sahshin logo](/camera.svg)

# [Shashin](https://shashin-five.vercel.app/)

Shashin is an image storage and social gallery where you can share your uploaded images and create albums to organize them. This project uses Next.js app router, Tailwind CSS, and SQLite database. Authorization is implemented using JSON Web Tokens with jose. The project is created with minimal dependencies.

## Features

- Create and share posts with images
- Assign posts to existing albums or create new ones
- Share posts publicly or keep them private
- Bookmark other users' posts
- Favorite your own images for quick access

## Requirements

- Node.js 18.0 or higher
- pnpm 9.0.6 or higher

## Installation

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. [Add any additional setup steps here]

## Usage

[Provide more detailed instructions on how to use the application]

## Development
### stacked and dependencies used:
- [ React ](https://react.dev/)
- [ Nextjs ](https://nextjs.org/)
- [ server-only ](https://www.npmjs.com/package/server-only)
- [ tailwindcss ](https://tailwindcss.com/)
- [ turso database ](https://turso.tech/)
- [ drizzle orm (for schema and migration) ](https://orm.drizzle.team/)
- [ jose ](https://www.npmjs.com/package/jose)
- [ zod ](https://zod.dev/)
- [ uploadthing (image storage) ](https://uploadthing.com/)
- [ biomejs (for formatting and linting) ](https://biomejs.dev/)
- [ next-theme(dark mode theming) ](https://www.npmjs.com/package/next-themes)


### Lint Staged

A lint check is performed on every commit to ensure a type-safe codebase before pushing to GitHub or deploying.

### Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification. Commit messages must start with one of the following types (case-sensitive):

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

Example:

```
echo "foo: some message" # fails
echo "FIX: some message" # fails
echo "fix: some message" # passes
```
