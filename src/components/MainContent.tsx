import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


interface MainContentProps {
    data: {
        tags: { name: string; url: string }[];
        posts: {
            img: string;
            tag: string;
            title: string;
            description: string;
            date: string;
            url: string;
            authors: { name: string; avatar: string; url: string }[];
        }[];
    };
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function AuthorAndDate({ authors, date }: { authors: { name: string; avatar: string }[], date: string }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                <AvatarGroup max={3}>
                    {authors.map((AuthorAndDate, index) => (
                        <Avatar key={index} alt={AuthorAndDate.name} src={AuthorAndDate.avatar} sx={{ width: 24, height: 24 }} />
                    ))}
                </AvatarGroup>
                <Typography variant="caption">{authors.map((AuthorAndDate) => AuthorAndDate.name).join(', ')}</Typography>
            </Box>
            <Typography variant="caption">{date}</Typography>
        </Box>
    );
}

export function Search({ setSearchQuery }: { setSearchQuery?: (query: string) => void }) {
    return (
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                sx={{ flexGrow: 1 }}
                startAdornment={
                    <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                        <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
        </FormControl>
    );
}

export default function MainContent({ data, searchQuery, setSearchQuery }: MainContentProps) {

    const filteredPosts = data.posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>
                <Typography variant="h1" gutterBottom>
                    Blog
                </Typography>
                <Typography>Stay in the loop with the latest about our products</Typography>
            </div>
            <Box
                sx={{
                display: { xs: 'flex', sm: 'none' },
                flexDirection: 'row',
                gap: 1,
                width: { xs: '100%', md: 'fit-content' },
                overflow: 'auto',
                }}
            >
                <Search setSearchQuery={setSearchQuery} />
            </Box>
            <Box
                sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                width: '100%',
                justifyContent: 'space-between',
                alignItems: { xs: 'start', md: 'center' },
                gap: 4,
                overflow: 'auto',
                }}
            >
                <Box sx={{ display: 'inline-flex', flexDirection: 'row', gap: 3, overflow: 'auto' }}>
                    {data.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            onClick={() => window.location.href = tag.url}
                            size="medium"
                            label={tag.name}
                        />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'row',
                        gap: 1,
                        width: { xs: '100%', md: 'fit-content' },
                        overflow: 'auto',
                    }}
                >
                    <Search setSearchQuery={setSearchQuery} />
                </Box>
            </Box>

            {filteredPosts.length > 0 && (
                <Grid container spacing={2} columns={12}>
                    {filteredPosts.map((post, index) => (
                        <Grid key={index} size={{ xs: 12, md: 6 }}>
                            <SyledCard
                                variant="outlined"
                                onClick={() => window.location.href = post.url} // Navigate to post's URL
                                tabIndex={0}
                            >
                                <CardMedia component="img" alt={post.title} image={post.img} sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                                <SyledCardContent>
                                    <Typography gutterBottom variant="caption">{post.tag}</Typography>
                                    <Typography gutterBottom variant="h6">{post.title}</Typography>
                                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>{post.description}</StyledTypography>
                                </SyledCardContent>
                                <AuthorAndDate authors={post.authors} date={post.date} />
                            </SyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}
            
        </Box>
    );
}
