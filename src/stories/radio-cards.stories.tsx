import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCards } from "../components/fields";
const meta = {
  title: "Forms/Radio cards",
  component: RadioCards,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioCards>;
export default meta;
export const Default: StoryObj<typeof RadioCards> = {
  render: () => {
    const [value, setValue] = useState("webp");
    return (
      <div className="max-w-xl">
        <RadioCards
          label="Image format"
          value={value}
          onValueChange={setValue}
          options={[
            {
              value: "webp",
              label: "WebP",
              description: "Smaller files for web delivery.",
            },
            {
              value: "png",
              label: "PNG",
              description: "Lossless files with transparency.",
            },
          ]}
        />
      </div>
    );
  },
};
