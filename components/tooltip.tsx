import { Tooltip as ChakraTooltip, PlacementWithLogical } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  placement?: PlacementWithLogical;
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ label, children, placement = 'bottom' }) => (
  <ChakraTooltip hasArrow closeOnMouseDown openDelay={500} label={label} placement={placement}>
    {children}
  </ChakraTooltip>
);
