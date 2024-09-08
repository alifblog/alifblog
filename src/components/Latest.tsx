import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

import axios from 'axios';

const TitleTypography = styled(Typography)(() => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
}));

function Author({ authors }: { authors?: { name: string; avatar: string }[] }) {
    if (!authors || authors.length === 0) return null; // If authors is undefined or empty, don't render anything
    if (typeof authors === 'string') {
        authors = [authors];
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar key={index} alt={author.name} src={author.avatar} sx={{ width: 24, height: 24 }} />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
    );
}

interface Post {
    title: string;
    description?: string;  // Optional
    tag?: string;          // Optional
    authors?: { name: string; avatar: string }[];  // Optional
    date: string;
    url: string;
}

  
export default function Latest({ searchQuery }: { searchQuery: string }) {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    // Fetch posts from the API
    const fetchPosts = async (page: number, searchQuery: string) => {
        try {
            const response = await axios.get(`/api/latest`, { params: { page, searchQuery } });
            setPosts(response.data.posts as Post[]);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching latest posts:', error);
        }
    };

    // Fetch posts when page or searchQuery changes
    useEffect(() => {
        fetchPosts(page, searchQuery);  // Refetch posts on page or searchQuery change
    }, [page, searchQuery]);  // Add searchQuery as a dependency to trigger fetch on change

    // Filter posts by searchQuery (optional if you want client-side filtering)
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination change
    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Latest
            </Typography>
            <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                                <Typography gutterBottom variant="caption">
                                    {post.tag}
                                </Typography>

                                <Link href="#" onClick={() => router.push(`/post/${post.url}`)}>
                                    <TitleTypography gutterBottom variant="h6" tabIndex={0}>
                                        {post.title}
                                        <NavigateNextRoundedIcon className="arrow" sx={{ fontSize: '1rem' }} />
                                    </TitleTypography>
                                </Link>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {post.description}
                                </Typography>
                                <Author authors={post.authors} />
                            </Box>
                        </Grid>
                    ))
                ) : (
                    <Typography>No posts found for &quote;{searchQuery}&quote;.</Typography>
                )}
            </Grid>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                    <Pagination count={totalPages} page={page} onChange={handleChange} />
                </Box>
            )}
        </div>
    );
}