import {
  Box,
  Button,
  Container,
  HStack,
  Portal,
  Select,
  Spacer,
  Text,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { ServerGlobalContext } from "workers/app";
import { ColorModeButton } from "~/components/ui/color-mode";
import {
  supportedLanguagesLabelAndValue,
  type i18nextResourceType,
} from "~/infra/i18n/i18n-config";
import { getInstance } from "~/middleware/i18next";
import type { Route } from "./+types/sample";

export function meta({ data }: Route.MetaArgs) {
  const translations = data?.translations;

  return [
    { title: translations?.sample.title },
    { name: "description", content: translations?.sample.description },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const message: string =
    context.get(ServerGlobalContext).cloudflare.env.VALUE_FROM_CLOUDFLARE;
  const i18next = getInstance(context);
  const translations: Pick<i18nextResourceType, "sample"> = {
    sample: {
      title: i18next.t("sample.title"),
      description: i18next.t("sample.description"),
    },
  };

  return { message, translations };
}

export default function Sample({
  loaderData,
  params,
}: Pick<Route.ComponentProps, "loaderData" | "params">) {
  const { message, translations } = loaderData;
  const { locale } = params;
  const location = useLocation();
  const navigate = useNavigate();

  const languages = createListCollection({
    items: supportedLanguagesLabelAndValue,
  });

  const handleLanguageChange = (details: { value: string[] }) => {
    const selectedLanguage = details.value[0];
    const currentPath = location.pathname;
    const newPath = currentPath.replace(
      new RegExp(`^/${locale}`),
      `/${selectedLanguage}`
    );
    navigate(newPath);
  };

  return (
    <Container
      minH="100vh"
      h="100%"
      bg={{ base: "green.100", _dark: "green.900" }}
    >
      <HStack p={4}>
        <ColorModeButton />
        <Spacer />
        <Text>Sample Page : {message}</Text>
        <Spacer />
        <Select.Root
          collection={languages}
          value={[locale]}
          onValueChange={handleLanguageChange}
          width="120px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Language" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {languages.items.map((language) => (
                  <Select.Item item={language} key={language.value}>
                    {language.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>
      <Box>
        <HStack>
          <Text>
            {translations.sample.title} / {translations.sample.description}
          </Text>
        </HStack>
        <VStack>
          <Button>button</Button>
        </VStack>
      </Box>
    </Container>
  );
}
