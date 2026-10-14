import React from 'react';
import { Ward, CoolingPoint } from '@garmiq/types';
import { SelectedLocationSheet } from './SelectedLocationSheet';

interface WardBottomSheetProps {
  ward: Ward | null;
  coolingPoints?: CoolingPoint[];
  onClose: () => void;
}

export const WardBottomSheet: React.FC<WardBottomSheetProps> = ({
  ward,
  onClose
}) => {
  return (
    <SelectedLocationSheet
      ward={ward}
      coolingPoint={null}
      onClose={onClose}
    />
  );
};
