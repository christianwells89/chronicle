import { Box, Container, Heading, Flex, Spacer, useColorModeValue } from '@chakra-ui/react';

import { DarkModeSwitch } from './darkModeSwitch';
import { Link } from './link';

export const Header = () => (
  <Box
    w="100%"
    bg={useColorModeValue('white', 'gray.800')}
    borderBottomWidth="2px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.400')}
  >
    <Container>
      <Flex>
        <Link href="/">
          <Heading>Chronicle</Heading>
        </Link>
        <Spacer />
        <DarkModeSwitch />
      </Flex>
    </Container>
  </Box>
);
