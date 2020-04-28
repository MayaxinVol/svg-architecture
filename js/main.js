/**
 *
 * @type const about rect
 */
let rows = 0;
let cols = 0;
let dirs = 0;

const DX = 80;
const DY = 80;

let arrpRect = []; // arrpRect[k] = { i: i, j: j, cx: cx, cy: cy, r: r, used: 0 };  // k==i*cols + j;
let connRect = []; // connRect[k][kk]==true means arrpRect[k] and arrpRect[kk] connected

let KARect = -1; // arrpRect[KARect] is the first selected point
let KBRect = -1; // arrpRect[KBRect] is the second selected point

let back_color = "#333333";
let used_color = "green";
let picked_color = "red";

let picked_fill = "red";
let no_fill = "transparent";

let array = [], pointColor;
let icon = [];

/**
 *
 * @type const about circle
 */
const R = 10;
let arrP = []; // arrP[k] = { i: i, j: j, cx: cx, cy: cy, r: r, used: 0 };  // k==i*cols + j;
let conn = []; // conn[k][kk]==true means arrP[k] and arrP[kk] connected

let KA = -1; // arrP[KA] is the first selected point
let KB = -1; // arrP[KB] is the second selected point
let KMA = -1; // drag point for moving
let KMB = -1; // drop point for moving

let mouseDown = false;

let fl = [];
let ngroup = 0;

const NCOLOR = 12;

const MYCOLORS = [
    "red",
    "yellow",
    "white",
    "blue",
    "purple",
    "aqua",
    "lime",
    "silver",
    "teal",
    "fuchsia",
    "olive",
    "maroon"
];

/**
 * @ Rect Box Designing
 */
function onClickGenerateRect() {
    rows = Number(document.getElementById("input_rows").value);
    cols = Number(document.getElementById("input_cols").value);
    dirs = Number(document.getElementById("input_sizes").value) * 10;
    KARect = -1;
    KBRect = -1;

    let textHtml = "";
    let cx, cy;
    arrpRect = [];
    for (let i = 0; i < rows; i ++) {
        for (let j = 0; j < cols; j ++) {
            cx = DX + j * DX;
            cy = DY + i * DY;
            arrpRect.push({i: i, j: j, cx: cx, cy: cy, used: 0});
            let k = i * cols + j;
            textHtml += `<rect id="point${k}" x="${cx}" y="${cy}" width="${dirs}" height="${dirs}" stroke:"${array[k]}"; stroke-width:4;" fill="${array[k]}"/>`;
        }
    }
    connRect = [];
    for (let k = 0; k < arrpRect.length; k++) {
        let tmp = [];
        for (let kk = 0; kk < arrpRect.length; kk++) tmp.push(false);
        connRect.push(tmp);
    }
    function txtHtmlOfLineRect(k, kk) {
        let str = "";
        if (k >= 0 && k < arrpRect.length && kk >= 0 && kk < arrpRect.length)
            return {str};
    }

    for (let k = 0; k < arrpRect.length; k++) {
        let i = arrpRect[k].i;
        let j = arrpRect[k].j;
        let kk;
        kk = (i - 1) * cols + j;
        if (i - 1 >= 0) textHtml += txtHtmlOfLineRect(k, kk).str;

        kk = (i - 1) * cols + (j - 1);
        if (dirs === 8 && i - 1 >= 0 && j - 1 >= 0) textHtml += txtHtmlOfLineRect(k, kk).str;

        kk = i * cols + (j - 1);
        if (j - 1 >= 0) textHtml += txtHtmlOfLineRect(k, kk).str;

        kk = (i + 1) * cols + (j - 1);
        if (dirs === 8 && i + 1 < rows && j - 1 >= 0) textHtml += txtHtmlOfLineRect(k, kk).str;
    }

    let eleSVG = document.getElementById("svg");
    eleSVG.style.width = DX * (cols + 1);
    eleSVG.style.height = DY * (rows + 1);
    eleSVG.innerHTML = textHtml;
    eleSVG.addEventListener("click", onClickRectSVG);
    eleSVG.addEventListener("mousemove", onMouseMoveRectSVG);

    toggleUnused(true);
}

