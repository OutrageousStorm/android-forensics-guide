# Intercepting Android Network Traffic

How to capture and analyze HTTPS traffic from Android apps.

---

## Method 1: Burp Suite + Device Proxy

### Setup
```
1. PC and Android device on same Wi-Fi network
2. Start Burp Suite → Proxy → Listeners → add listener on 0.0.0.0:8080
3. On Android: Wi-Fi settings → long press network → Modify → Proxy → Manual
   Host: <PC IP>, Port: 8080
4. Export Burp CA cert: Proxy → Options → Export CA Certificate (DER)
5. Install on Android: Settings → Security → Install certificate
```

### Android 7+ user cert restriction
Android 7 (Nougat) stopped trusting user-installed CAs for apps. Workarounds:

```bash
# Option A: Push cert to system store (requires root)
adb push burp-cert.der /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/burp-cert.der

# Option B: Patch app's network_security_config via apktool
# Add to res/xml/network_security_config.xml:
# <trust-anchors>
#   <certificates src="user"/>
# </trust-anchors>
```

---

## Method 2: PCAPdroid (no root, no proxy)

PCAPdroid captures traffic at the VPN layer without a proxy:

```bash
# Install from F-Droid or Play Store
# Enable "Root capture" for raw packet capture (root) or VPN mode (no root)
# Filter by app, export as PCAP
# Open in Wireshark on PC
```

---

## Method 3: tcpdump on device

```bash
# With root
adb shell su -c "tcpdump -i any -w /sdcard/capture.pcap"
adb pull /sdcard/capture.pcap
# Open in Wireshark

# Filter in Wireshark:
# http — all HTTP
# ssl  — all TLS
# dns  — DNS queries only
# ip.addr == 8.8.8.8 — traffic to specific IP
```

---

## Certificate Pinning Bypass

Apps that implement certificate pinning reject your proxy cert. Bypass methods:

### Frida (easiest for rooted)
```bash
objection -g com.example.app explore
# android sslpinning disable
```

### apk-mitm (no root, patches APK)
```bash
npm install -g apk-mitm
apk-mitm target.apk
# Installs patched APK that trusts user CAs
adb install target-patched.apk
```

### Magisk TrustUserCerts module
Automatically moves all user certs to system store:
- Install from Magisk repo or GitHub
- Reboot
- All user-installed certs now trusted system-wide
