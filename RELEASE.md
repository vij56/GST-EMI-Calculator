# Android Release and Deployment

## 1) One-time setup

1. Install EAS CLI:
   npm install -g eas-cli
2. Login:
   eas login
3. Configure Android credentials when prompted on first build:
   eas build --platform android --profile production
4. Prepare Play Console service account JSON and set it in EAS/CI.

## 2) Local build commands

- APK for internal testing:
  npm run build:android:apk
- AAB for Play Store:
  npm run build:android:aab
- Submit latest AAB to Play Internal track:
  npm run submit:android

## 3) CI/CD secrets (GitHub)

Add repository secrets:

- EXPO_TOKEN: token from Expo account settings
- GOOGLE_SERVICE_ACCOUNT_KEY: full JSON for Play service account

## 4) Pipeline behavior

Workflow file: .github/workflows/android-release.yml

- Triggers on main branch push or manual dispatch
- Builds production Android AAB with EAS
- Submits build to Google Play Internal testing track

## 5) Before production rollout

1. Increase app version in app.json
2. Verify Android package name remains stable
3. Test APK on emulator and physical device
4. Promote internal track build to closed/open/production in Play Console
