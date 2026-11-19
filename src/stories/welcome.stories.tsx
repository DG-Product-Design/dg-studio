import type { Meta, StoryObj } from '@storybook/react-vite';
import { Welcome } from '../examples/welcome';
import storyExamples1 from '../examples/welcome.tsx?examples';

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Welcome>;

export default meta;

export const StartHere: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Welcome, language: 'tsx', type: 'code' },
    },
  },
};
//   play: async ({ canvas, userEvent, step }) => {
//     await step("Roll the total", async () => {
//       await userEvent.click(
//         canvas.getByRole("button", { name: "Update total" }),
//       );
//       await expect(
//         canvas.getByText("$2,895.75", { exact: true }),
//       ).toBeVisible();
//     });
//     await step("Change the artwork", async () => {
//       const image = canvas.getByRole("img", {
//         name: /Midnight|floral|botanical/i,
//       });
//       const source = image.getAttribute("src");
//       await userEvent.click(
//         canvas.getByRole("button", { name: "Change artwork" }),
//       );
//       await waitFor(() =>
//         expect(
//           canvas
//             .getByRole("img", {
//               name: "A striped neon sun above a pink and cyan wireframe landscape.",
//             })
//             .getAttribute("src"),
//         ).not.toBe(source),
//       );
//     });
//     await step("Play the original illustration", async () => {
//       await userEvent.click(
//         canvas.getByRole("button", { name: "Play illustration" }),
//       );
//       await waitFor(() =>
//         expect(
//           canvas
//             .getByRole("img", { name: "Cart animation" })
//             .querySelector("svg"),
//         ).toBeInTheDocument(),
//       );
//       const firstPlayback = canvas
//         .getByRole("img", { name: "Cart animation" })
//         .querySelector("svg");
//       await userEvent.click(
//         canvas.getByRole("button", { name: "Play illustration" }),
//       );
//       await waitFor(() => {
//         const replayed = canvas
//           .getByRole("img", { name: "Cart animation" })
//           .querySelector("svg");
//         expect(replayed).toBeInTheDocument();
//         expect(replayed).not.toBe(firstPlayback);
//       });
//     });
//   },
// };
