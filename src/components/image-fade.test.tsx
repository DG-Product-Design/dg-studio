import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageFade } from "./image-fade";

describe("ImageFade", () => {
  const props = {
    src: "/first.jpg",
    alt: "Desert sunset",
    width: 1200,
    height: 800,
  };
  it("reserves the aspect ratio and forwards load events", () => {
    const onLoad = vi.fn();
    render(<ImageFade {...props} onLoad={onLoad} />);
    const image = screen.getByRole("img");
    expect(image.parentElement).toHaveStyle({ aspectRatio: "1200/800" });
    expect(image.parentElement).toHaveAttribute("data-image-state", "loading");
    fireEvent.load(image);
    expect(image.parentElement).toHaveAttribute("data-image-state", "loaded");
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
  it("shows an accessible fallback and recovers when the source changes", () => {
    const onError = vi.fn();
    const { rerender } = render(<ImageFade {...props} onError={onError} />);
    fireEvent.error(screen.getByRole("img"));
    expect(
      screen.getByRole("img", { name: "Desert sunset. Image unavailable." }),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
    rerender(<ImageFade {...props} src="/second.jpg" />);
    expect(screen.queryByText("Image unavailable")).not.toBeInTheDocument();
    const next = screen.getByRole("img", { name: "Desert sunset" });
    expect(next.parentElement).toHaveAttribute("data-image-state", "loading");
    fireEvent.load(next);
    expect(next.parentElement).toHaveAttribute("data-image-state", "loaded");
  });
  it("reveals already-cached images without waiting for another load event", () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(
      true,
    );
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
      1200,
    );
    render(<ImageFade {...props} />);
    expect(screen.getByRole("img").parentElement).toHaveAttribute(
      "data-image-state",
      "loaded",
    );
  });
  it.each(["16 / 9", 1.5])(
    "uses an explicit container ratio %s without changing image dimensions",
    (aspectRatio) => {
      render(<ImageFade {...props} aspectRatio={aspectRatio} />);
      const image = screen.getByRole("img");
      expect(image.parentElement).toHaveStyle({
        aspectRatio: String(aspectRatio),
      });
      expect(image).toHaveAttribute("width", "1200");
      expect(image).toHaveAttribute("height", "800");
    },
  );
  it("contains the foreground and keeps the responsive blurred copy decorative", () => {
    const onLoad = vi.fn();
    const { container, rerender } = render(
      <ImageFade
        {...props}
        blurBg
        aspectRatio="16 / 9"
        srcSet="/first.jpg 1200w"
        sizes="50vw"
        onLoad={onLoad}
      />,
    );
    const foreground = screen.getByRole("img", { name: props.alt });
    const background = container.querySelector("[data-image-background]")!;
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(background).toHaveAttribute("alt", "");
    expect(background).toHaveAttribute("aria-hidden", "true");
    expect(background).toHaveAttribute("srcSet", "/first.jpg 1200w");
    expect(background).toHaveAttribute("sizes", "50vw");
    expect(foreground).toHaveClass("object-contain");
    expect(background).toHaveClass("opacity-0");
    fireEvent.load(background);
    expect(onLoad).not.toHaveBeenCalled();
    fireEvent.load(foreground);
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(background).toHaveClass("opacity-100");
    rerender(<ImageFade {...props} blurBg={false} />);
    expect(container.querySelector("[data-image-background]")).toBeNull();
    expect(screen.getByRole("img")).toHaveClass("object-cover");
  });
  it("resets both layers on source changes and removes the blurred layer on error", () => {
    const { container, rerender } = render(<ImageFade {...props} blurBg />);
    fireEvent.load(screen.getByRole("img"));
    rerender(<ImageFade {...props} src="/second.jpg" blurBg />);
    const background = container.querySelector("[data-image-background]")!;
    expect(background).toHaveAttribute("src", "/second.jpg");
    expect(background).toHaveClass("opacity-0");
    fireEvent.error(screen.getByRole("img"));
    expect(container.querySelector("[data-image-background]")).toBeNull();
    expect(
      screen.getByRole("img", { name: `${props.alt}. Image unavailable.` }),
    ).toBeInTheDocument();
  });
});
