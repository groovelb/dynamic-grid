# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Ruler로 규칙 중앙 관리

이 프로젝트는 `.ruler/` 디렉토리 내 Markdown 규칙을 단일 소스로 관리하고, `@intellectronica/ruler`를 통해 Cursor 등 도구에 적용합니다.

- 규칙 편집 위치: `.ruler/*.md` (예: `01-code-convention.md`)
- Cursor 출력 파일(자동 생성): `.cursor/rules/ruler-generated.mdc` (gitignore 처리됨)

### 스크립트

```bash
pnpm run rules:init          # .ruler/ 및 기본 설정 생성
pnpm run rules:apply         # 모든 에이전트에 규칙 적용
pnpm run rules:apply:cursor  # Cursor에만 규칙 적용
```

### 편집 플로우
1. `.ruler/*.md`에서 규칙을 수정합니다.
2. `pnpm run rules:apply:cursor` 실행으로 반영합니다.
3. 변경사항을 확인 후 커밋합니다.
