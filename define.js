"use strict"

const define = (tag, params) =>
{
    const states = new WeakMap
    const proxies = new WeakMap

    const dasherize = string => string.replace(/([a-z])(?=[A-Z])/g, "$1-")
    const isPrivate = key => typeof key == "string" && key.startsWith("_")

    const handler =
    {
        get(target, key)
        {
            if (isPrivate(key))
                target = states.get(target)

            let value = target[key]

            return typeof value == "function"
                ? value.bind(target)
                : value
        },

        set(target, key, value)
        {
            if (isPrivate(key))
                target = states.get(target)

            target[key] = value

            return true
        },
    }

    // let parent = document.createElement(params.extends).constructor
    let parent = HTMLTimeElement

    class fn extends parent
    {
        connectedCallback()
        {
            states.set(this, Object.create(null))
            proxies.set(this, new Proxy(this, handler))

            params.connect.call(proxies.get(this))
        }

        disconnectedCallback()
        {
            params.disconnect.call(proxies.get(this))
        }

        attributeChangedCallback()
        {
            params.attrChange.call(proxies.get(this))
        }
    }

    let attrs = fn.observedAttributes = []

    for (let [ key, value ] of Object.entries(params.props))
    {
        let isData = !(key in fn.prototype)
        let desc =
        {
            enumerable: true,
            configurable: true,
        }

        switch (value)
        {
            case Boolean:
                desc.get = isData
                    ? function() { return key in this.dataset }
                    : function() { return this.hasAttribute(key) }

                desc.set = isData
                    ? function(value) { value ? this.dataset[key] = "" : delete this.dataset[key] }
                    : function(value) { value ? this.setAttribute(key, "") : this.removeAttribute(key) }

                break

            case Date:
                desc.get = isData
                    ? function() { return new Date(this.dataset[key]) }
                    : function() { return new Date(this.getAttribute(key)) }

                desc.set = isData
                    ? function(value) { this.dataset[key] = value instanceof Date ? value.toISOString() : value }
                    : function(value) { this.setAttribute(key, value instanceof Date ? value.toISOString() : value) }

                break
        }

        let attr = isData ? "data-" + dasherize(key) : key
        attrs.push(attr.toLowerCase())

        Object.defineProperty(fn.prototype, key, desc)
    }

    customElements.define(tag, fn,
    {
        extends: params.extends,
    })

    delete fn.prototype.connectedCallback
    delete fn.prototype.disconnectedCallback
    delete fn.prototype.attributeChangedCallback
}
