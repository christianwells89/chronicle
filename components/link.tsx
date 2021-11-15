import { chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

export const Link = ({ href, children }: LinkProps) => (
  <NextLink href={href} passHref>
    <chakra.a cursor="pointer">{children}</chakra.a>
  </NextLink>
);