function designBox() {
    boxFlag += 1;

    if (boxFlag % 2 === 1)
    {
        boxFlag = 1;
        document.getElementById("btn_box").style.display = "block";
        document.getElementById("btn_group").style.display = "none";
    }
    else
    {
        boxFlag = 0;
        boxNumber = 0;
        document.getElementById("btn_group").style.display = "block";
        document.getElementById("btn_box").style.display = "none";
    }
}

function selectRectA(k) {
    if (((boxFlag === 0) && ((array[k] === undefined) || (array[k] === "#000000"))) || (((boxFlag === 1) && (pointColor === undefined))))
    {
        alert("Please add the color of the box.\n Firstly, click 'Generate Group/Design Box' button !!!");
        return;
    }
    else
    {
        KARect = k;
        highlightRect(k, true);
        document.getElementById("span4a").innerHTML = `x=${k % cols}, y=${Math.floor(k / cols)}`;
    }
}

function deselectRectA(k) {
    KARect = -1;
    highlightRect(k, false);
    document.getElementById("span4a").innerHTML = "";
}

function selectRectB(k) {
    if (((boxFlag === 0) && ((array[k] === undefined) || (array[k] === "#000000"))) || (((boxFlag === 1) && (pointColor === undefined))))
    {
        alert("Please add the color of the box.\n Firstly, click 'Generate Group/Design Box' button !!!");
        return;
    }
    else
    {
        KBRect = k;
        highlightRect(k, true);
        document.getElementById("span4b").innerHTML = `x=${k % cols}, y=${Math.floor(k / cols)}`;
    }
}

function deselectRectB(k) {
    KBRect = -1;
    highlightRect(k, false);
    document.getElementById("span4b").innerHTML = "";
}

function parseSVG(s) {
    let div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + "</svg>";
    let frag = document.createDocumentFragment();
    while (div.firstChild.firstChild) frag.appendChild(div.firstChild.firstChild);
    return frag;
}

function fuBox() {
    if (boxFlag === 1){
        pointColor = "#f4b183";
        boxNumber = 1;
    }
}

function cuBox() {
    if (boxFlag === 1)
    {
        pointColor = "#8faadc";
        boxNumber = 2;
    }
}

function rcBox() {
    if (boxFlag === 1)
    {
        pointColor = "#767171";
        boxNumber = 3;
    }
}

function unitBox() {
    if (boxFlag === 1)
    {
        pointColor = "#ffd966";
        boxNumber = 4;
    }
}

function fileBox() {
    if (boxFlag === 1)
    {
        pointColor = "#a9d18e";
        boxNumber = 5;
    }
}

function emptyBox(){
    if (boxFlag === 1)
    {
        pointColor = "#000000"
        boxNumber = 0;
    }
}

