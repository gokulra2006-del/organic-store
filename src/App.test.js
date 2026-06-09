import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

test("renders the admin dashboard at /admin", () => {
  const html = renderToStaticMarkup(
    <StaticRouter location="/admin">
      <App />
    </StaticRouter>
  );

  expect(html).toContain("Good morning, Admin.");
  expect(html).toContain("Product Management");
  expect(html).toContain("10-Minute Order Queue");
});
