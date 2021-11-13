import { Container, Heading, Flex, Spacer } from '@chakra-ui/react';

import { DarkModeSwitch } from './darkModeSwitch';

export const Header = () => (
  <Container>
    <Flex>
      <Heading>Journal</Heading>
      <Spacer />
      <DarkModeSwitch />
    </Flex>
  </Container>
);