function highlightRect(k, isSelect) {
    let point = document.getElementById(`point${k}`);

    if (isSelect)
    {
        let n;
        let m;
        let ele;
        let fontSize;
        let iconName = ['FU', 'CU', 'RC', 'UNIT', 'FILE'];

        if ((dirs/10 === 6) || (dirs/10 === 5))
        {
            n = (Math.floor(k/cols) + 1) * DX + 3 * dirs/5;
            m = (k % cols + 1) * DX + dirs/3;
            fontSize = 14;
        }
        else if (dirs/10 === 4)
        {
            n = (Math.floor(k/cols) + 1) * DX + 3 * dirs/5;
            m = (k % cols + 1) * DX + dirs/3 - 3;
            fontSize = 12;
        }
        else if (dirs/10 === 3)
        {
            n = (Math.floor(k/cols) + 1) * DX + 3 * dirs/5;
            m = (k % cols + 1) * DX + dirs/3 - 3;
            fontSize = 10;
        }
        else if (dirs/10 === 2)
        {
            n = (Math.floor(k/cols) + 1) * DX + 3 * dirs/5;
            m = (k % cols + 1) * DX + dirs/3 - 3;
            fontSize = 8;
        }
        else if (dirs/10 === 1)
        {
            n = (Math.floor(k/cols) + 1) * DX + 3 * dirs/5;
            m = (k % cols + 1) * DX + dirs/3 - 3;
            fontSize = 6;
        }

        if (document.getElementById(`Icon_${k}`))
        {
            ele = document.getElementById(`Icon_${k}`);
            ele.parentNode.removeChild(ele);
        }

        if (boxNumber === 1)
        {
            icon[k] = iconName[boxNumber - 1];
            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${iconName[boxNumber - 1]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }
        else if (boxNumber === 2)
        {
            icon[k] = iconName[boxNumber - 1];
            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${iconName[boxNumber - 1]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }
        else if (boxNumber === 3)
        {
            icon[k] = iconName[boxNumber - 1];
            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${iconName[boxNumber - 1]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }
        else if (boxNumber === 4)
        {
            icon[k] = iconName[boxNumber - 1];
            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${iconName[boxNumber - 1]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }
        else if (boxNumber === 5)
        {
            icon[k] = iconName[boxNumber - 1];
            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${iconName[boxNumber - 1]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }

        // point.setAttributeNS(null, "stroke", picked_color);
        // point.setAttributeNS(null, "fill", picked_fill);

        if (boxFlag === 1)
            point.setAttributeNS(null, "fill", array[k]);
        else
       {
            point.setAttributeNS(null, "stroke", used_color);
            point.setAttributeNS(null, "fill", picked_color);

            ele = parseSVG(`<text id="Icon_${k}" x = "${m}" y = "${n}" fill = "black" font-size = "${fontSize}">${icon[k]}</text>`);
            document.getElementById("svg").appendChild(ele);
        }
    }
    else if (arrpRect[k].used)
    {
        point.setAttributeNS(null, "stroke", picked_color);
        point.setAttributeNS(null, "fill", array[k]);
    }
    else
    {
        point.setAttributeNS(null, "stroke", array[k]);
        point.setAttributeNS(null, "fill", array[k]);
    }

    for (let kk = 0; kk < arrpRect.length; kk++) {
        if (connRect[k][kk]) {

            //highlightRect connected lines
            let conndLine = document.getElementById(`line_${Math.min(k, kk)}_${Math.max(k, kk)}`);
            let conndPoint = document.getElementById(`point${kk}`);

            if (isSelect)
            {console.log("connRect[k][kk]", connRect[k][kk]);
                conndLine.setAttributeNS(null, "stroke", used_color);
                conndPoint.setAttributeNS(null, "stroke", picked_color);
            }
            else
            {
                conndLine.setAttributeNS(null, "stroke", used_color);
                conndPoint.setAttributeNS(null, "stroke", picked_color);
            }
        }
    }
}

function onClickRectSVG(evt) {
    let t = evt.target;
    let cx = t.getAttributeNS(null, "x");
    let cy = t.getAttributeNS(null, "y");
    if (t.nodeName !== "rect") return;
    let i, j, k;
    j = (cx - DX) / DX;
    i = (cy - DY) / DY;
    k = i * cols + j;

    if (boxFlag === 1) array[k] = pointColor;

    if (KARect === -1 && KBRect === -1) selectRectA(k);
    else if (KARect !== -1 && KBRect === -1 && k !== KARect) selectRectB(k);
    else if (k === KARect) deselectRectA(k);
    else if (k === KBRect) deselectRectB(k);

    // if (boxFlag === 1) onClickGenerateRect();
    if (boxFlag === 1) replaceArrayRect(k, i, j, cx, cy);
}

function replaceArrayRect(k, i, j, cx, cy) {
    arrpRect.splice(k, 1, {i: i, j: j, cx: cx, cy: cy, used: 0});
    KARect = -1;
    KBRect = -1;
}

function onMouseMoveRectSVG(evt) {
    let t = evt.target;
    let cx = t.getAttributeNS(null, "x");
    let cy = t.getAttributeNS(null, "y");
    if (t.nodeName !== "rect") return;
    let i, j, k;
    j = (cx - DX) / DX;
    i = (cy - DY) / DY;
    k = i * cols + j;
    document.getElementById("span4now").innerHTML = `x=${j}, y=${i}`;
}

/**
 *
 * @Common using functions
 */
let isShowUnused = true;
function toggleUnused(_isShowUnused) {
    isShowUnused = _isShowUnused;
    document.getElementById("btn_show_unused").style.display = isShowUnused ? "none" : "block";
    document.getElementById("btn_hide_unused").style.display = isShowUnused ? "block" : "none";

    if (boardCount === 1)
    {
        for (let k = 0; k < arrP.length; k++)
            if (!arrP[k].used) {
                document.getElementById(`point${k}`).style.display = isShowUnused
                    ? "block"
                    : "none";
            }
    }
    else if (boardCount === 2)
    {
        for (let k = 0; k < arrpRect.length; k++)
            if (!arrpRect[k].used) {
                document.getElementById(`point${k}`).style.display = isShowUnused ? "block" : "none";
            }
    }
}

function onKeySpace(evt) {
    if (boxFlag === 1) return;
    else if (evt.keyCode === 32) {
        if (boardCount === 1)
        {
            evt.preventDefault();
            if (KA !== -1 && KB !== -1) {
                if (!conn[KA][KB]) {
                    conn[KA][KB] = true;
                    conn[KB][KA] = true;
                    arrP[KA].used++;
                    arrP[KB].used++;

                    if (fl[KA]) fl[KB] = fl[KA];
                    else if (fl[KB]) fl[KA] = fl[KB];
                    doGroupColoring();

                    let ele = parseSVG(`<line id="line_${Math.min(KA, KB)}_${Math.max(KA, KB)}" x1="${arrP[KA].cx}" y1="${arrP[KA].cy}" x2="${arrP[KB].cx}" y2="${arrP[KB].cy}" stroke=${used_color} style="pointer-events:none;"/>`);
                    document.getElementById("svg").appendChild(ele);
                } else {
                    conn[KA][KB] = false;
                    conn[KB][KA] = false;
                    arrP[KA].used--;
                    arrP[KB].used--;

                    let ele = document.getElementById(
                        `line_${Math.min(KA, KB)}_${Math.max(KA, KB)}`
                    );
                    ele.parentNode.removeChild(ele);
                }

                deselectA(KA);
                deselectB(KB);
            }
        }
        else if (boardCount === 2)
        {
            evt.preventDefault();
            if (KARect !== -1 && KBRect !== -1)
            {
                if (!connRect[KARect][KBRect])
                {
                    connRect[KARect][KBRect] = true;
                    connRect[KBRect][KARect] = true;
                    arrpRect[KARect].used++;
                    arrpRect[KBRect].used++;

                    // arrpRect[KARect].cx = (Number(arrpRect[KARect].cx) + dirs).toString();
                    // arrpRect[KARect].cy = (Number(arrpRect[KARect].cy) + dirs/2).toString();
                    // arrpRect[KBRect].cy = (Number(arrpRect[KBRect].cy) + dirs/2).toString();

                    /**
                     *
                     * @type arrow direction between 2 boxes
                     */
                    console.log(arrpRect[KARect].cx, arrpRect[KBRect].cx, arrpRect[KARect].cy, arrpRect[KBRect].cy);


                    if (Number(arrpRect[KARect].cy) === Number(arrpRect[KBRect].cy))
                    {
                        if (Number(arrpRect[KARect].cx) === Number(arrpRect[KBRect].cx) + DX)
                        {
                            /**
                             *
                             * @type right-left-line
                             */
                            let ele = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}" x1="${(Number(arrpRect[KARect].cx)).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2).toString()}" stroke=${picked_fill} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowLeftTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftTop" x1="${(Number(arrpRect[KARect].cx)).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${(Number(arrpRect[KARect].cx) - 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs/2 - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowLeftBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftBottom" x1="${(Number(arrpRect[KARect].cx)).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}"  x2="${(Number(arrpRect[KARect].cx) - 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs/2 + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowRightTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightTop" x1="${(Number(arrpRect[KBRect].cx) + dirs).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs + 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2 - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowRightBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightBottom" x1="${(Number(arrpRect[KBRect].cx) + dirs).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs + 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2 + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            document.getElementById("svg").appendChild(ele);
                            document.getElementById("svg").appendChild(arrowLeftTop);
                            document.getElementById("svg").appendChild(arrowLeftBottom);
                            document.getElementById("svg").appendChild(arrowRightTop);
                            document.getElementById("svg").appendChild(arrowRightBottom);
                        }
                        else if (Number(arrpRect[KBRect].cx) === Number(arrpRect[KARect].cx) + DX)
                        {
                            /**
                             *
                             * @type left-right-line
                             */
                            let ele = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}" x1="${(Number(arrpRect[KARect].cx) + dirs).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${arrpRect[KBRect].cx}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2).toString()}" stroke=${picked_fill} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowLeftTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftTop" x1="${(Number(arrpRect[KARect].cx) + dirs).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}"  x2="${(Number(arrpRect[KARect].cx) + dirs + 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs/2 - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowLeftBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftBottom" x1="${(Number(arrpRect[KARect].cx) + dirs).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2).toString()}" x2="${(Number(arrpRect[KARect].cx) + dirs + 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs/2 + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowRightTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightTop" x1="${(Number(arrpRect[KBRect].cx) - 4).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2 - 4).toString()}" x2="${arrpRect[KBRect].cx}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowRightBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightBottom" x1="${(Number(arrpRect[KBRect].cx) - 4).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs/2 + 4).toString()}" x2="${arrpRect[KBRect].cx}" y2="${(Number(arrpRect[KBRect].cy) + dirs/2).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            document.getElementById("svg").appendChild(ele);
                            document.getElementById("svg").appendChild(arrowLeftTop);
                            document.getElementById("svg").appendChild(arrowLeftBottom);
                            document.getElementById("svg").appendChild(arrowRightTop);
                            document.getElementById("svg").appendChild(arrowRightBottom);
                        }
                        else if (Number(arrpRect[KBRect].cx) < Number(arrpRect[KARect].cx))
                        {
                            // let ele = parseSVG(`<path id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}" d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>`);
                            // document.getElementById("svg").appendChild(ele);


                        }
                        else if (Number(arrpRect[KARect].cx) < Number(arrpRect[KBRect].cx))
                        {

                        }
                    }
                    else if (Number(arrpRect[KARect].cx) === Number(arrpRect[KBRect].cx))
                    {
                        if (Number(arrpRect[KARect].cy) === Number(arrpRect[KBRect].cy) + DY)
                        {
                            /**
                             *
                             * @type bottom-top-line
                             */
                            let ele = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy)).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs).toString()}" stroke=${picked_fill} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowLeftTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftTop" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy)).toString()}" x2="${(Number(arrpRect[KARect].cx) + dirs/2 - 4).toString()}" y2="${(Number(arrpRect[KARect].cy) - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowLeftBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftBottom" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy)).toString()}" x2="${(Number(arrpRect[KARect].cx) + dirs/2 + 4).toString()}" y2="${(Number(arrpRect[KARect].cy) - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowRightTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightTop" x1="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KBRect].cy) + dirs).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2 - 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowRightBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightBottom" x1="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KBRect].cy) + dirs).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2 + 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) + dirs + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            document.getElementById("svg").appendChild(ele);
                            document.getElementById("svg").appendChild(arrowLeftTop);
                            document.getElementById("svg").appendChild(arrowLeftBottom);
                            document.getElementById("svg").appendChild(arrowRightTop);
                            document.getElementById("svg").appendChild(arrowRightBottom);
                        }
                        else if (Number(arrpRect[KBRect].cy) === Number(arrpRect[KARect].cy) + DY)
                        {
                            /**
                             *
                             * @type top-bottom-line
                             */
                            let ele = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y2="${(Number(arrpRect[KBRect].cy)).toString()}" stroke=${picked_fill} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowLeftTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftTop" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs).toString()}" x2="${(Number(arrpRect[KARect].cx) + dirs/2 - 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowLeftBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftBottom" x1="${(Number(arrpRect[KARect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KARect].cy) + dirs).toString()}" x2="${(Number(arrpRect[KARect].cx) + dirs/2 + 4).toString()}" y2="${(Number(arrpRect[KARect].cy) + dirs + 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);

                            let arrowRightTop = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightTop" x1="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KBRect].cy)).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2 - 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            let arrowRightBottom = parseSVG(`<line id="line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightBottom" x1="${(Number(arrpRect[KBRect].cx) + dirs/2).toString()}" y1="${(Number(arrpRect[KBRect].cy)).toString()}" x2="${(Number(arrpRect[KBRect].cx) + dirs/2 + 4).toString()}" y2="${(Number(arrpRect[KBRect].cy) - 4).toString()}" stroke=${used_color} style="pointer-events:none;" stroke-width="2"/>`);
                            document.getElementById("svg").appendChild(ele);
                            document.getElementById("svg").appendChild(arrowLeftTop);
                            document.getElementById("svg").appendChild(arrowLeftBottom);
                            document.getElementById("svg").appendChild(arrowRightTop);
                            document.getElementById("svg").appendChild(arrowRightBottom);
                        }
                        else if (Number(arrpRect[KBRect].cy) < Number(arrpRect[KARect].cy))
                        {

                        }
                        else if (Number(arrpRect[KARect].cy) < Number(arrpRect[KBRect].cy))
                        {

                        }
                    }
                    // else
                    // {
                    //     KARect = -1;
                    //     KBRect = -1;
                    //     alert("Select the correct Boxes !!!");
                    // }
                }
                else
                {
                    connRect[KARect][KBRect] = false;
                    connRect[KBRect][KARect] = false;
                    arrpRect[KARect].used--;
                    arrpRect[KBRect].used--;
                    /**
                     *
                     * @type left-right-line
                     */
                    let ele = document.getElementById(`line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}`);
                    let arrowLeftTop = document.getElementById(`line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftTop`);
                    let arrowLeftBottom = document.getElementById(`line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_LeftBottom`);
                    let arrowRightTop = document.getElementById(`line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightTop`);
                    let arrowRightBottom = document.getElementById(`line_${Math.min(KARect, KBRect)}_${Math.max(KARect, KBRect)}_RightBottom`);
                    ele.parentNode.removeChild(ele);
                    arrowLeftTop.parentNode.removeChild(arrowLeftTop);
                    arrowLeftBottom.parentNode.removeChild(arrowLeftBottom);
                    arrowRightTop.parentNode.removeChild(arrowRightTop);
                    arrowRightBottom.parentNode.removeChild(arrowRightBottom);
                }
                deselectRectA(KARect);
                deselectRectB(KBRect);
            }

        }
    }
}
































