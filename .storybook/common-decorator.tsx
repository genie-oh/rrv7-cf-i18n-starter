import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { Provider } from "../app/components/ui/provider";
import type { StoryContext } from "@storybook/react-vite";

export default (Story: React.ComponentType, context: StoryContext) => {
  const initialPath = context.parameters?.initialPath;
  if (!initialPath) {
    throw new Error("initialPath is required");
  }

  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: (
          <Provider>
            <Story />
          </Provider>
        ),
      },
    ],
    {
      initialEntries: [initialPath],
    }
  );

  return <RouterProvider router={router} />;
};
