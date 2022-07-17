import { Box, Container, Flex, Heading, Spacer, useColorModeValue } from '@chakra-ui/react';

import { Link } from '~/components/link';
import { Quill } from '~/components/quill';

import { DarkModeSwitch } from './darkModeSwitch';
import { LogoutButton } from './logoutButton';
import { NewEntryButton } from './newEntryButton';

export const Header: React.VFC = () => (
  <Box
    w="100%"
    bg={useColorModeValue('white', 'gray.800')}
    borderBottomWidth="2px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.400')}
  >
    <Container maxW="container.md">
      <Flex alignItems="center" gap={2}>
        <Link href="/">
          <Flex alignItems="center">
            <Quill height="30px" />
            <Heading ml={2} color={useColorModeValue('orange.500', 'orange.200')}>
              Chronicle
            </Heading>
          </Flex>
        </Link>
        <Spacer />
        <NewEntryButton />
        <DarkModeSwitch />
        <LogoutButton />
      </Flex>
    </Container>
  </Box>
);
