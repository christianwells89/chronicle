import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = { href: string } & ComponentProps<typeof ChakraLink>;

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <ChakraLink
    as={NextLink}
    href={href}
    // The only links so far are buttons/cards so the underlining is not necessary. When there are
    // actual text links needed this component should be split up
    _hover={{ textDecoration: 'none' }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </ChakraLink>
);
