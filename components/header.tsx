import { Box, Container, Heading, Flex, Spacer, useColorModeValue } from '@chakra-ui/react';

import { DarkModeSwitch } from './darkModeSwitch';
import { Link } from './link';
import { Quill } from './quill';

export const Header = () => (
  <Box
    w="100%"
    bg={useColorModeValue('white', 'gray.800')}
    borderBottomWidth="2px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.400')}
  >
    <Container maxW="container.md">
      <Flex>
        <Link href="/">
          <Flex alignItems="center">
            <Quill height="30px" />
            <Heading ml={2} color={useColorModeValue('orange.800', 'orange.200')}>
              Chronicle
            </Heading>
          </Flex>
        </Link>
        <Spacer />
        <DarkModeSwitch />
      </Flex>
    </Container>
  </Box>
);
