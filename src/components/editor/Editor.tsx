
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { usePageStore } from '../../store/page';
import { cn } from '../../lib/utils';

// Define custom element components
const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="mb-3 mt-6 text-3xl font-bold">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="mb-3 mt-5 text-2xl font-bold">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="mb-3 mt-4 text-xl font-bold">{children}</h3>;
    case 'bulleted-list':
      return <ul {...attributes} className="ml-6 list-disc space-y-1">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="ml-6 list-decimal space-y-1">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'code-block':
      return (
        <pre {...attributes} className="my-4 rounded-md bg-muted p-4 font-mono text-sm">
          <code>{children}</code>
        </pre>
      );
    case 'divider':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <hr className="my-6 border-t" />
          </div>
          {children}
        </div>
      );
    default:
      return <p {...attributes} className="mb-3">{children}</p>;
  }
};

// Define custom leaf components
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children;
  
  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }
  
  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }
  
  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }
  
  if (leaf.code) {
    styledChildren = <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">{styledChildren}</code>;
  }
  
  return <span {...attributes}>{styledChildren}</span>;
};

interface EditorProps {
  pageId: string;
  initialContent: Descendant[];
}

export default function Editor({ pageId, initialContent }: EditorProps) {
  const [value, setValue] = useState<Descendant[]>(initialContent);
  const { updatePageContent } = usePageStore();
  
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Save content to the database when it changes
  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    
    // Debounce the save operation
    const timeoutId = setTimeout(() => {
      updatePageContent(pageId, newValue);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <Slate
        editor={editor}
        value={value}
        onChange={handleChange}
      >
        <Editable
          renderElement={Element}
          renderLeaf={Leaf}
          placeholder="Start writing..."
          spellCheck
          autoFocus
          className="min-h-[calc(100vh-200px)] outline-none"
        />
      </Slate>
    </div>
  );
}