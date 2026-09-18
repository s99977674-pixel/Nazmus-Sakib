# Nazmus Sakib | Investment Calculator — Android App & APK Build Documentation

**Application Name:** `Nazmus Sakib | Investment Calculator`  
**Package / Application ID:** `com.nazmussakib.investmentcalculator`  
**Target Platform:** Android (API Level 24+ / Android 7.0 to Android 15+)  
**Technology Stack:** React 19 + TypeScript + Tailwind CSS + Kotlin Android Native Wrapper  

---

## 1. Project Structure

```
├── android/                                          # Complete Android Studio Gradle Project
│   ├── build.gradle                                  # Root Gradle build configuration
│   ├── settings.gradle                               # Project settings with ':app' module
│   ├── gradle.properties                             # AndroidX and JVM options
│   ├── gradlew                                       # Gradle wrapper script (Linux/macOS)
│   ├── gradle/wrapper/gradle-wrapper.properties      # Gradle 8.2 distribution
│   └── app/
│       ├── build.gradle                              # App module build configuration (SDK 34)
│       └── src/main/
│           ├── AndroidManifest.xml                   # Android manifest (ID, icons, permissions)
│           ├── java/com/nazmussakib/investmentcalculator/
│           │   └── MainActivity.kt                   # Native Android Activity (WebView, PDF & Print)
│           └── res/
│               ├── drawable/logo.png                 # App icon & branding asset
│               └── values/
│                   ├── strings.xml                   # App title, Bengali & English disclaimers
│                   ├── colors.xml                    # Emerald & Slate theme palette
│                   └── styles.xml                    # Splash & Edge-to-Edge window themes
│
├── public/
│   ├── logo.png                                      # Official high-resolution brand logo
│   ├── manifest.json                                 # Web App Manifest for Android PWA install
│   └── sw.js                                         # Offline service worker cache
│
├── src/
│   ├── components/
│   │   ├── Header.tsx                                # Header with branding, dark mode & reset
│   │   ├── CalculatorCard.tsx                        # Capital, rate, days & currency inputs
│   │   ├── CurrencyModal.tsx                         # ISO 4217 searchable currency selector
│   │   ├── ResultsDashboard.tsx                      # Summary cards, ROI %, and PDF export
│   │   ├── DailyBreakdown.tsx                        # Day-by-day compound progression table
│   │   ├── DisclaimerCard.tsx                        # Dual-language (Bengali + English) disclaimer
│   │   ├── SplashScreen.tsx                          # Native Android launch splash animation
│   │   └── AndroidAppInfoModal.tsx                   # In-app APK build & help guide
│   ├── data/
│   │   └── currencies.ts                             # Comprehensive ISO 4217 currency dataset
│   ├── utils/
│   │   ├── calculator.ts                             # Mathematical daily compound engine & validation
│   │   └── pdfGenerator.ts                           # Offline PDF generator with watermark & disclaimer
│   ├── types.ts                                      # TypeScript data interfaces
│   ├── App.tsx                                       # Main application controller
│   ├── index.css                                     # Global Tailwind styles
│   └── main.tsx                                      # App bootstrap entry
│
├── index.html                                        # HTML5 entry with mobile meta tags
├── package.json                                      # Project dependencies and build scripts
└── metadata.json                                     # Application metadata
```

---

## 2. How to Build the APK

### Method A: Using Android Studio (Recommended & Easiest)
1. Open **Android Studio**.
2. Click **Open** (or *File > Open*) and navigate to the `android/` directory inside this project.
3. Allow Gradle to sync dependencies automatically.
4. From the top menu, select:  
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Android Studio will compile the APK. A notification will pop up in the lower-right corner with a **locate** link to open the folder containing the generated APK.

### Method B: Using the Command Line (Gradle)
Ensure you have the Android SDK and Java 17+ installed on your machine:
```bash
# 1. Compile the production web assets
npm run build

# 2. Copy the dist bundle into the Android assets directory
mkdir -p android/app/src/main/assets
cp -r dist/* android/app/src/main/assets/

# 3. Navigate into the android directory
cd android

# 4. Build the Debug APK:
./gradlew assembleDebug

# OR to build the unsigned Release APK:
./gradlew assembleRelease
```

---

## 3. Where the APK Output is Located

After running the build command, the compiled APK file will be located at:

* **Debug APK (for immediate testing):**  
  `android/app/build/outputs/apk/debug/app-debug.apk`

* **Release APK:**  
  `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 4. How to Install the APK on Android

### Option 1: Via ADB (USB Debugging)
1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Connect your phone to your computer via USB.
3. Run the following command in terminal:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 2: Direct File Transfer
1. Send `app-debug.apk` to your phone via USB cable, Google Drive, Telegram, or email.
2. Open the **Files** or **Downloads** app on your Android phone.
3. Tap on `app-debug.apk`.
4. If prompted with *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
5. Tap **Install**. The app will appear on your home screen and app drawer with the custom logo icon.

---

## 5. How to Replace the Logo

To replace the logo:
1. Prepare your new logo file in PNG format (square aspect ratio, recommended 512×512 or 1024×1024 px).
2. Replace:
   - `public/logo.png`
   - `android/app/src/main/res/drawable/logo.png`
3. Re-run `npm run build` and re-compile the APK. The splash screen, header, Android app icon, and PDF watermark will automatically reflect the new logo.

---

## 6. How to Change the App Name

If you wish to change the application title:
1. Open `android/app/src/main/res/values/strings.xml` and edit:
   ```xml
   <string name="app_name">Your Custom App Name</string>
   ```
2. Open `index.html` and update the `<title>` tag.
3. Open `public/manifest.json` and update the `"name"` and `"short_name"` fields.

---

## 7. Mathematical Calculation Engine

The calculator uses **Daily Compound Profit**:
$$\text{Daily Profit} = \text{Current Balance} \times \frac{\text{Daily Profit Percentage}}{100}$$
$$\text{Next Day Balance} = \text{Current Balance} + \text{Daily Profit}$$
$$\text{Total Profit} = \text{Final Balance} - \text{Initial Investment}$$

Calculations are computed locally on the device with no external API calls, ensuring instant response times, zero latency, and complete privacy.
