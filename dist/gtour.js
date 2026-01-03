/**
 * Created by Gigih Hadi Prakoso
 * 
 */

(function () {

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

    const PREV = 'Previous';
    const NEXT = 'Next';
    const DONE = 'Finish';

    const BOOLEAN = 'boolean'
    const STRING = 'string';

    var _this;

    this.gtourJS = function (args) {
        this.body = document.querySelector("body");
        this.line = [{}];
        this.elem;
        this.unit = "px";
        this.option = setOption(args)

        _this = this
    }

    gtourJS.prototype.queue = function (q) {
        if (!Array.isArray(q)) console.error("Data type error")
            (typeof q[0] == 'object' ? '' : console.error("Data type error"))
        q.forEach(element => { element.elem ? '' : console.error("Element not found") });

        this.line = q
    }

    gtourJS.prototype.run = function () {
        nextStep.call(this)
    }

    function nextStep() {
        if (typeof this.step === 'undefined')
            this.step = 0

        this.elem = this.line[this.step].elem

        showElement.call(this)
    }

    function prevStep() {
        this.elem = this.line[this.step].elem

        showElement.call(this)
    }

    function exitStep() {
        destroyElement.call(this)
    }

    function showElement() {
        var self = this;

        if (document.getElementById(idSpotElement) === null) 
            buildSpot.call(self);
        
        if (document.getElementById(idTooltip) === null) 
            buildTooltip.call(self)

        if (document.getElementById(idOverlay) === null) 
            buildOverlay.call(self)

        adjustmentTooltip();
        adjustmentSpot();
        adjustmentButton.call(self)
    }

    function destroyElement() {
        delete this.step
        document.getElementById(idTooltip).remove();
        document.getElementById(idSpotElement).remove();
        document.getElementById(idOverlay).remove();
    }

    const adjustmentSpot = () => {
        position = getOffsetElement(_this.elem)
        size = getSizeElement(_this.elem)

        let styles = {
            ...position,
            ...size,
        }
        Object.entries(styles).forEach(([key, val]) => {
            styles[key] = val.toString() + _this.unit
        })
        applyStyle("#" + idSpotElement, styles)
    }

    const adjustmentTooltip = () => {
        const idContentTooltipHeader = "gtour-content-tooltip-header"
        const positionTooltip = _this.line[_this.step].position;

        if (document.getElementById(idContentTooltipHeader) === null) {
            document.getElementById(idTooltipHeader).appendChild(createTag('p', idContentTooltipHeader, idContentTooltipHeader))
        }

        ctHeader = document.getElementById(idContentTooltipHeader)
        ctHeader.innerHTML = _this.line[_this.step].title ? _this.line[_this.step].title : "";

        setContentTag("#" + idTooltipBody, _this.line[_this.step].description);

        position = getOffsetElement(_this.elem)
        sizeElement = getSizeElement(_this.elem)
        Object.entries(position).forEach(([key, val]) => {
            position[key] = val.toString() + _this.unit
        })

        sizeTooltip = getSizeElement("." + idTooltip)

        var y;
        var x;
        switch (positionTooltip) {
            case "top":
                y = parseInt(sizeElement.height) - (parseInt(sizeElement.height) + parseInt(sizeTooltip.height) + 10)
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

        let styles = {
            ...position,
            transform: "translate(" + x + "px, " + y + "px)"
        }
        applyStyle("#" + idTooltip, styles);
        updateCss('.'+idTooltip, 'color', _this.option.textColor);
    }

    function adjustmentButton() {
        var self = this

        bPrev = document.getElementById(idBtnPrev)
        if (self.step > 0) {
            bPrev.onclick = function () { self.step--; prevStep.call(self) }
            bPrev.style.visibility = 'visible'
        } else {
            bPrev.style.visibility = 'hidden'
        }

        bNext = document.getElementById(idBtnNext)
        bNext.onclick = function () {
            if (isDone.call(self, self.step)) {
                exitStep.call(self)
            } else {
                self.step++; nextStep.call(self)
            }
        }

        if(_this.option.indicatorAvailable) {
            document.querySelectorAll('[id="'+idIndicatorItem+'"]').forEach((item) => {
                item.classList.remove('active');
            })
    
            console.log(document.querySelector('[id="'+idIndicatorItem+'"]'))
            console.log(self)
            document.querySelector('[id="'+idIndicatorItem+'"][data-index="'+ (self.step+1) +'"]').classList.add('active');
    
            updateCss('.'+idIndicatorItem+'.active', 'background-color', _this.option.indicatorColorActive);
            updateCss('.'+idIndicatorItem, 'background-color', _this.option.indicatorColor);
        }

        if(_this.option.allowClose) {
            bClose = document.getElementById("gtour-close");
            bClose.onclick = function () {
                if(_this.option.exitConfirmation) {
                    if(confirm("Are you sure want to exit?") == true)
                        exitStep.call(self)
                } else {
                    exitStep.call(self)
                }
            }
        }
    }

    function adjustmentOverlay() {
        var self = this

        if(_this.option.allowClose){
            document.getElementById(idOverlay).onclick = function () {
                if(_this.option.exitConfirmation) {
                    if(confirm("Are you sure want to exit?") == true)
                        exitStep.call(self)
                } else {
                    exitStep.call(self)
                }
            };
        }
    }

    const applyStyle = (selector, stylesJSON) => {
        const s = document.querySelector(selector)
        Object.entries(stylesJSON).forEach(([key, val]) => { stylesJSON[key] = val.replace(",", "|") })
        style = JSON.stringify(stylesJSON).replace("{", "").replace("}", "").replaceAll('"', '').replaceAll(",", ";").replaceAll("|", ",");
        s.setAttribute("style", style);
    }

    function buildOverlay() {
        this.body.appendChild(createTag('div', idOverlay, idOverlay));
        adjustmentOverlay();
    }

    function buildSpot() {
        this.body.appendChild(createTag('div', idSpotElement, idSpotElement))
    }

    function buildTooltip() {
        var tooltip = createTag('div', idTooltip, idTooltip)

        tooltip.appendChild(createTag('div', idTooltipHeader, idTooltipHeader))
        tooltip.appendChild(createTag('div', idTooltipBody, idTooltipBody))
        tooltip.appendChild(createTag('div', idTooltipFooter, idTooltipFooter))
        this.body.appendChild(tooltip);

        updateCss('.'+idTooltip, 'background-color', _this.option.backgroundColor);

        if(_this.option.allowClose){
            document.getElementById(idTooltipHeader).appendChild(createTag('span', 'gtour-close', ''))
            setContentTag("#gtour-close", "&#x2715;")
        }

        if(_this.option.textFont) {
            updateCss('.'+idTooltip, 'font-family', _this.option.textFont);
            updateCss('.gtour-btn', 'font-family', _this.option.textFont);
        }
        buildButtonFooter()
        adjustmentButton.call(_this)
    }

    function buildButtonFooter() {
        btnNext = createTag('button', idBtnNext, idBtnNext + " gtour-btn position-right")
        btnPrev = createTag('button', idBtnPrev, idBtnPrev + " gtour-btn position-left")

        if(_this.option.buttonLabel) {
            const label = createTag('span')
            label.innerHTML = NEXT
            btnNext.appendChild(label)
        }
        btnNext.appendChild(createTag('i', 'icon-btn-next', 'icon-btn-next'));
        btnPrev.appendChild(createTag('i', 'icon-btn-prev', 'icon-btn-prev'))
        if(_this.option.buttonLabel) {
            const label = createTag('span')
            label.innerHTML = PREV
            btnPrev.appendChild(label)
        }

        document.getElementById(idTooltipFooter).appendChild(btnPrev)

        if(_this.option.indicatorAvailable) {
            var indicators = createTag('div', idIndicator, idIndicator);
            _this.line.forEach((indicator, idx) => {
                var itemIndicator = createTag('div', idIndicatorItem, idIndicatorItem);
                itemIndicator.setAttribute('data-index', idx+1);
                indicators.appendChild(itemIndicator);
            })
    
            document.getElementById(idTooltipFooter).appendChild(indicators)
        }

        document.getElementById(idTooltipFooter).appendChild(btnNext)

        if(_this.option.textColor) {
            updateCss('.gtour-btn', 'color', _this.option.textColor);
        }
    }

    const createTag = (tag, id, cl) => {
        let newElement = document.createElement(tag);        

        if(typeof id != 'undefined')
            newElement.setAttribute("id", id);
        if (typeof cl != 'undefined')
            newElement.setAttribute("class", cl);
        
        return newElement;
    }

    const setContentTag = (idclass, content) => {
        document.querySelector(idclass).innerHTML = content;
    }

    const getSizeElement = (selector) => {
        let element = document.querySelector(selector)
        sWidth = element.offsetWidth
        sHeight = element.offsetHeight
        return { width: sWidth, height: sHeight }
    }

    const getOffsetElement = (el) => {
        element = document.querySelector(el)
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left
        };
    }

    function isDone(currentStep) {
        return currentStep >= this.line.length - 1;
    }


    function setOption (opt) {
        const formatColorRegex = "^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|(?:rgb|hsl)a?\(\s*\d{1,3}%?(?:\s*,\s*\d{1,3}%?){2}(?:\s*,\s*(?:\d{1,3}%?|0?\.\d+|1))?\s*\))$";

        const optionRule = [
            {field: "allowClose", type: BOOLEAN, default: true},
            {field: "backgroundColor", type: STRING, validation: 'regex=>'+formatColorRegex, default: "#fff"},
            {field: "textColor", type: STRING, validation: 'regex=>'+formatColorRegex, default: "#000"},
            {field: "textFont", type: STRING, default:'initial'},
            {field: "exitConfirmation", type: BOOLEAN, default:false},
            {field: "indicatorAvailable", type: BOOLEAN, default: true},
            {field: "indicatorColorActive", type: STRING, validation: 'regex=>'+formatColorRegex, default: "#6e6e6e"},
            {field: "indicatorColor", type: STRING, validation: 'regex=>'+formatColorRegex, default: "#ddd"},
            {field: "buttonLabel", type:BOOLEAN, default: false},
        ]

        let option = {};

        optionRule.forEach((item) => {
            if(typeof opt[item.field] === 'undefined' || typeof opt[item.field] != item.type) {
                option[item.field] = item.default 
            } else if('validation' in item) {

                item.validation.split('||').forEach((val) => {
                    const [typeValidation, valueValidation] = val.split('=>');
                    switch (typeValidation) {
                        case 'regex':
                            const pattern = new RegExp(valueValidation);
                            if(pattern.test(opt[item.field])) {
                                option[item.field] = opt[item.field]
                            }
                            break;
                    }
                });

            } else {
                option[item.field] = opt[item.field]
            }
        })

        return option;
    }
    
    function updateCss(selector, prop, value) {
        for (let sheet of document.styleSheets) {
            try {
                for (let rule of sheet.cssRules || sheet.rules) {
                    if (rule.selectorText === selector) {
                        rule.style.setProperty(prop, value);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Unable access external stylesheet: ", sheet.href);
            }
        }
    }

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(x => x + x).join('');
        }
        let bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;
    
        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
        else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
        else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
        else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
        else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    
        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }

    function rgbToFilter(r, g, b) {
        let invert = 1 - (r + g + b) / (255 * 3);
        let brightness = (r + g + b) / (255 * 3);
        let sepia = 1 - brightness;
    
        return `invert(${(invert * 100).toFixed(0)}%) brightness(${(brightness * 200).toFixed(0)}%) sepia(${(sepia * 100).toFixed(0)}%);`;
    }

    function convertColorToFilter(color) {
        let r, g, b;
    
        if (color.startsWith('#')) {
            [r, g, b] = hexToRgb(color);
        } else if (color.startsWith('rgb')) {
            let values = color.match(/\d+/g).map(Number);
            [r, g, b] = values;
        } else if (color.startsWith('hsl')) {
            let values = color.match(/\d+/g).map(Number);
            [r, g, b] = hslToRgb(values[0], values[1], values[2]);
        } else {
            throw new Error('Format warna tidak dikenali');
        }
    
        return rgbToFilter(r, g, b);
    }

    window.addEventListener("resize", function () {
        if (typeof _this.step !== 'undefined') {
            showElement.call(_this)
        }
    })

}());
