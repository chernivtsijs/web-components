(function()
{
    "use strict"

    if ("customElements" in window) return

    function CustomElementRegistry()
    {
        throw new TypeError
    }

    Object.defineProperty(window, "CustomElementRegistry",
    {
        value: CustomElementRegistry,
        writable: true,
        configurable: true,
    })

    Object.assign(CustomElementRegistry.prototype,
    {
        define,
        get,
        whenDefined,
    })

    Object.defineProperty(CustomElementRegistry.prototype, Symbol.toStringTag,
    {
        value: "CustomElementRegistry",
        configurable: true,
    })

    function assertContext(context)
    {
        if (context != customElements) throw new TypeError
    }

    function cb(value)
    {
        switch (typeof value)
        {
            case "undefined": return function() {}
            case "function": return value
        }

        throw new TypeError
    }

    function defer()
    {
        var result = {}

        result.promise = new Promise(function(resolve)
        {
            result.resolve = resolve
        })

        return result
    }

    function upgrade(entry, is)
    {
        function process(el)
        {
            Object.setPrototypeOf(el, entry.fn.prototype)

            entry.connect.call(el)

            var attrs = entry.attrs
            if (!attrs) return

            attrs.forEach(function(attr)
            {
                var value = el.getAttribute(attr)
                if (value == null) return

                entry.attrChange.call(el, attr, null, value)
            })

            new MutationObserver(function(records)
            {
                records.forEach(function(record)
                {
                    var attr = record.attributeName
                    var old = record.oldValue
                    var value = el.getAttribute(attr)

                    entry.attrChange.call(el, attr, old, value)
                })
            })
            .observe(el,
            {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: attrs,
            })
        }

        new MutationObserver(function(records)
        {
            records.forEach(function(record)
            {
                record.addedNodes.forEach(function(added)
                {
                    if (!(added instanceof Element)) return
                    if (added.matches(is)) process(added)
                    added.querySelectorAll(is).forEach(process)
                })
            })
        })
        .observe(document.documentElement,
        {
            childList: true,
            subtree: true,
        })
    }

    function define(name, fn, options)
    {
        if (arguments.length < 2) throw new TypeError
        if (!isConstructor(fn)) throw new TypeError

        var selector = name = `${name}`

        if (!isValidTag(name))
            throw new DOMException("SyntaxError")

        if (name in registry || hasConstructor(fn))
            throw new DOMException("NotSupportedError")

        if (options && options.extends != null)
        {
            var parentTag = `${options.extends}`

            if (isUnknown(parentTag))
                throw new DOMException("NotSupportedError") 

            selector = `${parentTag}[is=${name}]`
        }

        if (defIsRunning)
            throw new DOMException("NotSupportedError")

        defIsRunning = true

        var entry = { fn }

        try
        {
            var proto = fn.prototype
            if (proto !== Object(proto)) throw new TypeError

            Object.assign(entry,
            {
                connect: cb(proto.connectedCallback),
                disconnect: cb(proto.disconnectedCallback),
                adopt: cb(proto.adoptedCallback),
                attrChange: cb(proto.attributeChangedCallback),
            })

            var attrs = fn.observedAttributes
            if (attrs !== undefined)
            {
                entry.attrs = Array.from(attrs, function(attr)
                {
                    return `${attr}`
                })
            }
        }
        finally
        {
            defIsRunning = false
        }

        upgrade(entry, selector)

        var defer = promises[name]
        if (!defer) return

        defer.resolve()
        delete promises[name]
    }

    function get(name)
    {
        assertContext(this)

        var entry = registry[`${name}`]

        return entry && entry.fn
    }

    function whenDefined(name)
    {
        assertContext(this)

        name = `${name}`

        if (!isValidTag(name))
            return Promise.reject(new DOMException("SyntaxError"))

        if (name in registry)
            return Promise.resolve()

        if (!(name in promises))
            promises[name] = defer()

        return promises[name].promise
    }

    var registry = Object.create(null)
    var promises = Object.create(null)
    var defIsRunning = false

    function isUnknown(tag)
    {
        return HTMLUnknownElement == document.createElement(tag).constructor
    }

    function isConstructor(fn)
    {
        // TODO: check for [[Construct]] method

        return typeof fn == "function"
    }

    var svgElements =
    [
        "annotation-xml",
        "color-profile",
        "font-face",
        "font-face-src",
        "font-face-uri",
        "font-face-format",
        "font-face-name",
        "missing-glyph",
    ]

    function isValidTag(name)
    {
        return /^[a-z]/.test(name)
            && !/[A-Z]/.test(name)
            && name.includes("-")
            && !svgElements.includes(name)
    }

    function hasConstructor(fn)
    {
        return Object.values(registry).some(function(entry)
        {
            return entry.fn == fn
        })
    }

    var customElements = Object.create(CustomElementRegistry.prototype)

    Object.defineProperty(window, "customElements",
    {
        value: customElements,
        enumerable: true,
        configurable: true,
    })
})()
