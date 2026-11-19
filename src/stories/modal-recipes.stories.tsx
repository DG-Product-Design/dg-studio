import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Modal } from "../components/overlays";
import {
  ModalHeroImage,
  ModalIconTextGroup,
} from "../components/marketplace-content";
import { Button } from "../components/ui/button";
import { assets } from "../examples/assets";
import storyExamples1 from "./modal-recipes.stories.tsx?examples";
function Example({ hero = false }: { hero?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal recipe</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={hero ? "Explore the collection" : "Collection prepared"}
        description="Reusable marketplace modal content."
        trigger={undefined}
      >
        {hero ? (
          <ModalHeroImage
            src={assets[0].src}
            alt={assets[0].alt}
            title="Find your next idea"
            action={
              <Button onClick={() => setOpen(false)}>Start browsing</Button>
            }
          >
            Explore images from your studio.
          </ModalHeroImage>
        ) : (
          <ModalIconTextGroup icon={<Check />} title="Ready to share">
            Your collection is ready for review.
          </ModalIconTextGroup>
        )}
      </Modal>
    </>
  );
}
const meta = {
  title: "Overlays/Modal recipes",
  component: Example,
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;
export default meta;
export const HeroImage: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: "tsx", type: "code" },
    },
  },
  args: { hero: true },
};
export const IconText: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: "tsx", type: "code" },
    },
  },
};
