# MVP Production Release Checklist

Before launching the Land Clearance MVP to Google Play, ensure every item on this checklist is verified.

## 1. Firebase & Backend Security
- [ ] **Firestore Rules**: Verified that `listing_private` and `enquiries` are completely blocked from client access. Verified `status == 'active'` condition for public listings.
- [ ] **Storage Rules**: Verified that only `thumb_` prefix images are publicly readable, and original images are restricted.
- [ ] **App Check**: Enabled Play Integrity API in the Firebase Console for the production Android app.
- [ ] **Remote Config**: Configured basic feature flags (e.g., `is_marketplace_enabled`, `min_supported_version`).

## 2. Privacy & Data Handling
- [ ] **EXIF Stripping**: Tested that image uploads do not contain any GPS metadata.
- [ ] **WhatsApp Deep Linking**: Verified that the client cannot intercept the raw phone number before the Cloud Function validates access.
- [ ] **Analytics**: Verified that NO personally identifiable information (PII) is being logged to Firebase Analytics.

## 3. Resilience & Offline Performance
- [ ] **SQLite Queue**: Tested the upload queue with airplane mode. Verified it successfully transitions through `PENDING` -> `UPLOADING` -> `RETRYING` -> `COMPLETED` / `FAILED`.
- [ ] **Queue Resumption**: Verified the background queue resumes correctly upon app restart and network reconnection.
- [ ] **Crashlytics**: Verified that both fatal (app crashes) and non-fatal errors (e.g., SQLite corruption) appear in the Firebase Crashlytics dashboard.

## 4. App Distribution Preparation
- [ ] **ProGuard / R8**: Verified that ProGuard rules are configured in `android/app/build.gradle` (`minifyEnabled true`).
- [ ] **Release Signing**: Generated the upload keystore and configured the signing configuration in `build.gradle`.
- [ ] **AAB Generation**: Verified a successful build of the Android App Bundle (`./gradlew bundleRelease`).
- [ ] **Environment Separation**: Ensure the production `google-services.json` is securely placed and differs from the Staging/Dev environments.

## 5. Compliance
- [ ] **Privacy Policy**: Created and hosted a Privacy Policy explaining data collection and the usage of WhatsApp.
- [ ] **Terms of Service**: Created and hosted a TOS outlining the limits of liability for the marketplace.
- [ ] **Data Deletion**: Ensure users can request account and data deletion as per Play Store policy.
