import {
  Box,
  Button,
  Container,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ColorModeButton } from "~/components/ui/color-mode";
import type { Route } from "./+types/sample";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sample Page" },
    { name: "description", content: "Welcome to Sample Page!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const message: string = context.cloudflare.env.VALUE_FROM_CLOUDFLARE;
  return { message };
}

export default function Sample({ loaderData }: Route.ComponentProps) {
  return (
    <Container
      minH="100vh"
      h="100%"
      bg={{ base: "green.100", _dark: "green.900" }}
    >
      <HStack p={4}>
        <ColorModeButton />
        <Spacer />
        <Text>Sample Page : {loaderData.message}</Text>
      </HStack>
      <Box>
        <VStack>
          <Button>button</Button>
        </VStack>
      </Box>
    </Container>
  );
}
