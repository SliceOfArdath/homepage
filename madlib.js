console.info("madlib.js up and running, version 0.7.5")
var pi = Math.PI; var goldenRatio = (Math.sqrt(5) + 1) / 2; var rad = pi; var rev = 0.5; var deg = 180;
radToDeg = (a) => a * (180 / pi);
radToRev = (a) => a * (.5 / pi);
degToRad = (a) => a * (pi / 180);
degToRev = (a) => a * (.5 / 180);
revToDeg = (a) => a * (180 / .5);
revToRad = (a) => a * (pi / .5);
convertAngle = (a, from, to) => a * (to / from);
toogle = (a) => a == false;
mix = (a, b, d) => (1 - d) * a + d * b;
getMix = (a, b, c) => (c - a) / (b - a);
norm = (x, y) => Math.sqrt(x ** 2 + y ** 2);
knuth = (a, b, c) => b < 2 || c < 1 ? a ** c : knuth(a, b - 1, knuth(a, b, c - 1));
sortgrow = (array) => array.sort(function (a, b) { return a - b; });
function periodicBrute(generator, range, acc = 0, len = 1, inc = 1) {
    if (len > 1) {
        var t = []; var c = 0;
        for (let i = 0; i < len; i += inc) { t[i] = generator(); }
        for (let i = 0; i < range; i += inc) {
            var a = generator();
            if (acc != 0) { if (Math.round(acc * t[c]) == Math.round(acc * a)) if (c++, c == len) return i }
            else { if (t[c] == a) if (c++, c == len) return i }
        }
    } else {
        var t = generator();
        for (let i = 0; i < range; i += inc) {
            var a = generator();
            if (acc != 0) { if (Math.round(acc * t) == Math.round(acc * a)) return i }
            else { if (t == a) return i }
        }
    }
    return 'No periodicity found for current range and accuracy.'
}
function total(array) {
    var t = 0;
    for (let i = 0; i < array.length; i++) t += array[i];
    return t
}
function ncdf(x, mean, std) {
    var x = (x - mean) / std;
    var t = 1 / (1 + .2315419 * Math.abs(x));
    var d = .3989423 * Math.exp(-x * x / 2);
    var prob = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob
    return prob
}
function angle(a, b) {
    if (a == 0) return Math.PI / 2 * Math.floor(b / Math.abs(b))
    else if (a > 0) return Math.atan(b / a)
    else return Math.atan(b / a) + Math.PI
}
var stats = {
    arr: [],
    create: function () { stats.arr[stats.arr.length] = { li: [] }; },
    sigma: function (array, moy) {
        var t = 0;
        for (let i = 0; i < array.length; i++) t += (array[i] - moy) ** 2;
        return t / array.length
    },
    distr: function (array) {
        array = sortgrow(array);
        var g = 0;
        var s = 1;
        for (let i = 0; i < array.length - 1; i++) {
            var t = Math.abs(array[i] - array[i + 1]);
            if (t > g) g = t; else if (t < s) s = t;
        }
        return [g, s]
    },
    get: function (n) {
        stats.arr[n].xMax = stats.arr[n].li.reduce(function (a, b) { return Math.max(a, b); });
        stats.arr[n].xMin = stats.arr[n].li.reduce(function (a, b) { return Math.min(a, b); });
        (stats.arr[n].li.length / 2 != Math.round(stats.arr[n].li.length / 2) ? stats.arr[n].med = mix(stats.arr[n].li[stats.arr[n].li.length / 2 - 0.5], stats.arr[n].li[stats.arr[n].li.length / 2 + 0.5], 0.5) : stats.arr[n].med = stats.arr[n].li[stats.arr[n].li.length / 2]);
        stats.arr[n].q1 = stats.arr[n].li[Math.round(stats.arr[n].li.length / 4)];
        stats.arr[n].q3 = stats.arr[n].li[Math.round(3 * stats.arr[n].li.length / 4)];
        stats.arr[n].moy = total(stats.arr[n].li) / stats.arr[n].li.length;
        stats.arr[n].standEq = stats.sigma(stats.arr[n].li, stats.arr[n].moy);
        stats.arr[n].standErr = stats.arr[n].standEq / Math.sqrt(stats.arr[n].li.length);
        stats.arr[n].var = stats.arr[n].standEq ** 2;
        stats.arr[n].distr = stats.distr(stats.arr[n].li)
        return stats.arr[n]
    }
};
var rand = {
    seed: 0,
    setup: function (x) {
        this.seed = x;
        this.mod = 1/Math.sqrt(x);
        this.mult = Math.sqrt(this.mod*goldenRatio);
        this.step = 1/(this.mult**2);
        this.xlc = Math.sqrt(this.mult+this.mod+this.step);
    },
    step: .05,
    len: 20,
    xlc: 0,
    mult: 1.0932,
    mod: 1.1,
    sourceLcg: [],
    map: {
        x: 0,
        y: 0,
        elem: [],
        smoothed: []
    },
    preGenLCG: function (n) {
        for (let i = 0; i < n; i++) {
            rand.xlc = (rand.mult * rand.xlc + rand.step) % rand.mod;
            rand.sourceLcg[n] = rand.xlc;
        }
    },
    lcg: function () {
        rand.xlc = (rand.mult * rand.xlc + rand.step) % rand.mod;
        return rand.xlc / rand.mod
    },
    xlcg: function (n) {
        for (let i = 0; i < n; i++) rand.xlc = (rand.mult * rand.xlc + rand.step) % rand.mod;
        return rand.xlc / rand.mod
    },
    noise: function (x = Math.random) {
        //Note : deprecated, use rand.lcg() instead. 
        var t = 0;
        for (let i = -Math.ceil(rand.len / 2); i < Math.floor(rand.len / 2); i++) t += (1 / (i + 1 + Math.ceil(rand.len / 2))) ** (1 / 3) * Math.sin(i ** 2 * x * rand.step + rand.seed * (i + 1));
        return .5 * Math.cos(64 * pi * t) + .5
    },
    int: (a, b, x = Math.random()) => Math.round(a + rand.noise(x) * (b - a)),
    real: function (a, b, acc = -1, x = Math.random()) {
        return (acc >= 0 ? Math.round((a + Math.random() * (b - a)) * (10 ** acc)) / (10 ** acc) : a + Math.random() * (b - a))
    },
    gen2D: function (a, b, turb = true, lcg = true) {
        rand.map.x = a; rand.map.y = b;
        if (lcg) {
            for (let y = 0; y < b; y++) {
                var r = [];
                for (let x = 0; x < a; x++) r.push(rand.lcg());
                rand.map.elem.push(r);
            }
            if (turb) {
                for (let y = 0; y < b; y++) {
                    var r = [];
                    for (let x = 0; x < a; x++) r.push(rand.turbulence(x, y, 64));
                    rand.map.smoothed.push(r);
                }
                return rand.map.smoothed
            } else {
                for (let y = 0; y < b; y++) {
                    var r = [];
                    for (let x = 0; x < a; x++) r.push(0);
                    rand.map.smoothed.push(r);
                }
                return rand.map.elem
            }
        } else {
            for (let y = 0; y < b; y++) {
                var r = [];
                for (let x = 0; x < a; x++) r.push(rand.noise(x + a * y));
                rand.map.elem.push(r);
            }
            if (turb) {
                for (let y = 0; y < b; y++) {
                    var r = [];
                    for (let x = 0; x < a; x++) r.push(rand.turbulence(x, y, 64));
                    rand.map.smoothed.push(r);
                }
                return rand.map.smoothed
            } else {
                for (let y = 0; y < b; y++) {
                    var r = [];
                    for (let x = 0; x < a; x++) r.push(0);
                    rand.map.smoothed.push(r);
                }
                return rand.map.elem
            }
        }
    },
    marble: function (xPeriod = 5, yPeriod = 10, turbPower = 10, turbSize = 64) {
        if (rand.map.elem[1] != undefined) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) {
                    var xyValue = x * xPeriod / rand.map.x + y * yPeriod / rand.map.y + turbPower * rand.turbulence(x, y, turbSize);
                    var sineValue = Math.abs(Math.sin(xyValue * pi));
                    rand.map.smoothed[y][x] = sineValue;
                }
            }
            return rand.map.smoothed
        } else { return 'Error: No map found' }
    },
    marbleDeep: function (xPeriod = 5, yPeriod = 10, turbPower = 10, turbSize = 64) {
        //WARNING: The deep system should not be used for animation. Use 3D alternative instead.
        if (rand.map.elem[1] != undefined) {
            for (z = 0; z < rand.map.z; z++) {
                for (y = 0; y < rand.map.y; y++) {
                    for (x = 0; x < rand.map.x; x++) {
                        var xyzValue = x * xPeriod / rand.map.x + y * yPeriod / rand.map.y + turbPower * rand.turbDeep(x, y, z, turbSize);
                        var sineValue = Math.abs(Math.sin(xyzValue * pi));
                        rand.map.smoothed[z][y][x] = sineValue;
                    }
                }
            }
            return rand.map.smoothed
        } else { return 'Error: No map found' }
    },
    marble3D: function (xPeriod = 5, yPeriod = 10, zPeriod = 5, turbPower = 10, turbSize = 64) {
        if (rand.map.elem[1] != undefined) {
            for (z = 0; z < rand.map.z; z++) {
                for (y = 0; y < rand.map.y; y++) {
                    for (x = 0; x < rand.map.x; x++) {
                        var xyzValue = x * xPeriod / rand.map.x + y * yPeriod / rand.map.y + z * zPeriod / rand.map.z + turbPower * rand.turb3D(x, y, z, turbSize);
                        var sineValue = Math.abs(Math.sin(xyzValue * pi));
                        rand.map.smoothed[z][y][x] = sineValue;
                    }
                }
            }
            return rand.map.smoothed
        } else { return 'Error: No map found' }
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
        return value
    },
    smoothDeep: function (x, y, z) {
        //WARNING: The deep system should not be used for animation. Use 3D alternative instead.
        var fractX = x - Math.floor(x);
        var fractY = y - Math.floor(y);
        var x1 = (Math.floor(x) + rand.map.x) % rand.map.x;
        var y1 = (Math.floor(y) + rand.map.y) % rand.map.y;
        var x2 = (x1 + rand.map.x - 1) % rand.map.x;
        var y2 = (y1 + rand.map.y - 1) % rand.map.y;
        var value = fractX * fractY * rand.map.elem[z][y1][x1];
        value += (1 - fractX) * fractY * rand.map.elem[z][y1][x2];
        value += fractX * (1 - fractY) * rand.map.elem[z][y2][x1];
        value += (1 - fractX) * (1 - fractY) * rand.map.elem[z][y2][x2];
        return value
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
        return value
    },
    turbDeep: function (x, y, z, size) {
        //WARNING: The deep system should not be used for animation. Use 3D alternative instead.
        var value = 0, initialSize = size;
        while (size >= 1) value += rand.smoothDeep(x / size, y / size, z) * size, size /= 2;
        return (0.5 * value / initialSize);
    },
    turbulence: function (x, y, size) {
        var value = 0, initialSize = size;
        while (size >= 1) value += rand.smooth(x / size, y / size) * size, size /= 2;
        return (0.5 * value / initialSize);
    },
    turb3D: function (x, y, z, size) {
        var value = 0, initialSize = size;
        while (size >= 1) value += rand.smooth3D(x / size, y / size, z / size) * size, size /= 2;
        return (0.5 * value / initialSize);
    },
    level: function (power = .75, turbSize = 64) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) rand.map.smoothed[y][x] = mix(rand.map.smoothed[y][x], rand.turbulence(x, y, turbSize), power);
        }
        return rand.map.smoothed
    },
    levelDeep: function (power = .75, turbSize = 64) {
        //WARNING: The deep system should not be used for animation. Use 3D alternative instead.
        for (z = 0; z < rand.map.z; z++) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) rand.map.smoothed[z][y][x] = mix(rand.map.smoothed[z][y][x], rand.turbDeep(x, y, z, turbSize), power);
            }
        }
        return rand.map.smoothed
    },
    wood: function (xyPeriod = 7, turbPower = .1, turbSize = 32) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                var xValue = (x - rand.map.x / 2) / rand.map.x;
                var yValue = (y - rand.map.y / 2) / rand.map.y;
                var distValue = norm(xValue, yValue) + turbPower * rand.turbulence(x, y, turbSize);
                var sineValue = Math.abs(Math.sin(2 * xyPeriod * distValue * pi));
                rand.map.smoothed[y][x] = sineValue;
            }
        }
        return rand.map.smoothed
    },
    blur: function () {
        //TODO: Make it work (broken for now)
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                rand.map.smoothed[y][x] = this.smooth(x, y);
            }
        }
        return rand.map.smoothed
    },
    grain: function (strengh, key = 0, lcg = true) {
        //TODO: Repair + check grammar
        if (!lcg) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) rand.map.smoothed[y][x] = mix(rand.map.smoothed[y][x], rand.noise(x + rand.map.x), strengh);
            }
        } else {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) rand.map.smoothed[y][x] = mix(rand.map.smoothed[y][x], rand.lcg(), strengh);
            }
        }
        return rand.map.smoothed
    },
    alevel: function (power = .75, turbSize = 64) {
        //TODO: make it better. NOW.
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) rand.map.smoothed[y][x] = getMix(rand.map.smoothed[y][x], rand.turbulence(x, y, turbSize), power);
        }
        return rand.map.smoothed
    },
    fog: function (force = 1, level = 0) {
        //TODO: fix.
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) rand.map.smoothed[y][x] = ncdf(rand.map.smoothed[y][x] / 256, -level, force);
        }
        return rand.map.smoothed
    },
    level3D: function (power = .75, turbSize = 64) {
        for (z = 0; z < rand.map.z; z++) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) rand.map.smoothed[z][y][x] = mix(rand.map.smoothed[z][y][x], rand.turb3D(x, y, z, turbSize), power);
            }
        }
        return rand.map.smoothed
    },
    quadr: function (xPeriod = 4, yPeriod = 4, turbPower = .2, turbSize = 64) {
        for (y = 0; y < rand.map.y; y++) {
            for (x = 0; x < rand.map.x; x++) {
                var xValue = (x - rand.map.x / 2) / rand.map.x + turbPower * rand.turbulence(x, y, turbSize);
                var yValue = (y - rand.map.y / 2) / rand.map.y + turbPower * rand.turbulence(rand.map.y - y, rand.map.x - x, turbSize);
                var sineValue = 0.5 * Math.abs(Math.sin(xPeriod * xValue * pi) + Math.sin(yPeriod * yValue * pi));
                rand.map.smoothed[y][x] = sineValue;
            }
        }
        return rand.map.smoothed
    },
    quadrDeep: function (xPeriod = 4, yPeriod = 4, turbPower = .2, turbSize = 64) {
        //WARNING: The deep system should not be used for animation. Use 3D alternative instead.
        //TODO: yeah that's the Deep system. Again. Repair needed.
        for (z = 0; z < rand.map.z; z++) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) {
                    var xValue = (x - rand.map.x / 2) / rand.map.x + turbPower * rand.turbDeep(x, y, z, turbSize);
                    var yValue = (y - rand.map.y / 2) / rand.map.y + turbPower * rand.turbDeep(rand.map.y - y, rand.map.x - x, z, turbSize);
                    var sineValue = 0.5 * Math.abs(Math.sin(xPeriod * xValue * pi) + Math.sin(yPeriod * yValue * pi));
                    rand.map.smoothed[z][y][x] = sineValue;
                }
            }
        }
        return rand.map.smoothed
    },
    quadr3D: function (xPeriod = 4, yPeriod = 4, zPeriod = 4, turbPower = .2, turbSize = 64) {
        //TODO: verify the maths
        for (z = 0; z < rand.map.z; z++) {
            for (y = 0; y < rand.map.y; y++) {
                for (x = 0; x < rand.map.x; x++) {
                    var xValue = (x - rand.map.x / 2) / rand.map.x + turbPower * rand.turb3D(x, y, z, turbSize);
                    var yValue = (y - rand.map.y / 2) / rand.map.y + turbPower * rand.turb3D(rand.map.y - y, rand.map.x - x, rand.map.z - z, turbSize);
                    var zValue = (z - rand.map.z / 2) / rand.map.z + turbPower * rand.turb3D(x, y, z, turbSize);
                    var sineValue = 0.5 * Math.abs(Math.sin(xPeriod * xValue * pi) + Math.sin(yPeriod * yValue * pi) + Math.sin(zPeriod * zValue * pi));
                    rand.map.smoothed[z][y][x] = sineValue;
                }
            }
        }
        return rand.map.smoothed
    },
    gen3D: function (a, b, c, turb = true, lcg = true) {
        rand.map.x = a; rand.map.y = b; rand.map.z = c;
        if (lcg) {
            for (let z = 0; z < c; z++) {
                var r = [];
                for (let y = 0; y < b; y++) {
                    var pre = [];
                    for (let x = 0; x < a; x++) pre.push(rand.lcg());
                    r.push(pre);
                }
                rand.map.elem.push(r);
            }
            if (turb) {
                for (let z = 0; z < c; z++) {
                    var r = [];
                    for (let y = 0; y < b; y++) {
                        var pre = [];
                        for (let x = 0; x < a; x++) pre.push(rand.turb3D(x, y, z, 64));
                        r.push(pre);
                    }
                    rand.map.smoothed.push(r);
                }
                return rand.map.smoothed
            } else {
                for (let z = 0; z < c; z++) {
                    var r = [];
                    for (let y = 0; y < b; y++) {
                        var pre = [];
                        for (let x = 0; x < a; x++) pre.push(0);
                        r.push(pre);
                    }
                    rand.map.smoothed.push(r);
                }
                return rand.map.elem
            }
        } else {
            for (let z = 0; z < c; z++) {
                var r = [];
                for (let y = 0; y < b; y++) {
                    var pre = [];
                    for (let x = 0; x < a; x++) pre.push(rand.noise(x + a * y + a * b * z * 20));
                    r.push(pre);
                }
                rand.map.elem.push(r);
            }
            if (turb) {
                for (let z = 0; z < c; z++) {
                    var r = [];
                    for (let y = 0; y < b; y++) {
                        var pre = [];
                        for (let x = 0; x < a; x++) pre.push(rand.turb3D(x, y, z, 64));
                        r.push(pre);
                    }
                    rand.map.smoothed.push(r);
                }
                return rand.map.smoothed
            } else {
                for (let z = 0; z < c; z++) {
                    var r = [];
                    for (let y = 0; y < b; y++) {
                        var pre = [];
                        for (let x = 0; x < a; x++) pre.push(0);
                        r.push(pre);
                    }
                    rand.map.smoothed.push(r);
                }
                return rand.map.elem
            }
        }
    }

};
var sound = {
    //No idea how this even works, DO NOT TOUCH.
    bank: {},
    sources: {},
    init: function () {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        } catch (e) { alert('Web Audio API is not supported in this browser'); }
    },
    load: function (url, bufferName, vol = 1) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                sound.bank[bufferName] = buffer;
            }/*, onError*/);
        }
        sound.sources[bufferName] = sound.createSource(sound.bank[bufferName]);
        sound.sources[bufferName].gainNode.gain.value = vol * vol;
        request.send();
    },
    toogleLoop: function (buffer) { toogle(sound.sources[buffer].source.loop); },
    gain: function (bufferName, vol) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext; context = new AudioContext();
        var source = context.createBufferSource();
        source.connect(context.destination);
        var gainNode = context.createGain();
        source.connect(gainNode);
        gainNode.connect(context.destination);
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
        source.connect(gainNode);
        gainNode.connect(context.destination);
        return { source: source, gainNode: gainNode };
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
        //TODO: boundaries somehow not working. Fix it.
        var dx = x - bubble.data[i].x;
        var dy = y - bubble.data[i].y;
        var cAngle = Math.atan2(dy, dx);
        var norme = norm(dx, dy);
        if (behavior != 0) {
            if (behavior == -1) { behavior = 0; }
            if (homing == true) {
                var diff = cAngle - bubble.data[i].angle;
                var rs = bubble.data[i].rspeed * t;
                if (diff > pi) diff += pi * 2;
                else if (diff < -pi) diff += pi * 2;
                if (diff > rs) bubble.data[i].angle += rs + pi + pi * behavior;
                else if (diff < -rs) bubble.data[i].angle -= rs + pi + pi * behavior;
                else bubble.data[i].angle = cAngle + pi + pi * behavior;
            } else bubble.data[i].angle = cAngle + pi + pi * behavior;
        }
        if (bubble.data[i].angle > pi) bubble.data[i].angle -= 2 * pi;
        if (bubble.data[i].angle < -pi) bubble.data[i].angle += 2 * pi;
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
//TODO: Sort. This. Fucking. Mess.
//TODO: From there...
//2D block game handler
var tiled = {
    texture: { size: 8, pos: (x, y) => [texture.size * x, texture.size * y], },
    blocks: [],
    map: [],
};
var texture = {
    size: 8,
    pos: (x, y) => [texture.size * x, texture.size * y],
};
var tile = {
    Block: function (item) { tile.blocks[tile.blocks.length] = item },
    randomTicks: function () { },
    onTick: function () { },
    blocks: [
    ],
    transitions: [
    ]
};
//redesign this
var coords = {
    x: 0,
    y: 0,
    medium: [],
    caves: []
};
//TODO: ...to here.

