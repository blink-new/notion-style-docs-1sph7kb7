
import { ReactNode } from 'react';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button } from '../ui/button';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image,
  Minus,
  Type
} from 'lucide-react';

interface BlockControlsProps {
  children: ReactNode;
}

export default function BlockControls({ children }: BlockControlsProps) {
  const editor = useSlate();

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    const isList = format === 'bulleted-list' || format === 'numbered-list';

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ['bulleted-list', 'numbered-list'].includes(n.type),
      split: true,
    });

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
    
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <div className="group relative">
      {children}
      <div className="absolute -left-10 top-1/2 z-10 hidden -translate-y-1/2 transform rounded-md border bg-background p-1 shadow-md group-hover:flex">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleMark('bold')}
          data-active={isMarkActive('bold')}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleMark('italic')}
          data-active={isMarkActive('italic')}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleMark('underline')}
          data-active={isMarkActive('underline')}
        >
          <Underline size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleMark('code')}
          data-active={isMarkActive('code')}
        >
          <Code size={16} />
        </Button>
      </div>
      
      <div className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-full transform rounded-md border bg-background p-1 shadow-md group-hover:flex">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('paragraph')}
          data-active={isBlockActive('paragraph')}
        >
          <Type size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('heading-one')}
          data-active={isBlockActive('heading-one')}
        >
          <Heading1 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('heading-two')}
          data-active={isBlockActive('heading-two')}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('heading-three')}
          data-active={isBlockActive('heading-three')}
        >
          <Heading3 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('bulleted-list')}
          data-active={isBlockActive('bulleted-list')}
        >
          <List size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('numbered-list')}
          data-active={isBlockActive('numbered-list')}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('code-block')}
          data-active={isBlockActive('code-block')}
        >
          <Code size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBlock('divider')}
          data-active={isBlockActive('divider')}
        >
          <Minus size={16} />
        </Button>
      </div>
    </div>
  );
}