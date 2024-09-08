import { Box, Dialog } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import Image from 'next/image';

// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   maxWidth: '90%',
//   maxHeight: '90%',
//   overflow: 'auto',
// };

interface CustomMarkdownProps {
  content: string;
}

const MarkdownRender: React.FC<CustomMarkdownProps> = ({ content }) => {
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setModalImage(src);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const renderers = {
    img: ({ src, alt }: {src?: string; alt?: string}) => (
      <Image
        src={src ?? ''}
        alt={alt ?? ''}
        style={{
          display: 'block',
          margin: 'auto',
          maxWidth: '100%',
          cursor: 'pointer',
          borderRadius: '8px',
          boxShadow: 3 as unknown as string
        }}
        onClick={src ? (() => handleImageClick(src)) : undefined}
      />
    ),
    p: (paragraph: any) => (
      <Box component="p" sx={{ mb: 2 }}>
        {paragraph.children}
      </Box>
    ),
    h1: (props: any) => <Box component="h1" sx={{ fontSize: '2rem', mb: 2 }} {...props} />,
    h2: (props: any) => <Box component="h2" sx={{ fontSize: '1.75rem', mb: 2 }} {...props} />,
    h3: (props: any) => <Box component="h3" sx={{ fontSize: '1.5rem', mb: 2 }} {...props} />,
  };

  return (
    <>
      <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ maxHeight: '100vh', overflow: 'auto' }}>
        <Box sx={{ width: '100%', height: 'auto' }}>
          <Image
            src={modalImage || ''}
            alt="Enlarged"
            style={{
              display: 'block',
              margin: 'auto',
              width: '100%',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: 3 as unknown as string
            }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default MarkdownRender;
