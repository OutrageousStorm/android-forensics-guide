// Common Objection (Frida wrapper) helper commands
// Usage in objection shell: help
// These extend objection's built-in commands

// Show all loaded classes in an app
show loaded-classes() {
    Java.perform(function() {
        var cl = Java.enumerateLoadedClasses();
        console.log("[+] Loaded classes: " + cl.length);
        cl.slice(0, 50).forEach(function(c) { console.log("  " + c); });
        console.log("  ... (showing first 50 of " + cl.length + ")");
    });
}

// Find all string constants in a class
search-strings(className) {
    Java.perform(function() {
        var cls = Java.use(className);
        var fields = cls.class.getDeclaredFields();
        fields.forEach(function(f) {
            f.setAccessible(true);
            try {
                var val = f.get(null);
                if (typeof val === 'string') {
                    console.log("[+] " + f.getName() + " = " + val);
                }
            } catch(e) {}
        });
    });
}

// Trace all calls to a method
trace-method(className, methodName) {
    Java.perform(function() {
        var cls = Java.use(className);
        var m = cls[methodName];
        m.implementation = function() {
            console.log("[TRACE] " + className + "." + methodName + " called");
            console.log("  Args: " + Array.prototype.slice.call(arguments).toString());
            return m.apply(this, arguments);
        };
    });
}

// Dump all methods on a class
list-methods(className) {
    Java.perform(function() {
        var cls = Java.use(className);
        var methods = cls.class.getDeclaredMethods();
        console.log("[+] Methods on " + className + ":");
        methods.forEach(function(m) {
            console.log("  " + m.getName() + "(" + m.getReturnType() + ")");
        });
    });
}
