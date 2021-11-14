import { Container, Heading, Flex, Spacer } from '@chakra-ui/react';

import { DarkModeSwitch } from './darkModeSwitch';

export const Header = () => (
  <Container>
    <Flex>
      <Heading>Chronicle</Heading>
      <Spacer />
      <DarkModeSwitch />
    </Flex>
  </Container>
);
