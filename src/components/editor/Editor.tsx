
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { usePageStore } from '../../store/page';
import BlockControls from './BlockControls';
import { cn } from '../../lib/utils';

interface EditorProps {
  pageId: string;
  initialContent: Descendant[];
}

export default function Editor({ pageId, initialContent }: EditorProps) {
  const [value, setValue] = useState<Descendant[]>(initialContent);
  const { updatePageContent } = usePageStore();
  
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Define a rendering function for elements
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'heading-one':
        return <h1 {...props.attributes} className="mb-3 mt-6 text-3xl font-bold">{props.children}</h1>;
      case 'heading-two':
        return <h2 {...props.attributes} className="mb-3 mt-5 text-2xl font-bold">{props.children}</h2>;
      case 'heading-three':
        return <h3 {...props.attributes} className="mb-3 mt-4 text-xl font-bold">{props.children}</h3>;
      case 'bulleted-list':
        return <ul {...props.attributes} className="ml-6 list-disc space-y-1">{props.children}</ul>;
      case 'numbered-list':
        return <ol {...props.attributes} className="ml-6 list-decimal space-y-1">{props.children}</ol>;
      case 'list-item':
        return <li {...props.attributes}>{props.children}</li>;
      case 'code-block':
        return (
          <pre {...props.attributes} className="my-4 rounded-md bg-muted p-4 font-mono text-sm">
            <code>{props.children}</code>
          </pre>
        );
      case 'divider':
        return (
          <div {...props.attributes} contentEditable={false}>
            <hr className="my-6 border-t" />
            {props.children}
          </div>
        );
      default:
        return <p {...props.attributes} className="mb-3">{props.children}</p>;
    }
  }, []);

  // Define a rendering function for leaf nodes
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let children = props.children;
    
    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    
    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }
    
    if (props.leaf.code) {
      children = <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">{children}</code>;
    }
    
    return <span {...props.attributes}>{children}</span>;
  }, []);

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
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start writing..."
          spellCheck
          autoFocus
          className="min-h-[calc(100vh-200px)] outline-none"
          renderPlaceholder={({ children, attributes }) => (
            <div {...attributes}>
              <p className="pointer-events-none absolute text-muted-foreground">{children}</p>
            </div>
          )}
          decorate={([node, path]) => {
            return [];
          }}
          renderBlock={({ children, attributes }) => (
            <BlockControls>
              <div {...attributes}>{children}</div>
            </BlockControls>
          )}
        />
      </Slate>
    </div>
  );
}