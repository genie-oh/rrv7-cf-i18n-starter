import storybookEnv from "../../.storybook/storybook-env";
import type { StoryObj } from "@storybook/react-vite";
import { i18nextResources } from "../../app/infra/i18n/i18n-config";
import Sample from "../../app/routes/sample";

// Storybook Meta
const meta = {
  title: "Routes/Sample",
  component: Sample,
  parameters: {
    initialPath: "/sample", // required to initialEntries of createMemoryRouter in common-decorator.tsx
    layout: "fullscreen",
    docs: {
      description: {
        component: "Home page component with navigation and language switcher.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SampleStory: StoryObj<typeof meta> = {
  args: {
    loaderData: {
      message: "Message from Storybook",
      translations: {
        sample: i18nextResources[storybookEnv.locale]?.translation.sample,
      },
    },
    params: {
      locale: storybookEnv.locale,
    },
  },
};
