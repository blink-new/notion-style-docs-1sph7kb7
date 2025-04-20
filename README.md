
# Notion-Style Documentation App

A Notion-inspired documentation app with a rich block-based text editor, collapsible sidebar for page organization, Supabase authentication, shareable pages, page linking, and drag-and-drop reordering.

## Features

- **Authentication**: Email/password authentication using Supabase Auth
- **Workspace Management**: Create and manage multiple workspaces
- **Page Organization**: Hierarchical page structure with nested pages
- **Rich Text Editor**: Block-based editor with formatting options
- **Page Sharing**: Make pages public and share them with others
- **Real-time Saving**: Content is saved automatically as you type

## Tech Stack

- **Frontend**: React + Vite
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **State Management**: Zustand
- **Text Editor**: Slate.js
- **Drag and Drop**: DND Kit

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
4. Run the development server: `npm run dev`

## Database Schema

The application uses the following database tables:

- **users**: Extends Supabase auth users with additional profile information
- **workspaces**: Represents a collection of pages
- **pages**: Stores page content and metadata

## Usage

1. Sign up for an account
2. Create a workspace
3. Add pages to your workspace
4. Edit pages using the rich text editor
5. Share pages with others by making them public

## License

MIT