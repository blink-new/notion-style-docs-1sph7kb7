
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Sample data types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Page {
  id: string;
  title: string;
  content: any[];
  children?: Page[];
}

interface Workspace {
  id: string;
  name: string;
  pages: Page[];
}

// Sample data
const SAMPLE_USER: User = {
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

const SAMPLE_WORKSPACE: Workspace = {
  id: 'workspace-1',
  name: 'Demo Workspace',
  pages: [
    {
      id: 'page-1',
      title: 'Getting Started',
      content: [
        { type: 'heading', text: 'Welcome to Notion-Style Docs!' },
        { type: 'paragraph', text: 'This is a sample page to help you get started with the app.' },
        { type: 'heading-2', text: 'Features' },
        { type: 'bullet', text: 'Rich text editing with formatting' },
        { type: 'bullet', text: 'Organize pages in a workspace' },
        { type: 'bullet', text: 'Share pages with others' }
      ],
      children: []
    },
    {
      id: 'page-2',
      title: 'Project Notes',
      content: [
        { type: 'heading-2', text: 'Project Ideas' },
        { type: 'paragraph', text: 'Here are some ideas for the project:' },
        { type: 'bullet', text: 'Add image upload support' },
        { type: 'bullet', text: 'Implement dark mode' },
        { type: 'bullet', text: 'Add collaborative editing' }
      ],
      children: [
        {
          id: 'page-4',
          title: 'Development Tasks',
          content: [
            { type: 'heading-2', text: 'Development Tasks' },
            { type: 'paragraph', text: 'List of tasks to complete:' },
            { type: 'bullet', text: 'Fix sidebar responsiveness' },
            { type: 'bullet', text: 'Implement page sharing' },
            { type: 'bullet', text: 'Add user settings page' }
          ],
          children: []
        }
      ]
    },
    {
      id: 'page-3',
      title: 'Meeting Notes',
      content: [
        { type: 'heading-2', text: 'Team Meeting - July 15, 2023' },
        { type: 'paragraph', text: 'Attendees: John, Sarah, Mike' },
        { type: 'heading-3', text: 'Agenda' },
        { type: 'numbered', text: 'Project status update' },
        { type: 'numbered', text: 'Timeline review' },
        { type: 'numbered', text: 'Next steps' },
        { type: 'heading-3', text: 'Action Items' },
        { type: 'paragraph', text: 'Sarah: Complete design review by Friday' },
        { type: 'paragraph', text: 'Mike: Update documentation' },
        { type: 'paragraph', text: 'John: Schedule follow-up meeting' }
      ],
      children: []
    }
  ]
};

// Demo Page Component
export default function DemoPage() {
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  
  useEffect(() => {
    // Set the first page as current page on load
    if (SAMPLE_WORKSPACE.pages.length > 0) {
      setCurrentPage(SAMPLE_WORKSPACE.pages[0]);
    }
  }, []);

  const renderPageContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'heading':
          return <h1 key={index} className="mb-4 text-3xl font-bold">{item.text}</h1>;
        case 'heading-2':
          return <h2 key={index} className="mb-3 mt-6 text-2xl font-semibold">{item.text}</h2>;
        case 'heading-3':
          return <h3 key={index} className="mb-2 mt-4 text-xl font-medium">{item.text}</h3>;
        case 'paragraph':
          return <p key={index} className="mb-4">{item.text}</p>;
        case 'bullet':
          return (
            <div key={index} className="mb-2 flex items-start">
              <div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              <p>{item.text}</p>
            </div>
          );
        case 'numbered':
          return (
            <div key={index} className="mb-2 flex items-start">
              <div className="mr-2 font-medium text-blue-600">{index + 1}.</div>
              <p>{item.text}</p>
            </div>
          );
        default:
          return <p key={index}>{item.text}</p>;
      }
    });
  };

  const renderPageTree = (pages: Page[], level = 0) => {
    return pages.map(page => (
      <div key={page.id} className="mb-1">
        <button
          className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm ${
            currentPage?.id === page.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setCurrentPage(page)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {page.title}
        </button>
        {page.children && page.children.length > 0 && (
          <div className="ml-2">{renderPageTree(page.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Notion Docs</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{SAMPLE_USER.name}</span>
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img
                src={SAMPLE_USER.avatar}
                alt={SAMPLE_USER.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-gray-50 p-4">
          <div className="mb-4">
            <h2 className="mb-2 font-medium">{SAMPLE_WORKSPACE.name}</h2>
            <button className="flex w-full items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Page
            </button>
          </div>
          <div className="space-y-1">
            {renderPageTree(SAMPLE_WORKSPACE.pages)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {currentPage ? (
            <div>
              <h1 className="mb-6 text-3xl font-bold">{currentPage.title}</h1>
              <div className="prose max-w-none">
                {renderPageContent(currentPage.content)}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Select a page from the sidebar</p>
            </div>
          )}
        </div>
      </div>

      {/* Dev Mode Indicator */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
          <span className="font-medium">Demo Mode</span>
        </div>
        <a 
          href="/"
          className="ml-2 rounded border border-yellow-300 bg-yellow-50 px-2 py-1 text-xs hover:bg-yellow-200"
        >
          Exit
        </a>
      </div>
    </div>
  );
}