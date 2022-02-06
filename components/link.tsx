import { chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface LinkProps {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children }) => (
  <NextLink href={href} passHref>
    <chakra.a cursor="pointer" height="fit-content">
      {children}
    </chakra.a>
  </NextLink>
);
