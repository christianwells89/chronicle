import { Tooltip as ChakraTooltip, PlacementWithLogical } from '@chakra-ui/react';

interface TooltipProps {
  label: string;
  placement?: PlacementWithLogical;
}

export const Tooltip: React.FC<TooltipProps> = ({ label, children, placement = 'bottom' }) => (
  <ChakraTooltip hasArrow closeOnMouseDown openDelay={500} label={label} placement={placement}>
    {children}
  </ChakraTooltip>
);
