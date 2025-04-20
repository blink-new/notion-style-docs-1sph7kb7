
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function SharedPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('id', id)
          .eq('is_public', true)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError('Page not found or not public');
          return;
        }
        
        setPage(data as Page);
      } catch (error: any) {
        setError(error.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [id]);

  // Helper function to render elements
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'heading-one':
        return <h1 className="mb-3 mt-6 text-3xl font-bold">{element.children.map((child: any) => renderLeaf(child))}</h1>;
      case 'heading-two':
        return <h2 className="mb-3 mt-5 text-2xl font-bold">{element.children.map((child: any) => renderLeaf(child))}</h2>;
      case 'heading-three':
        return <h3 className="mb-3 mt-4 text-xl font-bold">{element.children.map((child: any) => renderLeaf(child))}</h3>;
      case 'bulleted-list':
        return <ul className="ml-6 list-disc space-y-1">{element.children.map((child: any, i: number) => <li key={i}>{renderElement(child)}</li>)}</ul>;
      case 'numbered-list':
        return <ol className="ml-6 list-decimal space-y-1">{element.children.map((child: any, i: number) => <li key={i}>{renderElement(child)}</li>)}</ol>;
      case 'list-item':
        return <>{element.children.map((child: any, i: number) => renderLeaf(child))}</>;
      case 'code-block':
        return (
          <pre className="my-4 rounded-md bg-muted p-4 font-mono text-sm">
            <code>{element.children.map((child: any, i: number) => renderLeaf(child))}</code>
          </pre>
        );
      case 'divider':
        return <hr className="my-6 border-t" />;
      default:
        return <p className="mb-3">{element.children.map((child: any, i: number) => renderLeaf(child))}</p>;
    }
  };

  // Helper function to render leaf nodes
  const renderLeaf = (leaf: any) => {
    let text = leaf.text;
    
    if (leaf.bold) {
      text = <strong>{text}</strong>;
    }
    
    if (leaf.italic) {
      text = <em>{text}</em>;
    }
    
    if (leaf.underline) {
      text = <u>{text}</u>;
    }
    
    if (leaf.code) {
      text = <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">{text}</code>;
    }
    
    return text;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p className="mb-6 text-muted-foreground">{error || 'Page not found'}</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 flex items-center gap-1"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold">{page.title}</h1>
      </div>
      
      <div className="prose prose-slate max-w-none dark:prose-invert">
        {page.content.map((element, index) => (
          <div key={index}>{renderElement(element)}</div>
        ))}
      </div>
    </div>
  );
}