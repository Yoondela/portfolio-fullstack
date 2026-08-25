import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ContactPage from "../page";

describe("ContactPage", () => {
  it("renders contact details and the Formspree submission fields", () => {
    const markup = renderToStaticMarkup(<ContactPage />);

    expect(markup).toContain("Let&#x27;s make something considered.");
    expect(markup).toContain('href="mailto:yondela08@outlook.com"');
    expect(markup).toContain("yondela08@outlook.com");
    expect(markup).toContain('href="tel:+27799594434"');
    expect(markup).toContain("079 959 4434");
    expect(markup).toContain("GitHub");
    expect(markup).toContain("LinkedIn");
    expect(markup).toContain("Details coming soon.");
    expect(markup).toContain("Send a message");
    expect(markup).toContain('action="https://formspree.io/f/maewrqrw"');
    expect(markup).toContain('method="post"');
    expect(markup).toContain('name="email"');
    expect(markup).toContain('name="subject"');
    expect(markup).toContain('name="message"');
    expect(markup).toContain("Send message");
  });
});
