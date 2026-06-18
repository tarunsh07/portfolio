/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "pixel-canvas": import("react").DetailedHTMLProps<
      import("react").HTMLAttributes<HTMLElement> & {
        "data-gap"?: number
        "data-speed"?: number
        "data-colors"?: string
        "data-variant"?: string
        "data-no-focus"?: string
      },
      HTMLElement
    >
  }
}
