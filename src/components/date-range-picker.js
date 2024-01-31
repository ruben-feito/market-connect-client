import { useRef, useState } from 'react';
import { Box, Button, Popover } from '@mui/material';
import {
  DateRangePicker as RangePicker,
  defaultInputRanges,
  defaultStaticRanges,
} from 'react-date-range';
import locale from 'date-fns/locale/es';
import { isSameDay, subDays } from 'date-fns';

const translateLabel = (label) => {
  switch (label) {
    case 'Today':
      return 'Hoy';
    case 'Yesterday':
      return 'Ayer';
    case 'This Week':
      return 'Esta semana';
    case 'Last Week':
      return 'La semana pasada';
    case 'This Month':
      return 'Este mes';
    case 'Last Month':
      return 'El mes pasado';
    case 'This Year':
      return 'Este año';
    case 'Last Year':
      return 'El año pasado';
    case 'days up to today':
      return 'días hasta hoy';
    case 'days starting today':
      return 'días a partir de hoy';
    default:
      return label;
  }
};

export const DateRangePicker = ({
  onChange = () => {},
  startDate = subDays(new Date(), 7),
  endDate = new Date(),
  key = 'selection',
  months = 1,
  children,
  ...other
}) => {
  const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={anchorEl}
        color="inherit"
        {...other}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <RangePicker
          onChange={(item) =>
            onChange(item.selection.startDate, item.selection.endDate)
          }
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={months}
          direction="horizontal"
          dateDisplayFormat="d MMM, yyyy"
          dayDisplayFormat="d"
          ranges={[
            {
              startDate,
              endDate,
              key,
              color: '#7047eb',
            },
          ]}
          color="#000000"
          locale={locale}
          staticRanges={[
            ...defaultStaticRanges.map((range) => ({
              ...range,
              label: translateLabel(range.label),
            })),
            {
              label: 'Este año',
              range: () => ({
                startDate: new Date(new Date().getFullYear(), 0, 1),
                endDate: new Date(new Date().getFullYear(), 11, 31),
              }),
              isSelected: (range) =>
                isSameDay(
                  range.startDate,
                  new Date(new Date().getFullYear(), 0, 1),
                ) &&
                isSameDay(
                  range.endDate,
                  new Date(new Date().getFullYear(), 11, 31),
                ),
            },
            {
              label: 'El año pasado',
              range: () => ({
                startDate: new Date(new Date().getFullYear() - 1, 0, 1),
                endDate: new Date(new Date().getFullYear() - 1, 11, 31),
              }),
              isSelected: (range) =>
                isSameDay(
                  range.startDate,
                  new Date(new Date().getFullYear() - 1, 0, 1),
                ) &&
                isSameDay(
                  range.endDate,
                  new Date(new Date().getFullYear() - 1, 11, 31),
                ),
            },
          ]}
          inputRanges={defaultInputRanges.map((range) => ({
            ...range,
            label: translateLabel(range.label),
          }))}
        />
      </Popover>
    </>
  );
};
