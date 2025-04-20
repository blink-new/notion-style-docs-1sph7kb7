
# Notion-Style Documentation App Design

## Overview
A Notion-inspired documentation app with a rich block-based text editor, collapsible sidebar for page organization, Supabase authentication, shareable pages, page linking, and drag-and-drop reordering.

## Core Features

### 1. Authentication
- Email/password authentication using Supabase Auth
- User registration and login
- Protected routes for authenticated users

### 2. Workspace & Navigation
- Collapsible sidebar for page organization
- Hierarchical page structure (nested pages)
- Create, rename, and delete pages
- Drag-and-drop reordering of pages

### 3. Rich Text Editor
- Block-based editor with multiple content types:
  - Text (paragraph, headings, lists)
  - Code blocks
  - Images
  - Dividers
- Hover controls for block manipulation
- Markdown shortcuts

### 4. Page Management
- Create, edit, and delete pages
- Page linking (reference other pages)
- Page sharing with public/private visibility
- Real-time saving

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Workspaces Table
```sql
CREATE TABLE workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Pages Table
```sql
CREATE TABLE pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB DEFAULT '[]'::jsonb NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,
  parent_id UUID REFERENCES pages(id),
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  position INTEGER NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  updated_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## UI Components

### Layout
- `AppLayout`: Main layout with sidebar and content area
- `Sidebar`: Collapsible sidebar with page navigation
- `PageTree`: Hierarchical display of pages with nesting
- `Header`: App header with user menu and page actions

### Editor
- `Editor`: Main editor component
- `BlockControls`: Hover controls for block manipulation
- `BlockMenu`: Menu for adding new blocks
- `BlockTypes`: Various block type components

### Authentication
- `AuthModal`: Login/signup modal
- `LoginForm`: Email/password login form
- `SignupForm`: User registration form

## User Flow
1. User signs up/logs in
2. User is directed to their workspace
3. User can create pages and organize them in the sidebar
4. User can edit pages using the rich text editor
5. User can share pages with others via a public link

## Visual Style
- Monochrome UI with blue accents
- Clean typography
- Minimal UI with focus on content
- Subtle animations for interactions
- Block-based editor with hover controls

## Technical Stack
- React + Vite
- Tailwind CSS for styling
- ShadCN UI components
- Supabase for authentication and database
- Slate.js for rich text editing
- DND Kit for drag-and-drop functionality