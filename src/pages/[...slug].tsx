import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import Post from '../components/Post';

interface PostPageProps {
  title: string;
  content: string;
  tags?: string[];
}

const PostPage: React.FC<PostPageProps> = ({ title, content, tags }) => {
  return <Post title={title} content={content} tags={tags} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getMarkdownFiles } = await import('../lib/markdown');
  const files = getMarkdownFiles('md');
  const paths = files.map((file) => {
    const slug = file.replace(/^md\//, '').replace(/\.md$/, '').split('/');
    return { params: { slug } };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fs = (await import('fs')).default;
  const path = (await import('path')).default;

  const slug = params?.slug ? (params.slug as string[]).join('/') : 'index';
  const filePath = fs.existsSync( path.join(process.cwd(), 'md', `${slug}.md`) ) ? 
    path.join(process.cwd(), 'md', `${slug}.md`) : 
    path.join(process.cwd(), 'src/md', `${slug}.md`)
  ;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const { content, data } = matter(fileContents);
  return { props: { title: data.title, content, tags: data.tags || [] } };
};


export default PostPage;
