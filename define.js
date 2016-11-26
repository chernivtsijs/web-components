"use strict"

const define = (tag, params) =>
{
    let extendsBuiltIn = params.extends
    let name = extendsBuiltIn || tag
    let parent = document.createElement(name).constructor

    class custom extends parent
    {
        constructor()
        {
            super()

            if (params.upgrade)
                params.upgrade.call(this)
        }
    }

    let proto = custom.prototype
    let attrs = custom.observedAttributes = extendsBuiltIn
        ? Object.keys(parent.prototype).map(attr => attr.toLowerCase())
        : []

    for (let [ key, value ] of Object.entries(params))
    {
        switch (key)
        {
            case "connect":
                proto.connectedCallback = value
                break

            case "disconnect":
                proto.disconnectedCallback = value
                break

            case "attrChange":
                proto.attributeChangedCallback = value
                break
        }

        proto[key] = value
    }

    if (params.props)
    {
        for (let [ key, value ] of Object.entries(params.props))
        {
            attrs.push(extendsBuiltIn ? `data-${key}` : key)

            let desc =
            {
                enumerable: true,
                configurable: true,
            }

            switch (value)
            {
                case Boolean:
                    desc.get = extendsBuiltIn
                        ? function() { return key in this.dataset }
                        : function() { return this.hasAttribute(key) }

                    desc.set = extendsBuiltIn
                        ? function(value) { value ? this.dataset[key] = "" : delete this.dataset[key] }
                        : function(value) { value ? this.setAttribute(key, "") : this.removeAttribute(key) }

                    break
            }

            Object.defineProperty(proto, key, desc)
        }
    }

    customElements.define(tag, custom,
    {
        extends: params.extends,
    })
}
