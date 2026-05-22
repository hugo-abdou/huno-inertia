import type { InertiaRootViewProps } from "../../../src";

export const RootView = ({ id, page, title }: InertiaRootViewProps) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
    </head>
    <body>
      <div id={id} data-page={JSON.stringify(page)} />
    </body>
  </html>
);
