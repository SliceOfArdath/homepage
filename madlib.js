var pi = Math.PI;
radToDeg = (a) => a * (180 / pi);
radToRev = (a) => a * (.5 / pi);
degToRad = (a) => a * (pi / 180);
degToRev = (a) => a * (.5 / 180);
revToDeg = (a) => a * (180 / .5);
revToRad = (a) => a * (pi / .5);
toogle = (a) => a == false;
norm = (x, y) => Math.sqrt(x ** 2 + y ** 2);
knuth = (a, b, c) => b < 2 || c < 1 ? a ** c : knuth(a, b - 1, knuth(a, b, c - 1))
var rad = pi;
var rev = 1;
var deg = 180;
convertAngle = (a, from, to) => a * (to / from);
var goldenRatio = (Math.sqrt(5) + 1) / 2;
function angle(a, b) {
    if (a == 0) { return Math.PI / 2 * Math.floor(b / Math.abs(b)) }
    else if (a > 0) { return Math.atan(b / a) }
    else { return Math.atan(b / a) + Math.PI }
}
mix = (a, b, d) => (1 - d) * a + d * b;
getMix = (a, b, c) => (c * a) / (c * b);
var rand = {
    seed: 1,
    step: .0005,
    len: 20,
    map: {
        x: 0,
        y: 0,
        elem: [],
        smoothed: []
    },
    noise: function (x = Math.random) {
        var t = 0;
        for (let i = 0; i < rand.len; i++) {
            t += (1 / (i + 1)) ** (1 / 3) * Math.sin(i ** 2 * x * rand.step + rand.seed * (i + 1));
        }
        return .5 * Math.cos(64 * pi * t) + .5
    },
    int: (a, b, x = Math.random()) => Math.round(a + rand.noise(x) * (b - a)),
    real: function (a, b, acc = -1, x = Math.random()) {
        if (acc >= 0) {
            return Math.round((a + rand.noise(x) * (b - a)) * (10 ** acc)) / (10 ** acc)
        }
        return a + Math.random() * (b - a)
    },
    gen2D: function (a, b) {
        rand.map.x = a ; rand.map.y = b;
        for (let y = 0; y < b; y++) {
            var r = [];
            for (let x = 0; x < a; x++) {
                r.push(rand.noise(x + a * y));
            }
            rand.map.elem.push(r);
        }
        for (let y = 0; y < b; y++) {
            var r = [];
            for (let x = 0; x < a; x++) {
                r.push(rand.turbulence(x, y, 64));
            }
            rand.map.smoothed.push(r);
        }
        return rand.map.smoothed
    },
    marble: function (xPeriod = 5, yPeriod = 10, turbPower = 10, turbSize = 64) {
        if (rand.map.elem[1] != undefined) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) {
                    var xyValue = x * xPeriod / rand.map.x + y * yPeriod / rand.map.y + turbPower * rand.turbulence(x, y, turbSize) / 256.0;
                    var sineValue = 256 * Math.abs(Math.sin(xyValue * pi));
                    rand.map.smoothed[y][x] = sineValue;
                }
            }
            return rand.map.smoothed
        } else {
            return 'Error: No map found'
        }
    },
    degrad: function (x, y) {
        var fractX = x - Math.round(x);
        var fractY = y - Math.round(y);
        var x1 = (Math.round(x) + rand.map.x) % rand.map.x;
        var y1 = (Math.round(y) + rand.map.y) % rand.map.y;
        var x2 = (x1 + rand.map.x - 1) % rand.map.x;
        var y2 = (y1 + rand.map.y - 1) % rand.map.y;
        var value = fractX * fractY * rand.map.elem[y1][x1];
        value += (1 - fractX) * fractY * rand.map.elem[y1][x2];
        value += fractX * (1 - fractY) * rand.map.elem[y2][x1];
        value += (1 - fractX) * (1 - fractY) * rand.map.elem[y2][x2];
        return value;
    },
    smooth: function (x, y) {
        var fractX = x - Math.floor(x);
        var fractY = y - Math.floor(y);
        var x1 = (Math.floor(x) + rand.map.x) % rand.map.x;
        var y1 = (Math.floor(y) + rand.map.y) % rand.map.y;
        var x2 = (x1 + rand.map.x - 1) % rand.map.x;
        var y2 = (y1 + rand.map.y - 1) % rand.map.y;
        var value = fractX * fractY * rand.map.elem[y1][x1];
        value += (1 - fractX) * fractY * rand.map.elem[y1][x2];
        value += fractX * (1 - fractY) * rand.map.elem[y2][x1];
        value += (1 - fractX) * (1 - fractY) * rand.map.elem[y2][x2];
        return value;
    },
    smooth3D: function (x, y, z) {
        var fractX = x - Math.floor(x);
        var fractY = y - Math.floor(y);
        var fractZ = z - Math.floor(z);
        var x1 = (Math.floor(x) + rand.map.x) % rand.map.x;
        var y1 = (Math.floor(y) + rand.map.y) % rand.map.y;
        var z1 = (Math.floor(z) + rand.map.z) % rand.map.z;
        var x2 = (x1 + rand.map.x - 1) % rand.map.x;
        var y2 = (y1 + rand.map.y - 1) % rand.map.y;
        var z2 = (z1 + rand.map.z - 1) % rand.map.z;
        var value = fractX * fractY * fractZ * rand.map.elem[z1][y1][x1];
        value += (1 - fractX) * fractY * fractZ * rand.map.elem[z1][y1][x2];
        value += fractX * (1 - fractY) * fractZ * rand.map.elem[z1][y2][x1];
        value += (1 - fractX) * (1 - fractY) * fractZ * rand.map.elem[z1][y2][x2];
        value += fractX * fractY * (1 - fractZ) * rand.map.elem[z2][y1][x1];
        value += (1 - fractX) * fractY * (1 - fractZ) * rand.map.elem[z2][y1][x2];
        value += fractX * (1 - fractY) * (1 - fractZ) * rand.map.elem[z2][y2][x1];
        value += (1 - fractX) * (1 - fractY) * (1 - fractZ) * rand.map.elem[z2][y2][x2];
        return value;
    },
    turbulence: function (x, y, size) {
        var value = 0, initialSize = size;
        while (size >= 1) {
            value += rand.smooth(x / size, y / size) * size;
            size /= 2;
        }
        return (128 * value / initialSize);
    },
    turb3D: function (x, y, z, size) {
        var value = 0, initialSize = size;
        while (size >= 1) {
            value += rand.smooth3D(x / size, y / size, z / size) * size;
            size /= 2;
        }
        return (128 * value / initialSize);
    },
    wood: function (xyPeriod = 7, turbPower = .1, turbSize = 32) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                var xValue = (x - rand.map.x / 2) / rand.map.x;
                var yValue = (y - rand.map.y / 2) / rand.map.y;
                var distValue = norm(xValue, yValue) + turbPower * rand.turbulence(x, y, turbSize) / 256;
                var sineValue = 256 * Math.abs(Math.sin(2 * xyPeriod * distValue * pi));
                rand.map.smoothed[y][x] = sineValue;
            }
        }
        return rand.map.smoothed
    },
    level: function (density = 1, turbPower = 5, turbSize = 64) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                rand.map.smoothed[y][x] = mix(rand.map.smoothed[y][x], rand.turbulence(x, y, turbSize), .72)
            }
        }
        return rand.map.smoothed
    },
    quadr: function (xPeriod = 32, yPeriod = 32, turbPower = 5, turbSize = 64) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                var xValue = (x - rand.map.x / 2) / rand.map.x + turbPower * rand.turbulence(x, y, turbSize) / 256;
                var yValue = (y - rand.map.y / 2) / rand.map.y + turbPower * rand.turbulence(rand.map.y - y, rand.map.x - x, turbSize) / 256;
                var sineValue = 128 * Math.abs(Math.sin(xPeriod * xValue * pi) + Math.sin(yPeriod * yValue * pi));
                rand.map.smoothed[y][x] = sineValue;
            }
        }
        return rand.map.smoothed
    },
    gen3D: function (a, b, c) {
        rand.map.x = a ; rand.map.y = b; rand.map.z = c;
        for (let z = 0; z < c; z++) {
            var r = [];
            for (let y = 0; y < b; y++) {
                var pre = [];
                for (let x = 0; x < a; x++) {
                    pre.push(rand.noise(x + a * y + a * b * z * 20));
                }
                r.push(pre);
            }
            rand.map.elem.push(r);
        }
        for (let z = 0; z < c; z++) {
            var r = [];
            for (let y = 0; y < b; y++) {
                var pre = [];
                for (let x = 0; x < a; x++) {
                    pre.push(rand.turb3D(x, y, z, 64));
                }
                r.push(pre);
            }
            rand.map.smoothed.push(r);
        }
        return rand.map.smoothed
    }
};
var sound = {
    bank: {},
    sources: {},
    init: function () {
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        } catch (e) { alert('Web Audio API is not supported in this browser'); }
    },
    load: function (url, bufferName, vol = 1) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                sound.bank[bufferName] = buffer;
            }/*, onError*/);
        }
        sound.sources[bufferName] = sound.createSource(sound.bank[bufferName]);
        sound.sources[bufferName].gainNode.gain.value = vol * vol;
        request.send();
    },
    toogleLoop: function (buffer) {
        /*if (this.source.loop) { this.source.loop = false; }
        else { this.source.loop = true; }*/
        if (sound.sources[buffer].source.loop == true) { sound.sources[buffer].source.loop = false; }
        else { sound.sources[buffer].source.loop = true; }
    },
    gain: function (bufferName, vol) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var source = context.createBufferSource();
        source.connect(context.destination);
        var gainNode = context.createGain();
        // Connect the source to the gain node.
        source.connect(gainNode);
        // Connect the gain node to the destination.
        gainNode.connect(context.destination);
        // Reduce the volume.
        gainNode.gain.value = vol;
    },
    play: function (buffer, vol = 1, loop = false) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var source = context.createBufferSource();
        sound.sources[buffer] = sound.createSource(sound.bank[buffer]);
        sound.sources[buffer].source.loop = loop;
        sound.sources[buffer].gainNode.gain.value = vol * vol;
        sound.sources[buffer].source.start(0);

    },
    pause: function (buffer) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var source = context.createBufferSource();
        sound.sources[buffer].source.stop(0);
    },
    createSource: function (buffer) {
        var source = context.createBufferSource();
        var gainNode = context.createGain ? context.createGain() : context.createGainNode();
        source.buffer = buffer;
        // Connect source to gain.
        source.connect(gainNode);
        // Connect gain to destination.
        gainNode.connect(context.destination);

        return {
            source: source,
            gainNode: gainNode
        };
    }
};
window.addEventListener('load', sound.init, false);
var bubble = {
    data: [],
    settings: {
        rangeEffectArea: 100,
        generalBehavior: 0,
        generalRangeEffect: 0,
        restricted: false,
        restrictions: { xMin: 0, xMax: 1, yMin: 0, yMax: 1 }
    },
    restrict: function (x1, x2, y1, y2) {
        bubble.settings.restrictions.xMin = x1; bubble.settings.restrictions.xMax = x2; bubble.settings.restrictions.yMin = y1; bubble.settings.restrictions.yMax = y2; bubble.settings.restricted = true;
    },
    create: function (x, y, speed = 5, rs = .1, angle = 0) {
        this.data.push({ angle: angle, x: x, y: y, rspeed: rs, speed: speed });
        return this.data[this.data.length - 1]
    },
    delete: function (i) {
        var a = this.data.slice(i + 1);
        var b = this.data.slice(0, i);
        var d = this.data[i];
        this.data = b.concat(a);
        return d
    },
    tick: function (i, x, y, t, behavior = bubble.settings.generalBehavior, rangeEffect = bubble.settings.generalRangeEffect, homing = false) {
        var dx = x - bubble.data[i].x;
        var dy = y - bubble.data[i].y;
        var cAngle = Math.atan2(dy, dx);
        var norme = norm(dx, dy);
        if (behavior != 0) {
            if (behavior == -1) { behavior = 0; }
            if (homing == true) {
                var diff = cAngle - bubble.data[i].angle;
                var rs = bubble.data[i].rspeed * t;
                if (diff > pi) { diff += pi * 2; }
                else if (diff < -pi) { diff += pi * 2; }
                if (diff > rs) { bubble.data[i].angle += rs + pi + pi * behavior; }
                else if (diff < -rs) { bubble.data[i].angle -= rs + pi + pi * behavior; }
                else { bubble.data[i].angle = cAngle + pi + pi * behavior; }
            } else { bubble.data[i].angle = cAngle + pi + pi * behavior; }
        }
        if (bubble.data[i].angle > pi) { bubble.data[i].angle -= 2 * pi; }
        if (bubble.data[i].angle < -pi) { bubble.data[i].angle += 2 * pi; }
        x = bubble.data[i].x; y = bubble.data[i].y;
        x += Math.cos(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme ** 2 + 1)));
        y += Math.sin(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme ** 2 + 1)));
        if (this.settings.restricted) {
            /*
            if (bubble.settings.restrictions.xMin >= x || bubble.settings.restrictions.xMax <= x) { bubble.data[i].angle = pi - bubble.data[i].angle; }
            // else if () { bubble.data[i].angle = pi - bubble.data[i].angle; }
            if (bubble.settings.restrictions.yMin >= y || bubble.settings.restrictions.yMax <= y) { bubble.data[i].angle = -bubble.data[i].angle; }
            // else if () { bubble.data[i].angle = 2 * pi - bubble.data[i].angle; }
            x = bubble.data[i].x; y = bubble.data[i].y;
            x += Math.cos(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme + 10)));
            y += Math.sin(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme + 10)));
            */
        }
        bubble.data[i].x = x; bubble.data[i].y = y;
        return this.data[i]
    },
    edit: function (i, x, y, speed = 5, rs = .1, angle = 0) { this.data[i] = { angle: angle, x: x, y: y, rspeed: rs, speed: speed }; }
};
//2D block game handler
var texture = {
    size: 32,
    pos: (x, y) => [size * x, size * y],
};
var tile = {
    Block: function (item) { tile.blocks[tile.blocks.length] = item },
    randomTicks: function () {},
    onTick: function () {},
    blocks: []
};
    //redesign this
