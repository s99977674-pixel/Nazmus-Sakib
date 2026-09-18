import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Copy,
  Terminal,
  FolderTree,
  FileCode,
  Download,
  Info,
} from 'lucide-react';

interface AndroidAppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppInfoModal: React.FC<AndroidAppInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const buildCommands = `# 1. Build the modern web assets
npm run build

# 2. Sync to Android project
# (Or open the /android directory in Android Studio)
cd android

# 3. Compile Debug or Release APK
./gradlew assembleDebug
# OR for release APK:
./gradlew assembleRelease`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Android APK Compilation & Project Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nazmus Sakib | Investment Calculator • Package ID: <code className="font-mono text-emerald-600 dark:text-emerald-400">com.nazmussakib.investmentcalculator</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* Direct Download Android Project ZIP Banner */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Complete Android Studio Project (.ZIP)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to compile in Android Studio or AndroidIDE with pre-bundled offline assets & icons.
                </p>
              </div>
            </div>
            <a
              href="/android-investment-calculator-project.zip"
              download="Nazmus_Sakib_Investment_Calculator_Android_Project.zip"
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-center flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Project ZIP</span>
            </a>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Application Name
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Nazmus Sakib | Investment Calculator
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Package / Application ID
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                com.nazmussakib.investmentcalculator
              </span>
            </div>
          </div>

          {/* Environmental Notice */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Environment Note:</strong> The cloud runtime container provides the web execution layer, but does not host the multi-gigabyte proprietary Google Android SDK Platform tools (API 34/Android 14) and Android build licenses needed to output a final binary <code className="font-mono text-emerald-600 dark:text-emerald-400">.apk</code> file server-side. Therefore, the complete source project above has been pre-packaged with all Kotlin activity files, offline bundled assets, and launcher mipmaps so you can compile it immediately in Android Studio or AndroidIDE in under 60 seconds.
            </div>
          </div>

          {/* Section 1: Project Structure */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <FolderTree className="w-4 h-4 text-emerald-500" />
              <span>1. Android Project Structure</span>
            </h4>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`android/
├── build.gradle                  (Project build script)
├── settings.gradle               (Includes ':app')
├── gradle.properties             (JVM & AndroidX flags)
├── gradle/wrapper/               (Gradle 8.2+ wrapper)
└── app/
    ├── build.gradle              (Target SDK 34, Min SDK 24, app ID)
    └── src/main/
        ├── AndroidManifest.xml   (Permissions, theme, icons)
        ├── java/com/nazmussakib/investmentcalculator/
        │   └── MainActivity.kt   (Native Android WebView, PDF print/download)
        └── res/
            ├── drawable/logo.png (Custom Logo asset)
            ├── mipmap-*/         (Launcher icons)
            └── values/
                ├── strings.xml   (App title & Bengali/English disclaimers)
                ├── colors.xml    (Finance Emerald & Slate palette)
                └── styles.xml    (Edge-to-edge status bar & splash theme)`}</pre>
            </div>
          </div>

          {/* Section 2: How to Build the APK */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>2. How to Build the APK</span>
              </h4>
              <button
                onClick={() => copyToClipboard(buildCommands, 'build-cmd')}
                className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {copiedSection === 'build-cmd' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{buildCommands}</pre>
            </div>
          </div>

          {/* Section 3: APK Output Location */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>3. Where the APK Output is Located</span>
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 font-mono text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                • <strong>Debug APK:</strong> <code className="text-emerald-600 dark:text-emerald-400">android/app/build/outputs/apk/debug/app-debug.apk</code>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                • <strong>Release APK:</strong> <code className="text-emerald-600 dark:text-emerald-400">android/app/build/outputs/apk/release/app-release-unsigned.apk</code>
              </p>
            </div>
          </div>

          {/* Section 4: Installation */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>4. Installing on an Android Device</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
              <li>
                <strong>Via USB/ADB:</strong> Run <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">adb install app-debug.apk</code>
              </li>
              <li>
                <strong>Direct Phone Transfer:</strong> Transfer the <code className="font-mono">.apk</code> file to your Android device storage via USB, Google Drive, or WhatsApp, tap the APK in your file manager, and tap <em>Install</em> (allow "Install unknown apps" if prompted).
              </li>
            </ol>
          </div>

          {/* Section 5: Customizing Logo & Name */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>5. Uploading / Replacing App Icon & Logo</span>
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <p>
                <strong>Method A (In-App Live Upload):</strong> Tap the <em>Change Icon</em> button or the camera overlay icon on the top header logo to upload your custom PNG or JPG image directly from your phone or PC. It updates instantly in the header, splash screen, and PDF watermark!
              </p>
              <p>
                <strong>Method B (Android Project Source Asset):</strong> Replace the placeholder files with your custom 512x512 PNG/JPG image at:
                <br />
                • <code className="font-mono text-emerald-600 dark:text-emerald-400">android/app/src/main/res/drawable/app_logo.png</code>
                <br />
                • <code className="font-mono text-emerald-600 dark:text-emerald-400">android/app/src/main/res/drawable/logo.png</code>
                <br />
                • <code className="font-mono text-emerald-600 dark:text-emerald-400">public/YOUR_APP_ICON_HERE.png</code>
                <br />
                • <code className="font-mono text-emerald-600 dark:text-emerald-400">android/app/src/main/res/mipmap-*/ic_launcher.png</code>
              </p>
              <p>
                <strong>To change the app name:</strong> Update the <code className="font-mono text-emerald-600 dark:text-emerald-400">&lt;string name="app_name"&gt;</code> in <code className="font-mono">android/app/src/main/res/values/strings.xml</code> and <code className="font-mono">index.html</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