//Interactive typing
var text = {
    lps: 15,
    to: "undefined",
    letter: function (ltr) { this.to += ltr; },
    pointer: 0,
    string: [],
    startSay: function (str) { this.to = ''; text.pointer = 0; text.string = str.split(''); text.say(); },
    say: function () { if (text.string.length > text.pointer) text.letter(text.string[text.pointer]); effect(); text.pointer++; setTimeout(text.say, 1000 / text.lps); }
};
//(cursor) motions
var cursor = {
    enable: false,
    x: 1,
    y: 1
};
//TODO: clean
//keyboard
var key = {
    spd: 5,
    enable: false,
    restrict: false,
    restrictions: function (x1, x2, y1, y2) {
        key.border.xMin = x1; key.border.xMax = x2; key.border.yMin = y1; key.border.yMax = y2; key.restrict = true;
    },
    border: { xMin: 0, xMax: 1, yMin: 0, yMax: 1 },
    pos: { x: 100, y: 100 },
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
            if (key.border.xMin >= key.pos.x) key.pos.x = key.border.xMin;
            else if (key.border.xMax <= key.pos.x) key.pos.x = key.border.xMax;
            if (key.border.yMin >= key.pos.y) key.pos.y = key.border.yMin;
            else if (key.border.yMax <= key.pos.y) key.pos.y = key.border.yMax;
        }
        post();
    }
}
function load() { if (key.enable) keymotion(); }
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