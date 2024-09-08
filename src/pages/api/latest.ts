import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Post {
  title?: string;
  description?: string;
  date?: string; // Make 'date' optional
  tag?: string;
  slug: string;
  url: string;
}

const POSTS_PER_PAGE = 2;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const postsDirectory = fs.existsSync( path.join(process.cwd(), 'md/post') ) ? 
    path.join(process.cwd(), 'md/post') : 
    path.join(process.cwd(), 'src/md/post')
  ;

  const fileNames = fs.readdirSync(postsDirectory);
  
  // Read and parse all markdown files
  const posts: Post[] = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    const slug = fileName.replace(/\.md$/, '');

    return {
      ...data,
      slug: fileName.replace(/\.md$/, ''),
      url: `/${slug}`,
    };
  });

  // Sort posts by date (descending)
  let sortedPosts = posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;  // Sort descending by date
  });

  // Req Params
  const { page = 1, searchQuery = '' } = req.query;

  // Filter
  if (searchQuery) {
    const queryLower = searchQuery.toString().toLowerCase();
    sortedPosts = sortedPosts.filter(
      (post) =>
        (post.title && post.title.toLowerCase().includes(queryLower)) ||
        (post.description && post.description.toLowerCase().includes(queryLower)) ||
        (post.tag && post.tag.toLowerCase().includes(queryLower))
    );
  }

  // Pagination
  const paginatedPosts = sortedPosts.slice((+page - 1) * POSTS_PER_PAGE, +page * POSTS_PER_PAGE);

  res.status(200).json({
    posts: paginatedPosts,
    totalPosts: sortedPosts.length,
    totalPages: Math.ceil(sortedPosts.length / POSTS_PER_PAGE),
  });
}
