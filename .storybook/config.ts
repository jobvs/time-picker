import { withKnobs } from "@storybook/addon-knobs";
import { addDecorator, configure } from "@storybook/react";

// automatically import all files ending in *.stories.ts/tsx
const req = require.context("../stories", true, /.stories.tsx?$/);

addDecorator(withKnobs);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
