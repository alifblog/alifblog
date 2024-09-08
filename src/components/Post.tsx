import { useEffect } from 'react';
import Head from 'next/head';
import { Box, Chip } from '@mui/material';

import PageLayout from '../layouts/PageLayout';
import MarkdownRender from './MarkdownRender';

export interface PostProps {
  title: string;
  content: string;
  tags?: string[];
}

const Post: React.FC<PostProps> = ({ title, content, tags }) => {
  useEffect(() => {
    document.title = `${title} | ALIF Blog`;
  }, [title]);

  return (
    <PageLayout>

      {/* Head */}
      <Head>
        <title>{`${title} | ALIF Blog`}</title>
      </Head>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} />
          ))}
        </Box>
      )}

      {/* Render */}
      <MarkdownRender content={content} />
    </PageLayout>
  );
};

export default Post;
