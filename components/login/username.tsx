import { FormControl, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Username = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <FormControl>
    <FormLabel htmlFor="username">Username</FormLabel>
    <Input {...props} ref={ref} />
  </FormControl>
));
