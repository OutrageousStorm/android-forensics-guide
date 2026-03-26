# APK Static Analysis

How to decompile and analyze an Android APK without running it.

---

## 1. Extract the APK

```bash
# From a connected device
adb shell pm path com.example.app
# output: package:/data/app/com.example.app-xxx/base.apk
adb pull /data/app/com.example.app-xxx/base.apk ./target.apk

# From Play Store (use Aurora Store → download APK option)
```

---

## 2. Basic info

```bash
# View manifest, permissions, activities
aapt dump badging target.apk
aapt dump permissions target.apk
aapt dump xmltree target.apk AndroidManifest.xml

# Or with apktool
apktool d target.apk -o output/
cat output/AndroidManifest.xml
```

---

## 3. Decompile to Java with jadx

```bash
# CLI
jadx target.apk -d jadx-output/

# GUI (recommended for navigation)
jadx-gui target.apk
```

jadx converts Dalvik bytecode → Java source. Not perfect but very readable.

Key things to look for:
- **API keys / secrets** hardcoded in source
- **URLs and endpoints** — search for `http`, `https`, `api`
- **Crypto usage** — search for `AES`, `RSA`, `SecretKey`
- **Root/emulator detection** logic
- **Certificate pinning** — search for `TrustManager`, `X509TrustManager`, `SSLContext`

---

## 4. Find secrets with APKLeaks

```bash
apkleaks -f target.apk
# Automatically searches for:
# - AWS keys, Google API keys, Firebase URLs
# - Stripe keys, Twilio, SendGrid
# - Private IPs, hardcoded credentials
```

---

## 5. Smali analysis with apktool

Smali is the assembly language of Android (Dalvik bytecode):

```bash
apktool d target.apk -o smali-output/
# Edit Smali files to patch behavior
apktool b smali-output/ -o patched.apk
# Sign the patched APK
apksigner sign --ks debug.keystore --out signed.apk patched.apk
```

Common Smali patches:
- Bypass root detection: find `isRooted()` and make it return `false`
- Bypass SSL pinning: find `checkServerTrusted()` and make it return `void`
- Remove ads: find ad SDK initialization and comment it out

---

## 6. Analyze with MobSF

MobSF (Mobile Security Framework) automates most static analysis:

```bash
# Run with Docker
docker pull opensecurity/mobile-security-framework-mobsf
docker run -it -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest

# Open http://localhost:8000, upload APK
# Get: permissions, hardcoded secrets, network calls, certificate info, CVSS score
```
