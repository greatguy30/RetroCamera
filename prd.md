Act as an expert React Native developer. Create a retro-style camera application using **Expo**.

### Core Requirements:
1. **Tech Stack**: Use `expo-camera` for camera functionality and `expo-font` for custom typography.
2. **Visual Aesthetic**: 
   - Apply a "Retro/Vintage" aesthetic (Skeuomorphic or warm-toned flat design).
   - Use a color palette of off-white (#F4F1EA), faded blacks, and warm sepia tones.
   - All UI elements (buttons, labels) should look like physical camera parts or paper scraps.
3. **Typography**: 
   - Integrate a "Handwritten" style font from Google Fonts (e.g., 'Permanent Marker' or 'Indie Flower') via `@expo-google-fonts`.
   - Ensure EVERY text element in the app uses this font.
4. **The Polaroid Card (Crucial)**: 
   - After capturing a photo, generate a Polaroid-style card.
   - **Aspect Ratio**: The image container inside the card must strictly be **3:4 (Portrait)**.
   - **Card Layout**: The image should have a thick white border, with a larger margin at the bottom for "handwritten" captions/dates, mimicking a real Polaroid 600 film.
   - Use `Shadow` and slight `Rotation` (randomized +/- 2 degrees) for a physical look.

### Features to implement:
- **Viewfinder Screen**: A retro-styled camera interface with a circular shutter button.
- **Capture Logic**: Take a photo and pass it to a preview state.
- **Preview Screen**: Display the captured photo inside the 3:4 Polaroid card. 
- **Filter Overlay**: Add a subtle grain or vignette overlay to the camera preview and the final image to enhance the retro feel.

### Code Style:
- Use Functional Components with Hooks.
- Ensure the layout is responsive and handles different screen sizes.
- Keep the code clean and well-commented.