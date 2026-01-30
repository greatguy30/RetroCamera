# RetroCamera

A retro‑styled camera app built with Expo/React Native. It blends skeuomorphic UI touches (glass panels, film grain, viewfinder corners) with Polaroid‑style photo captures.

## Highlights
- **Expo Camera** viewfinder with flip + zoom presets
- **Polaroid preview** with strict **3:4** image aspect ratio
- **Film grain overlay** and style presets (Polaroid, Leica, Hasselblad, Movie, Fuji, Normal)
- **Auto‑save** to a “RetroCam” album via Expo Media Library
- **Handwritten font** (Permanent Marker) applied globally
- **Theming** (dark/light + accent color presets)
- **i18n** support via i18next

## Tech Stack
- **Expo SDK 54**
- **React Native 0.81** / **React 19**
- `expo-camera`, `expo-image`, `expo-media-library`
- `expo-font` + `@expo-google-fonts/permanent-marker`
- `react-native-view-shot` for Polaroid capture

## Project Structure
```
app/                Expo Router entry
src/
  components/       UI primitives (GlassPanel, FilmOverlay, AppText, etc.)
  context/          App settings + theme context
  i18n/             Localization setup + strings
  screens/          Camera, Space, Profile screens
  theme/            Color tokens + presets
```

## Getting Started
```bash
# install dependencies
yarn

# run the app
expo start
```

### Platform targets
```bash
yarn android
yarn ios
yarn web
```

## Notes
- Photos saved from the preview are captured from the Polaroid card using **react-native-view-shot**.
- The viewfinder and Polaroid components live in `src/screens/CameraScreen.tsx`.

## License
MIT (if you plan to add one, update here).
