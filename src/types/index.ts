
export type User = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type Workspace = {
  id: string;
  name: string;
  user_id: string;
};

export type Page = {
  id: string;
  title: string;
  content: any[];
  workspace_id: string;
  parent_id: string | null;
  is_public: boolean;
  position: number;
  user_id: string;
  children?: Page[];
};

export type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'bulleted-list' | 'numbered-list' | 'list-item' | 'code-block' | 'image' | 'divider';
  children: CustomText[];
  url?: string;
  alt?: string;
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}