import type { Preview } from "@storybook/react-vite";
import commonDecorator from "./common-decorator";
import storybookEnv from "./storybook-env";

const preview: Preview = {
  decorators: [commonDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    globalTypes: {
      locale: {
        description: "Global locale for components",
        toolbar: {
          title: "Locale",
          icon: "circlehollow",
          items: [`locale: ${storybookEnv.locale}`],
          dynamicTitle: true,
          disabled: true,
        },
      },
    },

    initialGlobals: {
      locale: `locale: ${storybookEnv.locale}`,
    },
  },
};

export default preview;
