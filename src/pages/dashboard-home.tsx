import { useState } from 'react';
import { generateArticle } from '@/utils/openai.ts';
import ContentViewer from '@/components/dashboard/content-viewer.tsx';
import ContentCreateForm from '@/components/dashboard/content-create-form.tsx';
import { ContentCreateRequestParam } from '@/shared/types/content-create-request-param.ts';
import { useAppContext } from '@/contexts/app.context.tsx';
import toast from 'react-hot-toast';

export default function DashboardHome() {
  const { setGeneratingContent, generatingContent } = useAppContext();
  const [content, setContent] = useState<string | null>(null);

  const handleSubmit = async (params: ContentCreateRequestParam) => {
    setGeneratingContent(true);
    const { title, description } = params;
    try {
      const result = await generateArticle(title, description);
      setContent(result);
    } catch (error) {
      console.error('[Error] Failed to generate article', error);
      toast.error('Error occurred while generating content');
    } finally {
      setGeneratingContent(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Article Writer</h1>
      {content ? (
        <ContentViewer content={content} />
      ) : (
        <ContentCreateForm
          isLoading={generatingContent}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
