# Storybook Architecture

> **Scope**: `apps/web`
> **Purpose**: Component Development Environment & Documentation

## 1. Overview

Storybook serves as our "workshop" for building UI components in isolation. It enforces the separation between **UI presentation** (how it looks) and **Business Logic** (how it works).

### Core Principles
1.  **Isolation**: Components must render without app-specific context (or with mocked context).
2.  **Completeness**: Every prop variant and state must be represented as a Story.
3.  **Documentation**: Auto-generated docs (Autodocs) serve as the source of truth for the Design System.

---

## 2. Integration with `@innovate/ui`

Since our core UI components live in `packages/ui`, Storybook in `apps/web` serves two purposes:
1.  **Documenting App-Specific Components**: Components in `apps/web/src/components` or `apps/web/src/domains/*/components`.
2.  **Showcasing Shared Components**: Re-exporting stories from `@innovate/ui` (optional, if we want a unified view).

For this project, we will focus on **App-Specific Components** and **Domain Components**.

---

## 3. Hierarchy

We follow Atomic Design principles, mapped to Storybook's sidebar structure:

```text
Sidebar
├── Atoms/           # Base primitives (Buttons, Inputs, Badges)
├── Molecules/       # Simple combinations (SearchInput, UserCard)
├── Organisms/       # Complex sections (Header, Sidebar, LoginForm)
├── Templates/       # Page layouts without data
└── Pages/           # Full pages (mocked data)
```

---

## 4. File Structure

Each component has a co-located `.stories.tsx` file.

```text
src/domains/auth/components/
├── LoginForm.tsx           # Implementation
├── LoginForm.stories.tsx   # Stories
└── LoginForm.test.tsx      # Unit tests
```

### Standard Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/Auth/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
```

---

## 5. Mocking Context

Components relying on Providers (Theme, Auth, Router) require decorators in `.storybook/preview.tsx`.

```typescript
// .storybook/preview.tsx
import { BrowserRouter } from 'react-router-dom';

export const decorators = [
  (Story) => (
    <BrowserRouter>
        <Story />
    </BrowserRouter>
  ),
];
```