/**
 * @Circle Box designing
 */
function onClickGenerateCircle() {
    rows = Number(document.getElementById("input_rows").value);
    cols = Number(document.getElementById("input_cols").value);
    dirs = Number(document.getElementById("input_dirs").value);
    KA = -1;
    KB = -1;

    let textHtml = "";
    arrP = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cx = DX + j * DX;
            cy = DY + i * DY;
            arrP.push({ i: i, j: j, cx: cx, cy: cy, used: 0 });
            let k = i * cols + j;
            textHtml += `<circle id="point${k}" cx="${cx}" cy="${cy}" r="${R}" stroke="${back_color}" stroke-width="4" fill="${no_fill}"/>`;
        }
    }

    conn = [];
    for (let k = 0; k < arrP.length; k++) {
        let tmp = [];
        for (let kk = 0; kk < arrP.length; kk++) tmp.push(false);
        conn.push(tmp);
    }

    function txthtmlofLine(k, kk) {
        let str = "";
        if (k >= 0 && k < arrP.length && kk >= 0 && kk < arrP.length)
            str = `<line x1="${arrP[k].cx}" y1="${arrP[k].cy}" x2="${arrP[kk].cx}" y2="${arrP[kk].cy}" stroke = "${back_color}" style="pointer-events:none;"/>`;

        return { str };
    }

    for (let k = 0; k < arrP.length; k++) {
        let i = arrP[k].i;
        let j = arrP[k].j;
        let kk = (i - 1) * cols + j;
        if (i - 1 >= 0) textHtml += txthtmlofLine(k, kk).str;

        kk = (i - 1) * cols + (j - 1);
        if (dirs === 8 && i - 1 >= 0 && j - 1 >= 0)
            textHtml += txthtmlofLine(k, kk).str;

        kk = i * cols + (j - 1);
        if (j - 1 >= 0) textHtml += txthtmlofLine(k, kk).str;

        kk = (i + 1) * cols + (j - 1);
        if (dirs === 8 && i + 1 < rows && j - 1 >= 0)
            textHtml += txthtmlofLine(k, kk).str;
    }

    let eleSVG = document.getElementById("svg");
    eleSVG.style.width = DX * (cols + 1);
    eleSVG.style.height = DY * (rows + 1);
    eleSVG.innerHTML = textHtml;
    eleSVG.addEventListener("click", onClickSVG);
    eleSVG.addEventListener("mousemove", onMouseMoveSVG);
    eleSVG.addEventListener("mousedown", onMouseDown);
    eleSVG.addEventListener("mouseup", onMouseUp);

    toggleUnused(true);

    for (let k = 0; k < arrP.length; k++) fl.push(0);
}

