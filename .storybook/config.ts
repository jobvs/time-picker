import { addDecorator, configure } from "@storybook/react";
import { checkA11y } from "@storybook/addon-a11y";
import { withKnobs } from "@storybook/addon-knobs";

// automatically import all files ending in *.stories.ts/tsx
const req = require.context("../stories", true, /.stories.tsx?$/);

addDecorator(checkA11y);
addDecorator(withKnobs);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
