import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logo } from '../../components/logo';
import { paths } from '../../paths';

const TOP_NAV_HEIGHT = 90;

const backgroundsWithColors = [
  {
    image: '/assets/sitelicon/login/metro.webp',
    color1: '#FFFFFF',
    color2: '#FFFFFF',
  },
  {
    image: '/assets/sitelicon/login/nubes.webp',
    color1: '#000000',
    color2: 'orange',
  },
  {
    image: '/assets/sitelicon/login/astronauta.webp',
    color1: '#FFFFFF',
    color2: '#FFFFFF',
  },
  {
    image: '/assets/sitelicon/login/ciudad.webp',
    color1: '#FFFFFF',
    color2: '#FFFFFF',
  },
  {
    image: '/assets/sitelicon/login/cohete.webp',
    color1: '000000',
    color2: 'orange',
  },
  {
    image: '/assets/sitelicon/login/persona.webp',
    color1: '#FFFFFF',
    color2: '#FFFFFF',
  },
];

const randomBackgroundImage = () => {
  const random = Math.floor(Math.random() * backgroundsWithColors.length);
  return backgroundsWithColors[random];
};

const selectedBackground = randomBackgroundImage();

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${selectedBackground.image})`,
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
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ height: TOP_NAV_HEIGHT }}
            mb={3}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              component={NextLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 90,
                  width: 300,
                }}
              >
                <Logo
                  fillColor1={selectedBackground.color1}
                  fillColor2={selectedBackground.color2}
                />
              </Box>
            </Stack>
          </Stack>
          {children}
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
