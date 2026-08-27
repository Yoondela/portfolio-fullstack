# ADR-007: Formspree for Contact-Form Delivery

## Status

Accepted (implemented)

## Context

The public contact page needs to send visitor messages to the portfolio owner
without operating an application mail server or storing messages in PostgreSQL.
The form accepts a sender email address, subject, and message. It must remain small, work on the
deployed Next.js application, and avoid introducing a server-side email API key.

## Decision

Use Formspree's hosted form endpoint for contact-form delivery.

- The browser will submit the form directly to the Formspree endpoint configured
  through `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- The endpoint is public by design. It is not a secret and must be defined in
  one place in the application rather than copied across components.
- Formspree will relay submissions to `yondela08@outlook.com`; its recipient
  verification and notification settings remain managed in Formspree.
- The application will not store contact messages in PostgreSQL and will not
  introduce a server-side email provider, API key, or Server Action for this
  form.
- The user interface will validate required sender email address, subject, and
  message fields and
  provide accessible submission feedback. It must not claim delivery succeeded
  unless Formspree confirms it.
- The free plan's 50 submissions per month and 30-day submission history are
  sufficient for the expected low-volume portfolio use case.

## Alternatives considered

### Web3Forms

Web3Forms offers a higher free submission allowance, but its free tier does not
provide domain restriction or advanced spam protection. Formspree is preferred
for this small, direct email-notification workflow.

### Basin

Basin has a comparable free tier, but Formspree better fits the project's
minimal native-form integration and notification requirement.

### Resend through a Next.js Server Action

Resend would provide greater delivery control, but it requires a server-side
API key and sending-domain configuration. That adds backend and operational
responsibility that is not justified for this form.

## Consequences

- Contact-message data is processed and retained by Formspree, so its privacy
  terms and data-processing practices must be reviewed before production
  release.
- The browser will make a cross-origin request to Formspree. The integration
  must handle network and provider errors without losing the visitor's message.
- The public endpoint can receive unwanted traffic. Monitor usage and revisit
  the provider or add stronger spam controls if the free-tier limit or spam
  becomes a concern.
- If custom delivery rules, message persistence, or higher volume become
  requirements, reconsider a server-side provider such as Resend in a new ADR.

## References

- [Formspree account limits](https://help.formspree.io/articles/account-management/account-limits)
- [Formspree documentation](https://formspree.io/)
- [Web3Forms free-tier comparison](https://web3forms.com/alternatives/formbackend-alternative)
- [Resend pricing](https://resend.com/pricing?product=marketing)

*Recorded:* 2026-08-25
*Author:* Architect / team
