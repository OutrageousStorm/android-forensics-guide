# Dynamic Analysis with Frida

Runtime analysis of Android apps using Frida instrumentation.

---

## Setup

```bash
# Install Frida tools on PC
pip install frida-tools objection

# Download frida-server for your device architecture
# https://github.com/frida/frida/releases
# Choose: frida-server-XX.X.X-android-arm64.xz (for 64-bit ARM)

# Push to device (rooted)
adb push frida-server /data/local/tmp/
adb shell chmod 755 /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &

# Verify connection
frida-ps -U   # list running processes
```

---

## Basic Frida usage

```bash
# Attach to running app
frida -U -n "com.example.app" -l script.js

# Spawn app with script
frida -U -f com.example.app -l script.js --no-pause

# List all running apps
frida-ps -Ua
```

---

## Useful Frida scripts

### Bypass root detection
```javascript
Java.perform(function() {
    // Hook RootBeer
    var RootBeer = Java.use("com.scottyab.rootbeer.RootBeer");
    RootBeer.isRooted.overload().implementation = function() {
        console.log("[+] isRooted() called — returning false");
        return false;
    };
    
    // Hook common file checks
    var File = Java.use("java.io.File");
    File.exists.implementation = function() {
        var name = this.getAbsolutePath();
        if (name.indexOf("su") !== -1 || name.indexOf("magisk") !== -1) {
            console.log("[+] Hiding: " + name);
            return false;
        }
        return this.exists.call(this);
    };
});
```

### Bypass SSL pinning
```javascript
Java.perform(function() {
    // Bypass OkHttp certificate pinner
    try {
        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check.overload("java.lang.String", "java.util.List")
            .implementation = function() {
                console.log("[+] SSL pinning bypassed (OkHttp)");
            };
    } catch(e) {}
    
    // Bypass TrustManager
    var TrustManagerImpl = Java.use("com.android.org.conscrypt.TrustManagerImpl");
    TrustManagerImpl.verifyChain.implementation = function() {
        console.log("[+] SSL pinning bypassed (TrustManagerImpl)");
        return this.verifyChain.apply(this, arguments);
    };
});
```

### Log all HTTP requests
```javascript
Java.perform(function() {
    var URL = Java.use("java.net.URL");
    URL.openConnection.overload().implementation = function() {
        console.log("[HTTP] " + this.toString());
        return this.openConnection();
    };
});
```

### Dump all strings from an activity
```javascript
Java.perform(function() {
    Java.choose("com.example.app.MainActivity", {
        onMatch: function(instance) {
            console.log("[+] Found instance: " + instance);
            // enumerate fields
            var fields = instance.class.getDeclaredFields();
            fields.forEach(function(f) {
                f.setAccessible(true);
                console.log("  " + f.getName() + " = " + f.get(instance));
            });
        },
        onComplete: function() {}
    });
});
```

---

## Objection (Frida wrapper)

Objection makes common tasks easier:

```bash
# Attach to app
objection -g com.example.app explore

# Inside objection shell:
android hooking list classes              # list all classes
android hooking list class_methods com.example.LoginActivity
android hooking watch class_method com.example.LoginActivity.login
android sslpinning disable               # bypass SSL pinning
android root disable                     # bypass root detection
memory list modules                      # loaded native libs
memory search --string "password"        # search memory
```
