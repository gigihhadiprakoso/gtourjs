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

    const PREV = 'Kembali';
    const NEXT = 'Berikutnya';
    const DONE = 'Selesai';

    var _this;

    this.gtourJS = function () {
        this.body = document.querySelector("body");
        this.line = [{}];
        this.elem;
        this.unit = "px";

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

        if (document.getElementById(idSpotElement) === null) buildSpot.call(self);
        if (document.getElementById(idTooltip) === null) buildTooltip.call(self)
        if (document.getElementById(idOverlay) === null) buildOverlay.call(self)

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
    }

    function adjustmentButton() {
        var self = this

        bPrev = document.getElementById(idBtnPrev)
        if (self.step > 0) {
            bPrev.onclick = function () { self.step--; prevStep.call(self) }
            bPrev.style.display = 'block'
        } else {
            bPrev.style.display = 'none'
        }

        bNext = document.getElementById(idBtnNext)
        bNext.onclick = function () {
            if (isDone.call(self, self.step)) {
                exitStep.call(self)
            } else {
                self.step++; nextStep.call(self)
            }
        }

        document.querySelectorAll('[id="'+idIndicatorItem+'"]').forEach((item) => {
            item.classList.remove('active');
        })
        console.log(document.querySelectorAll('[id="'+idIndicatorItem+'"]'));
        document.querySelector('[id="'+idIndicatorItem+'"][data-index="'+ (self.step+1) +'"]').classList.add('active');

        bClose = document.getElementById("gtour-close");
        bClose.onclick = function () {
            exitStep.call(self)
        }
    }

    function adjustmentOverlay() {
        var self = this

        document.getElementById(idOverlay).onclick = function () {
            exitStep.call(self)
        };
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

        document.getElementById(idTooltipHeader).appendChild(createTag('span', 'gtour-close', ''))
        setContentTag("#gtour-close", "&#x2715;")
        buildButtonFooter()
        adjustmentButton.call(_this)
    }

    function buildButtonFooter() {
        btnNext = createTag('button', idBtnNext, idBtnNext + " gtour-btn position-right")
        btnPrev = createTag('button', idBtnPrev, idBtnPrev + " gtour-btn position-left")

        btnNext.appendChild(createTag('i', 'icon-btn-next', 'icon-btn-next'));
        btnPrev.appendChild(createTag('i', 'icon-btn-prev', 'icon-btn-prev'))

        var indicators = createTag('div', idIndicator, idIndicator);
        _this.line.forEach((indicator, idx) => {
            var itemIndicator = createTag('div', idIndicatorItem, idIndicatorItem);
            itemIndicator.setAttribute('data-index', idx+1);
            indicators.appendChild(itemIndicator);
        })

        document.getElementById(idTooltipFooter).appendChild(indicators)
        document.getElementById(idTooltipFooter).appendChild(btnPrev)
        document.getElementById(idTooltipFooter).appendChild(btnNext)
    }

    const createTag = (tag, id, cl) => {
        let newElement = document.createElement(tag);
        newElement.setAttribute("id", id);
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

    window.addEventListener("resize", function () {
        if (typeof _this.step !== 'undefined') {
            showElement.call(_this)
        }
    })

}());
