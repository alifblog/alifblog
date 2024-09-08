import { useState } from 'react';

import PageLayout from '../layouts/PageLayout';
import MainContent from '../components/MainContent';
import Container from '@mui/material/Container';

import homepage_data from '../dist/homepage.json';
import Latest from '../components/Latest';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageLayout>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 10 }}
      >
        <MainContent data={homepage_data} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Latest searchQuery={searchQuery} />
      </Container>
    </PageLayout>
  );
};

export default Home;
