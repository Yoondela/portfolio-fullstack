import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PublicLayout from "../layout";

describe("PublicLayout", () => {
  it("provides public navigation, a responsive content shell, and a footer", () => {
    const markup = renderToStaticMarkup(
      <PublicLayout>
        <p>Page content</p>
      </PublicLayout>
    );

    expect(markup).toContain("Page content");
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/engineering"');
    expect(markup).toContain('href="/contact"');
    expect(markup).toContain("Selected engineering work.");
  });
});
