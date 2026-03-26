# 🔬 Android Forensics & Reverse Engineering

Tools and techniques for analyzing Android apps and devices. Educational resource.

---

## Topics

| File | Contents |
|------|----------|
| [APK Analysis](docs/apk-analysis.md) | Decompile, deobfuscate, analyze APKs |
| [Dynamic Analysis](docs/dynamic-analysis.md) | Frida, Objection, runtime hooking |
| [Network Traffic](docs/network-traffic.md) | Intercept HTTPS, bypass certificate pinning |
| [Logcat & Debugging](docs/logcat.md) | Extract useful data from device logs |
| [Memory Analysis](docs/memory.md) | Dump and analyze process memory |

---

## Quick start toolkit

```bash
# Install core tools (Linux/Mac)
pip install frida-tools objection apkleaks
brew install jadx apktool

# Or via package manager
sudo apt install apktool aapt adb
```

---

## Essential tools

| Tool | Purpose | Link |
|------|---------|-------|
| **jadx** | Decompile APK to readable Java | https://github.com/skylot/jadx |
| **apktool** | Disassemble/reassemble APKs (Smali) | https://apktool.org |
| **Frida** | Dynamic instrumentation framework | https://frida.re |
| **Objection** | Frida-based runtime exploration | https://github.com/sensepost/objection |
| **MobSF** | Automated mobile app security testing | https://github.com/MobSF/Mobile-Security-Framework-MobSF |
| **APKLeaks** | Find secrets/endpoints in APKs | https://github.com/dwisiswant0/apkleaks |
| **Burp Suite** | HTTP proxy / MITM | https://portswigger.net/burp |
| **Wireshark** | Network traffic analysis | https://wireshark.org |
| **PCAPdroid** | On-device traffic capture (no root) | https://github.com/emanuele-f/PCAPdroid |

---

> ⚠️ Only analyze apps you own or have explicit permission to test.

*Maintained by [OutrageousStorm](https://github.com/OutrageousStorm)*