function onClickSVG(evt) {
    if (!evt.shiftKey) {
        let t = evt.target;
        let cx = t.getAttributeNS(null, "cx");
        let cy = t.getAttributeNS(null, "cy");
        if (t.nodeName !== "circle") return;
        let i, j, k;
        j = (cx - DX) / DX;
        i = (cy - DY) / DY;
        k = i * cols + j;

        if (KA === -1 && KB === -1) selectA(k);
        else if (KA !== -1 && KB == -1 && k !== KA) selectB(k);
        else if (k === KA) deselectA(k);
        else if (k === KB) deselectB(k);
    }
}

function selectA(k) {
    KA = k;
    highlight(k, true);
    document.getElementById("span4a").innerHTML = `x=${k % cols}, y=${Math.floor(
        k / cols
    )}`;
}

function deselectA(k) {
    KA = -1;
    highlight(k, false);
    document.getElementById("span4a").innerHTML = "";
}

function selectB(k) {
    KB = k;
    highlight(k, true);
    document.getElementById("span4b").innerHTML = `x=${k % cols}, y=${Math.floor(
        k / cols
    )}`;
}

function deselectB(k) {
    KB = -1;
    highlight(k, false);
    document.getElementById("span4b").innerHTML = "";
}

function highlight(k, isSelect) {
    let point = document.getElementById(`point${k}`);
    if (isSelect) {
        point.setAttributeNS(null, "stroke", picked_color);
        point.setAttributeNS(null, "fill", picked_fill);
    } else if (arrP[k].used) {
        point.setAttributeNS(null, "stroke", MYCOLORS[fl[k] % NCOLOR]);
        point.setAttributeNS(null, "fill", no_fill);
    } else {
        point.setAttributeNS(null, "stroke", back_color);
        point.setAttributeNS(null, "fill", no_fill);
    }

    for (let kk = 0; kk < arrP.length; kk++) {
        if (conn[k][kk]) {
            //highlight connected lines
            let conndLine = document.getElementById(
                `line_${Math.min(k, kk)}_${Math.max(k, kk)}`
            );
            let conndPoint = document.getElementById(`point${kk}`);

            if (isSelect) {
                conndLine.setAttributeNS(null, "stroke", picked_color);
                conndPoint.setAttributeNS(null, "stroke", picked_color);
            } else {
                conndLine.setAttributeNS(null, "stroke", used_color);
                conndPoint.setAttributeNS(null, "stroke", MYCOLORS[fl[k] % NCOLOR]);
            }
        }
    }
}

