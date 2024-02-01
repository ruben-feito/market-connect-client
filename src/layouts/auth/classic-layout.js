import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const backgrounds = [
  '/assets/sitelicon/login/metro.webp',
  '/assets/sitelicon/login/nubes.webp',
  '/assets/sitelicon/login/astronauta.webp',
  '/assets/sitelicon/login/ciudad.webp',
  '/assets/sitelicon/login/cohete.webp',
  '/assets/sitelicon/login/persona.webp',
];

const randomBackgroundImage = () => {
  const random = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[random];
};

const selectedBackground = randomBackgroundImage();

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${selectedBackground})`,
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  height: '100%',
}));

export const Layout = (props) => {
  const { children } = props;

  return (
    <LayoutRoot>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flex: '1 1 auto',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '90px',
              md: '120px',
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
