import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Typography, Box } from '@mui/material';

import PageLayout from '../layouts/PageLayout';

interface PageProps {
  content: string;
  headings: string[];
}

const Page: React.FC<PageProps> = ({ content, headings }) => {
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1 }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
        {headings.length > 0 && (
          <Box sx={{ width: 200 }}>
            <Typography variant="h6">Headings</Typography>
            <ul>
              {headings.map((heading) => (
                <li key={heading}>
                  <a href={`#${heading}`}>{heading}</a>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getMarkdownFiles } = await import('../lib/markdown'); // Dynamically import
  const files = getMarkdownFiles('md');

  const paths = files.map((file) => {
    const slug = file
      .replace(/^md\//, '')  // Remove md/ prefix
      .replace(/\.md$/, '')  // Remove .md extension
      .split('/');           // Convert the path into an array of directories

    return { params: { slug } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fs = (await import('fs')).default;
  const path = (await import('path')).default;
  const slug = params?.slug ? (params.slug as string[]).join('/') : 'index';
  const filePath = path.join(process.cwd(), 'md', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  const headings = content
    .split('\n')
    .filter((line) => line.startsWith('#'))
    .map((heading) => heading.replace('#', '').trim());

  return { props: { content, headings } };
};

export default Page;