function onMouseMoveSVG(evt) {
    let t = evt.target;
    let cx = t.getAttributeNS(null, "cx");
    let cy = t.getAttributeNS(null, "cy");
    if (t.nodeName !== "circle") return;
    let i, j, k;
    j = (cx - DX) / DX;
    i = (cy - DY) / DY;
    k = i * cols + j;
    document.getElementById("span4now").innerHTML = `x=${j}, y=${i}`;
}

function onMouseDown(evt) {
    if (evt.shiftKey) {
        let t = evt.target;
        let cx = t.getAttributeNS(null, "cx");
        let cy = t.getAttributeNS(null, "cy");
        let i, j, k;
        j = (cx - DX) / DX;
        i = (cy - DY) / DY;
        k = i * cols + j;
        if (t.nodeName !== "circle" || arrP[k].used < 1) return;
        KMA = k;
    }
}

function onMouseUp(evt) {
    if (evt.shiftKey) {
        let t = evt.target;
        let cx = t.getAttributeNS(null, "cx");
        let cy = t.getAttributeNS(null, "cy");
        let i, j, k;
        j = (cx - DX) / DX;
        i = (cy - DY) / DY;
        k = i * cols + j;
        if (t.nodeName !== "circle" || arrP[k].used > 0 || KMA < 0) return;

        KMB = k;
        arrP[KMB].used = arrP[KMA].used;
        arrP[KMA].used = 0;

        fl[KMB] = fl[KMA];
        fl[KMA] = 0;

        for (let l = 0; l < conn[KMA].length; l++) {
            if (conn[KMA][l] === true) {
                let conndLineA = document.getElementById(
                    `line_${Math.min(KMA, l)}_${Math.max(KMA, l)}`
                );
                let conndPointA = document.getElementById(`point${KMA}`);
                let conndPointB = document.getElementById(`point${KMB}`);

                conndPointA.setAttributeNS(null, "stroke", back_color);
                conndPointA.setAttributeNS(null, "fill", no_fill);
                conndPointB.setAttributeNS(null, "stroke", MYCOLORS[fl[KMB] % NCOLOR]);
                conndPointB.setAttributeNS(null, "fill", no_fill);

                conndLineA.parentNode.removeChild(conndLineA);
                let ele = parseSVG(`<line id="line_${Math.min(KMB, l)}_${Math.max(KMB, l)}" x1="${arrP[KMB].cx}" y1="${arrP[KMB].cy}" x2="${arrP[l].cx}" y2="${arrP[l].cy}" stroke=${used_color} style="pointer-events:none;"/>`);

                document.getElementById("svg").appendChild(ele);
                conn[KMA][l] = false;
                conn[l][KMA] = false;
                conn[KMB][l] = true;
                conn[l][KMB] = true;
            }
        }
    }
    KMA = -1;
    KMB = -1;
}

function groupColoring() {
    ngroup = 0;
    for (let k = 0; k < arrP.length; k++) fl[k] = 0;
    doGroupColoring();
}

function doGroupColoring() {
    for (let k = 0; k < arrP.length; k++) {
        if (arrP[k].used && !fl[k]) {
            ngroup++;
            DFS(k, ngroup);
        }
    }

    for (let k = 0; k < arrP.length; k++)
        if (arrP[k].used) {
            document
                .getElementById(`point${k}`)
                .setAttributeNS(null, "stroke", MYCOLORS[fl[k] % 12]);
        }
}

function DFS(k, ng) {
    for (let kk = 0; kk < arrP.length; kk++) {
        if (arrP[kk].used && conn[k][kk] && !fl[kk]) {
            fl[kk] = ng;
            DFS(kk, ng);
        }
    }
}

