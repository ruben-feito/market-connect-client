import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { paths } from '../../paths';

export const AuthFooter = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pb: 3,
      }}
    >
      <Typography variant="body2">
        ¿No recuerdas tu contraseña?{' '}
        <Link
          component={NextLink}
          href={paths.auth.forgotPassword}
          underline="hover"
          variant="subtitle2"
        >
          Solicita una nueva
        </Link>
        .
      </Typography>
    </Box>
  );
};
