const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-splash-screen',
  'android',
  'build.gradle'
);

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix deprecated proguard file for modern Android Gradle Plugin
  content = content.replace(
    "getDefaultProguardFile('proguard-android.txt')",
    "getDefaultProguardFile('proguard-android-optimize.txt')"
  );

  // 2. Fix legacy support library to prevent duplicate class conflicts with AndroidX
  content = content.replace(
    'implementation "com.android.support:appcompat-v7:$supportLibVersion"',
    'implementation "androidx.appcompat:appcompat:1.6.1"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[AIOS] Successfully patched react-native-splash-screen');
}
