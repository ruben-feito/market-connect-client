import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountButton } from '../account-button';
import { ContactsButton } from '../contacts-button';
import { LanguageSwitch } from '../language-switch';
import { NotificationsButton } from '../notifications-button';
import { SearchButton } from '../search-button';
import Link from 'next/link';
import { MessagePlusSquare } from '@untitled-ui/icons-react';

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
  const { onMobileNavOpen, ...other } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) =>
          alpha(theme.palette.background.default, 0.8),
        position: 'sticky',
        left: {
          lg: `${SIDE_NAV_WIDTH}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu01Icon />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          {process.env.NEXT_PUBLIC_CONTEXT_APP === 'staging' && (
            <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
              ATENCIÓN Estás en el entorno de desarrollo —{' '}
              <strong>¡revisa la url!</strong>
            </Alert>
          )}
          {/* <LanguageSwitch /> */}
          <SearchButton />
          <NotificationsButton />
          {/* <Tooltip title="Formulario Incidencias">
            <IconButton
              component={Link}
              href="https://share.hsforms.com/1hYqu_go3TZ6E8H_OdFtiLg33jgb"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon>
                <MessagePlusSquare />
              </SvgIcon>
            </IconButton>
          </Tooltip> */}
          {/* <ContactsButton /> */}
          <AccountButton />
        </Stack>
      </Stack>
      <Divider />
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
