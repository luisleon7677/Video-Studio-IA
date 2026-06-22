# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills

**Always load the `remotion-best-practices` skill when working in this directory.**
The skill is located at [.agents/skills/remotion-best-practices/SKILL.md](.agents/skills/remotion-best-practices/SKILL.md) and contains authoritative rules for Remotion — animation patterns, asset handling, composition setup, 3D with React Three Fiber, captions, audio, transitions, and more.

## Project

This is a Remotion 4 + React Three Fiber project that renders a 3D phone mockup with video previews. Based on the [remotion-template-three](https://github.com/JonnyBurger/remotion-template-three) starter.

## Commands

```bash
npm run dev          # Remotion Studio preview (port 3000)
npx remotion render  # Render MP4 output
npx remotion upgrade # Upgrade Remotion packages
npx remotion still [composition-id] --scale=0.25 --frame=30  # Single-frame sanity check
```

## Architecture

- [src/Root.tsx](src/Root.tsx) — registers all `<Composition>` entries (fps, dimensions, duration)
- [src/Scene.tsx](src/Scene.tsx) — main 3D scene using `@remotion/three` + React Three Fiber; renders the phone canvas with a video inside
- [src/Phone.tsx](src/Phone.tsx) — phone shell geometry (rounded box, bezels, screen inset)
- [src/RoundedBox.tsx](src/RoundedBox.tsx) — reusable Three.js rounded-rectangle mesh
- [src/helpers/](src/helpers/) — layout math, media metadata utilities, rounded-rectangle path

Assets (video files) go in `public/` and are referenced via `staticFile()`.

## Key constraints

- **No CSS transitions or Tailwind animation classes** — they don't render in Remotion. Use `useCurrentFrame()` + `interpolate()` for all animations.
- OpenGL renderer is set to `"angle"` and image format to `"jpeg"` in [remotion.config.ts](remotion.config.ts).
- For 3D content, always consult [.agents/skills/remotion-best-practices/rules/3d.md](.agents/skills/remotion-best-practices/rules/3d.md).
