import { chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = { href: string } & ComponentProps<typeof chakra.a>;

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <NextLink href={href} passHref>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <chakra.a cursor="pointer" height="fit-content" {...props}>
      {children}
    </chakra.a>
  </NextLink>
);