var coords = {
    x: 0,
    y: 0,
    blocks: []
};
//Interactive typing
var text = {
    lps: 15,
    to: "undefined",
    letter: function (ltr) { this.to += ltr; },
    pointer: 0,
    string: [],
    startSay: function (str) { this.to = ''; text.pointer = 0; text.string = str.split(''); text.say(); },
    say: function () { if (text.string.length > text.pointer) { text.letter(text.string[text.pointer]); effect(); text.pointer++; setTimeout(text.say, 1000 / text.lps); } }
};
//motions
var cursor = {
    enable: false,
    x: 1,
    y: 1
};
var key = {
    spd: 5,
    enable: false,
    restrict: false,
    restrictions: function (x1, x2, y1, y2) {
        key.border.xMin = x1; key.border.xMax = x2; key.border.yMin = y1; key.border.yMax = y2; key.restrict = true;
    },
    border: { xMin: 0, xMax: 1, yMin: 0, yMax: 1 },
    pos: {
        x: 100,
        y: 100
    },
    state: [],
    val: {},
    act: {}
};
function setKeyVal(k) { key.state[key.state.length] = k; key.val[k] = false; }
function setKeyAct(k, act) { key.act[k] = act; }
setKeyVal("ArrowUp")
setKeyVal("ArrowDown")
setKeyVal("ArrowLeft")
setKeyVal("ArrowRight")
document.addEventListener("keydown", function (e) {
    e = e || event; // to deal with IE
    key.val[e.code] = e.type == 'keydown';
});
document.addEventListener("keyup", function (e) {
    e = e || event; // to deal with IE
    key.val[e.code] = e.type == 'keydown'
    if (event.code == "Escape") { pause() }
});
function keymotion() {
    var t = 0;
    if (key.enable) {
        pre();
        for (let t = 0; t < key.state.length; t++) {
            i = key.val[key.state[t]];
            if (i == true) { key.act[key.state[t]](); }
        }
        if (key.restrict) {
            if (key.border.xMin >= key.pos.x) { key.pos.x = key.border.xMin; }
            else if (key.border.xMax <= key.pos.x) { key.pos.x = key.border.xMax; }
            if (key.border.yMin >= key.pos.y) { key.pos.y = key.border.yMin; }
            else if (key.border.yMax <= key.pos.y) { key.pos.y = key.border.yMax; }
        }
        post();
    }
}
function load() { if (key.enable) { keymotion(); } }
setKeyAct("ArrowUp", "function up() { key.pos.y -= key.spd; }")
setKeyAct("ArrowDown", "function down() { key.pos.y += key.spd; }")
setKeyAct("ArrowLeft", "function left() { key.pos.x -= key.spd; }")
setKeyAct("ArrowRight", "function right() { key.pos.x += key.spd; }")
document.addEventListener("mousemove", function (e) {
    if (cursor.enable) { pre() }
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    if (cursor.enable) { post() }
});