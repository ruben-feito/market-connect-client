import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import { Box, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { TenantPopover } from './tenant-popover';
import { Logo } from '../../../components/logo';

const tenants = ['🇪🇸 Español', '🇵🇹 Portugues', '🇮🇹 Italiano', '🇫🇷 Frances'];

export const TenantSwitch = (props) => {
  const anchorRef = useRef(null);
  const [tenant, setTenant] = useState(tenants[0]);
  const [openPopover, setOpenPopover] = useState(false);

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const handleTenantChange = useCallback((tenant) => {
    setOpenPopover(false);
    setTenant(tenant);
  }, []);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 107,
            }}
          >
            <Logo />
          </Box>
          <Typography color="neutral.500" variant="body2">
            Market Connect
          </Typography>
        </Box>
        {/* <IconButton onClick={handlePopoverOpen} ref={anchorRef}>
          <SvgIcon sx={{ fontSize: 16 }}>
            <ChevronDownIcon />
          </SvgIcon>
        </IconButton> */}
      </Stack>
      {/* <TenantPopover
        anchorEl={anchorRef.current}
        onChange={handleTenantChange}
        onClose={handlePopoverClose}
        open={openPopover}
        tenants={tenants}
      /> */}
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
