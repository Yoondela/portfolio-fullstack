/** Identifies failures while checking that a screenshot object exists in Storage. */
export class ScreenshotStorageVerificationError extends Error {
  constructor(message = "Screenshot storage object could not be verified.") {
    super(message);
    this.name = "ScreenshotStorageVerificationError";
  }
}
