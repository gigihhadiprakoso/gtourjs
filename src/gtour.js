/**
 * Created by Gigih Hadi Prakoso
 *
 * gtourJS core (framework-agnostic, SSR-safe)
 */

const idSpotElement = "gtour-spot-element";

const idTooltip = "gtour-tooltip";
const idTooltipHeader = "gtour-tooltip-header";
const idTooltipBody = "gtour-tooltip-body";
const idTooltipFooter = "gtour-tooltip-footer";
const idIndicator = "gtour-tooltip-indicators";
const idIndicatorItem = "gtour-tooltip-item-indicators";

const idOverlay = "gtour-overlay";

const idBtnNext = "btn-next";
const idBtnPrev = "btn-prev";

const PREV = "Previous";
const NEXT = "Next";

const BOOLEAN = "boolean";
const STRING = "string";

function gtourJS(args) {
    if (!(this instanceof gtourJS)) {
        return new gtourJS(args);
    }

    args = args || {};

    this.unit = "px";
    this.line = [];
    this.elem = undefined;
    this.step = undefined;
    this.body = null;
    this.option = setOption(args);

    this._doc = args.document || null;
    this._win = args.window || null;
    this._resizeHandler = null;
}

gtourJS.prototype.queue = function (q) {
    if (!Array.isArray(q)) {
        console.error("gtourJS: queue() expects an array of steps");
        return this;
    }

    q.forEach(function (step, index) {
        if (!step || typeof step !== "object" || !step.elem) {
            console.error("gtourJS: step at index " + index + " has no 'elem'");
        }
    });

    this.line = q;
    return this;
};

gtourJS.prototype.run = function () {
    if (!resolveEnvironment.call(this)) {
        console.warn("gtourJS: run() requires a DOM environment. Run it in the browser or pass `document` in the options.");
        return this;
    }

    if (!Array.isArray(this.line) || this.line.length === 0) {
        console.error("gtourJS: call queue() with at least one step before run()");
        return this;
    }

    this.body = this._doc.body || this._doc.querySelector("body");
    this.step = 0;

    bindResize.call(this);
    showElement.call(this);

    return this;
};

gtourJS.prototype.destroy = function () {
    destroyElement.call(this);
    return this;
};

gtourJS.prototype.setFont = function (font) {
    if (typeof font !== "string" || font.trim() === "") {
        console.error("gtourJS: setFont() expects a non-empty font family string");
        return this;
    }

    this.option.textFont = font;

    if (!resolveEnvironment.call(this)) {
        return this;
    }

    var tooltip = this._doc.getElementById(idTooltip);
    if (tooltip !== null) {
        tooltip.style.fontFamily = font;
        forEachElement(this._doc.querySelectorAll(".gtour-btn"), function (btn) {
            btn.style.fontFamily = font;
        });
    }

    return this;
};

gtourJS.prototype.isActive = function () {
    return typeof this.step !== "undefined";
};

function resolveEnvironment() {
    if (!this._doc && typeof document !== "undefined") {
        this._doc = document;
    }

    if (!this._win && typeof window !== "undefined") {
        this._win = window;
    }

    return !!(this._doc && typeof this._doc.createElement === "function");
}

function bindResize() {
    var self = this;

    if (!this._win || this._resizeHandler) return;

    this._resizeHandler = function () {
        if (typeof self.step !== "undefined") {
            showElement.call(self);
        }
    };

    this._win.addEventListener("resize", this._resizeHandler);
}

function unbindResize() {
    if (this._win && this._resizeHandler) {
        this._win.removeEventListener("resize", this._resizeHandler);
        this._resizeHandler = null;
    }
}

function showElement() {
    if (!this._doc) return;

    var step = this.line[this.step];
    if (!step) return;

    this.elem = step.elem;

    if (this._doc.getElementById(idSpotElement) === null) {
        buildSpot.call(this);
    }

    if (this._doc.getElementById(idTooltip) === null) {
        buildTooltip.call(this);
    }

    if (this._doc.getElementById(idOverlay) === null) {
        buildOverlay.call(this);
    }

    adjustmentTooltip.call(this);
    adjustmentSpot.call(this);
    adjustmentButton.call(this);
}

