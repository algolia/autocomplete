export function checkIsReleaseReady() {
  if (process.env.NODE_ENV === 'production' && !process.env.VERSION) {
    throw new Error(
      `You need to specify a valid semver environment variable 'VERSION' to run the build process (received: ${JSON.stringify(
        process.env.VERSION
      )}).`
    );
  }
}
