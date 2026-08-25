import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PublicLayout from "../layout";

describe("PublicLayout", () => {
  it("provides the responsive public content container", () => {
    const markup = renderToStaticMarkup(
      <PublicLayout>
        <p>Page content</p>
      </PublicLayout>
    );

    expect(markup).toContain("Page content");
    expect(markup).toContain("max-w-6xl");
    expect(markup).not.toContain("Primary navigation");
  });
});