function destroyElement() {
    var doc = this._doc;

    delete this.step;
    this.elem = undefined;

    if (doc) {
        [idTooltip, idSpotElement, idOverlay].forEach(function (id) {
            var el = doc.getElementById(id);
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }

    unbindResize.call(this);
}

function adjustmentSpot() {
    var position = getOffsetElement(this._doc, this.elem);
    var size = getSizeElement(this._doc, this.elem);
    var unit = this.unit;

    applyStyle(this._doc, "#" + idSpotElement, {
        top: position.top + unit,
        left: position.left + unit,
        width: size.width + unit,
        height: size.height + unit
    });
}

function adjustmentTooltip() {
    var doc = this._doc;
    var step = this.line[this.step] || {};
    var unit = this.unit;
    var idContentTooltipHeader = "gtour-content-tooltip-header";

    if (doc.getElementById(idContentTooltipHeader) === null) {
        doc.getElementById(idTooltipHeader).appendChild(
            createTag(doc, "p", idContentTooltipHeader, idContentTooltipHeader)
        );
    }

    var ctHeader = doc.getElementById(idContentTooltipHeader);
    ctHeader.innerHTML = step.title ? step.title : "";

    setContentTag(doc, "#" + idTooltipBody, step.description ? step.description : "");

    var position = getOffsetElement(doc, this.elem);
    var sizeElement = getSizeElement(doc, this.elem);
    var sizeTooltip = getSizeElement(doc, "." + idTooltip);

    var y;
    var x;

    switch (step.position) {
        case "top":
            y = parseInt(sizeElement.height) - (parseInt(sizeElement.height) + parseInt(sizeTooltip.height) + 10);
            x = 20;
            break;
        case "left":
            y = parseInt(sizeElement.height) * 0.3;
            x = parseInt(sizeElement.width) - (parseInt(sizeElement.width) + parseInt(sizeTooltip.width) + 10);
            break;
        case "right":
            y = parseInt(sizeElement.height) * 0.3;
            x = parseInt(sizeElement.width) + 10;
            break;
        default:
            y = parseInt(sizeElement.height) + 10;
            x = 20;
            break;
    }

    applyStyle(doc, "#" + idTooltip, {
        top: position.top + unit,
        left: position.left + unit,
        transform: "translate(" + x + "px, " + y + "px)"
    });

    var tooltip = doc.getElementById(idTooltip);
    if (tooltip) {
        tooltip.style.color = this.option.textColor;
        tooltip.style.backgroundColor = this.option.backgroundColor;
        tooltip.style.fontFamily = this.option.textFont;
    }
}

function adjustmentButton() {
    var self = this;
    var doc = this._doc;

    var bPrev = doc.getElementById(idBtnPrev);
    if (bPrev) {
        if (self.step > 0) {
            bPrev.onclick = function () {
                self.step--;
                showElement.call(self);
            };
            bPrev.style.visibility = "visible";
        } else {
            bPrev.style.visibility = "hidden";
        }
    }

    var bNext = doc.getElementById(idBtnNext);
    if (bNext) {
        bNext.onclick = function () {
            if (isDone.call(self, self.step)) {
                destroyElement.call(self);
            } else {
                self.step++;
                showElement.call(self);
            }
        };
    }

    if (self.option.indicatorAvailable) {
        forEachElement(doc.querySelectorAll('[id="' + idIndicatorItem + '"]'), function (item) {
            item.classList.remove("active");
            item.style.backgroundColor = self.option.indicatorColor;
        });

        var active = doc.querySelector('[id="' + idIndicatorItem + '"][data-index="' + (self.step + 1) + '"]');
        if (active) {
            active.classList.add("active");
            active.style.backgroundColor = self.option.indicatorColorActive;
        }
    }

    if (self.option.allowClose) {
        var bClose = doc.getElementById("gtour-close");
        if (bClose) {
            bClose.onclick = function () {
                if (confirmExit.call(self)) {
                    destroyElement.call(self);
                }
            };
        }
    }
}

function adjustmentOverlay() {
    var self = this;
    var overlay = this._doc.getElementById(idOverlay);

    if (overlay && self.option.allowClose) {
        overlay.onclick = function () {
            if (confirmExit.call(self)) {
                destroyElement.call(self);
            }
        };
    }
}

function confirmExit() {
    if (!this.option.exitConfirmation) {
        return true;
    }

    if (this._win && typeof this._win.confirm === "function") {
        return this._win.confirm("Are you sure want to exit?");
    }

    if (typeof confirm === "function") {
        return confirm("Are you sure want to exit?");
    }

    return true;
}

function buildSpot() {
    this.body.appendChild(createTag(this._doc, "div", idSpotElement, idSpotElement));
}

function buildOverlay() {
    this.body.appendChild(createTag(this._doc, "div", idOverlay, idOverlay));
    adjustmentOverlay.call(this);
}

function buildTooltip() {
    var doc = this._doc;
    var tooltip = createTag(doc, "div", idTooltip, idTooltip);

    tooltip.style.backgroundColor = this.option.backgroundColor;
    tooltip.style.color = this.option.textColor;
    tooltip.style.fontFamily = this.option.textFont;

    tooltip.appendChild(createTag(doc, "div", idTooltipHeader, idTooltipHeader));
    tooltip.appendChild(createTag(doc, "div", idTooltipBody, idTooltipBody));
    tooltip.appendChild(createTag(doc, "div", idTooltipFooter, idTooltipFooter));

    this.body.appendChild(tooltip);

    if (this.option.allowClose) {
        doc.getElementById(idTooltipHeader).appendChild(createTag(doc, "span", "gtour-close", ""));
        setContentTag(doc, "#gtour-close", "\u2715");
    }

    buildButtonFooter.call(this);
    adjustmentButton.call(this);
}

function buildButtonFooter() {
    var self = this;
    var doc = this._doc;
    var btnNext = createTag(doc, "button", idBtnNext, idBtnNext + " gtour-btn position-right");
    var btnPrev = createTag(doc, "button", idBtnPrev, idBtnPrev + " gtour-btn position-left");

    if (self.option.buttonLabel) {
        var labelNext = createTag(doc, "span");
        labelNext.innerHTML = NEXT;
        btnNext.appendChild(labelNext);
    }

    btnNext.appendChild(createTag(doc, "i", "icon-btn-next", "icon-btn-next"));
    btnPrev.appendChild(createTag(doc, "i", "icon-btn-prev", "icon-btn-prev"));

    if (self.option.buttonLabel) {
        var labelPrev = createTag(doc, "span");
        labelPrev.innerHTML = PREV;
        btnPrev.appendChild(labelPrev);
    }

    [btnNext, btnPrev].forEach(function (btn) {
        btn.style.color = self.option.textColor;
        btn.style.fontFamily = self.option.textFont;
    });

    doc.getElementById(idTooltipFooter).appendChild(btnPrev);

    if (self.option.indicatorAvailable) {
        var indicators = createTag(doc, "div", idIndicator, idIndicator);

        self.line.forEach(function (indicator, idx) {
            var itemIndicator = createTag(doc, "div", idIndicatorItem, idIndicatorItem);
            itemIndicator.setAttribute("data-index", idx + 1);
            itemIndicator.style.backgroundColor = self.option.indicatorColor;
            indicators.appendChild(itemIndicator);
        });

        doc.getElementById(idTooltipFooter).appendChild(indicators);
    }

    doc.getElementById(idTooltipFooter).appendChild(btnNext);
}

function createTag(doc, tag, id, cl) {
    var newElement = doc.createElement(tag);

    if (typeof id !== "undefined") {
        newElement.setAttribute("id", id);
    }

    if (typeof cl !== "undefined") {
        newElement.setAttribute("class", cl);
    }

    return newElement;
}

function setContentTag(doc, selector, content) {
    var el = doc.querySelector(selector);
    if (el) {
        el.innerHTML = content;
    }
}

function applyStyle(doc, selector, styles) {
    var el = doc.querySelector(selector);
    if (!el) return;

    Object.keys(styles).forEach(function (key) {
        el.style[key] = styles[key];
    });
}

function forEachElement(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
}

function getSizeElement(doc, selector) {
    var element = doc.querySelector(selector);

    return {
        width: element ? element.offsetWidth : 0,
        height: element ? element.offsetHeight : 0
    };
}

function getOffsetElement(doc, selector) {
    var element = doc.querySelector(selector);
    var top = 0;
    var left = 0;

    while (element) {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    }

    return {
        top: top,
        left: left
    };
}

function isDone(currentStep) {
    return currentStep >= this.line.length - 1;
}

function setOption(opt) {
    opt = opt || {};

    const formatColorRegex = "^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|(?:rgb|hsl)a?\\(\\s*\\d{1,3}%?(?:\\s*,\\s*\\d{1,3}%?){2}(?:\\s*,\\s*(?:\\d{1,3}%?|0?\\.\\d+|1))?\\s*\\))$";

    const optionRule = [
        { field: "allowClose", type: BOOLEAN, default: true },
        { field: "backgroundColor", type: STRING, validation: "regex=>" + formatColorRegex, default: "#fff" },
        { field: "textColor", type: STRING, validation: "regex=>" + formatColorRegex, default: "#000" },
        { field: "textFont", type: STRING, default: "inherit" },
        { field: "exitConfirmation", type: BOOLEAN, default: false },
        { field: "indicatorAvailable", type: BOOLEAN, default: true },
        { field: "indicatorColorActive", type: STRING, validation: "regex=>" + formatColorRegex, default: "#6e6e6e" },
        { field: "indicatorColor", type: STRING, validation: "regex=>" + formatColorRegex, default: "#ddd" },
        { field: "buttonLabel", type: BOOLEAN, default: false }
    ];

    var option = {};

    optionRule.forEach(function (item) {
        var value = opt[item.field];

        if (typeof value === "undefined" || typeof value !== item.type) {
            option[item.field] = item.default;
            return;
        }

        if (item.field === "textFont" && value.trim() === "") {
            option[item.field] = item.default;
            return;
        }

        if ("validation" in item) {
            var valid = false;

            item.validation.split("||").forEach(function (val) {
                var parts = val.split("=>");
                var typeValidation = parts[0];
                var valueValidation = parts[1];

                if (typeValidation === "regex" && new RegExp(valueValidation).test(value)) {
                    valid = true;
                }
            });

            option[item.field] = valid ? value : item.default;
        } else {
            option[item.field] = value;
        }
    });

    return option;
}
