var mdlUpdateLogs = [
    {
        v: 'beta 0.8.6',
        log: [
            '+ Added full log-printing support for library and any attached file.',
            '+ Added full log-loading support for library and any attached file.',
            ': Edited logs colors.',
            ': Edited log printing for more readability.'
        ]
    },
    {
        v: 'beta 0.9.0',
        log: [
            '!+ New log system.',
            ['->', 'Custom Log:',
                '+ Prior to any log printing you will now need to call logs.setup([optional custom color set]) to ensure a good highlighting.',
                '+ Added logs.colorSet.add ',
                '+ Added logs.load for loading an update log.',
                '+ Added logs.csl for log printing. We do not recommend its direct usage for log printing as you shoud use logs.load for this.',
                '+ Added color sets to enable color customisation.',
                '+ Color sets are able to set default colors, and sublevels forms.',
                '+ Full sublevels support.',
                ': Maintained total retrocompatibility.'
            ],
            ': Technical changes done to tiled.EditChunk.',
            '- Old update log system now obsolete and removed.',
            '- Old lod printing system now obsolete and removed.',
            '- Removed the color set add function as it had no use.'
        ]
    },
    {
        v: 'beta 0.9.2',
        log: [
            '!: Changed the system for adding new color sets:',
            ['->', 'Color sets edition:',
                '+ Put the color set add function back on as it have an use now.',
                'You now need to add a set prior to its enabling.',
                '+ Added logs.disable to disable sets.',
                '+ Added logs.enable to enable sets.',
                'logs.enable should be used as a replacement for the deprecated logs.setup.'
            ],
            ': Various bugfixes.',
            '- No support for total highlighting yet due to technical limitations.'
        ]
    },
    {
        v: 'beta 0.10.0',
        log: [
            '!+ New 2D game handler:',
            ['->', '2D Tiled Games:',
                '+ Call World to generate a full world.',
                '+ Region types supported, you can have multiple regions of the same type.',
                '+ Able to fill, edit and create chunks',
            ],
            ': Fixed a bug where generating random arrays over and over would expand them more and more.',
            ': Increased pain and entropy.'
        ]
    },
    {
        v: 'beta 0.11.0',
        log: [
            '!+ New 2D platformer game handler:',
            ['->', '2D Platformer:',
                '+ You can build squares and circles.',
                '+ You can link your display canvas to the module so it handles most of the work.',
                '+ Collison checking and solving is a thing.',
                '+ Added the player item to help diffetiate.',
                '!+ Two modes of display:',
                ['->', 'Display modes:',
                    '? Partial: Edit the items that are affected by the changes.',
                    '? Complete/Full: Display the whole map each time.',
                    'You can use full mode anyways by calling the display function.',
                    '? In full display mode the items will be displayed by their index which can be edited.'
                ],
            ],
            '+ Added max, min, and copy to array prototypes.',
            '+ Baked some more potatoes.',
            ': Fixed a bug where javascript would do a mess with this. Or this.this. I honestly don\'t know.',
        ]
    },
];
var logs = {
    colorSet: {
        list: [],
        add: function (name, set) {
            logs.colorSet[name] = set;
        },
        current: {},
        default: {
            start: [["", "color:grey", "   ->  "], ["+", "color:#4CAF50"], ["?", "color:#D81B60"], ["!+", "color:#4CAF50; font-weight:bold; font-size:13px;"], [":", "color:#FF9822"], ["!:", "color:#FF9822; font-weight:bold; font-size:13px;"], ["-", "color:#B71C1C"], [";", "color:#9C27B0"]],
            in: [["[", "color:#FF9822", "]"], ["<", "color:#9C27B0", ">"], ['"', "color:grey", '"']],
            arr: [["", "color:black", "   ->  "], ["->"]]
        }
    },
    disable: function (name) {
        var a = logs.colorSet.list.indexOf(name);
        if (a != -1) {
            logs.colorSet.list.splice(a);
        }
        logs.colorSet.current = {};
        for (let i = 0; i < logs.colorSet.list.length; i++) {
            logs.colorSet.current = { ...logs.colorSet.current, ...logs.colorSet[logs.colorSet.list[i]] };
        }
        return a
    },
    enable: function (name = 'default') {
        logs.colorSet.list.push(name);
        logs.colorSet.current = { ...logs.colorSet.current, ...logs.colorSet[name] };
        return logs.colorSet.list.length - 1
    },
    setup: function (colorSet = logs.colorSet.default) {
        //deprecated. use logs.enable instead. 
        logs.colorSet.current = { ...logs.colorSet.current, ...logs.colorSet.default, ...colorSet };
    },
    csl: function (arr, type = 'List', open = false, color = 'default') {
        if (open) console.group(type);
        else console.groupCollapsed(type);
        for (let i = 0; i < arr.length; i++) {
            if (typeof (arr[i]) != "object") {
                /*for (let j = 0; j < logs.colorSet.current.in.length; j++) {
                    if (arr[i].indexOf(logs.colorSet.current.in[j][0])) {

                    }
                }*/
                for (let j = logs.colorSet.current.start.length - 1; j >= 0; j--) {
                    if (logs.colorSet.current.start[j][0] == "") {
                        if (logs.colorSet.current.start[j][2]) console.log('%c' + logs.colorSet.current.start[j][2] + arr[i], (color == 'default' ? logs.colorSet.current.start[j][1] : color));
                        else console.log('%c' + arr[i], (color == 'default' ? logs.colorSet.current.start[j][1] : color));
                        j = -1;
                    }
                    else if (arr[i].substring(0, logs.colorSet.current.start[j][0].length) == logs.colorSet.current.start[j][0]) {
                        if (logs.colorSet.current.start[j][2]) console.log('%c' + logs.colorSet.current.start[j][2] + arr[i], (color == 'default' ? logs.colorSet.current.start[j][1] : color));
                        else console.log('%c' + arr[i], (color == 'default' ? logs.colorSet.current.start[j][1] : color));
                        j = -1;
                    }
                }
            } else {
                for (let j = logs.colorSet.current.arr.length - 1; j >= 0; j--) {
                    if (logs.colorSet.current.arr[j][0] == "") {
                        if (logs.colorSet.current.arr[j][2]) console.log('%c' + logs.colorSet.current.arr[j][2] + arr[i], logs.colorSet.current.arr[j][1]);
                        else console.log('%c' + arr[i], logs.colorSet.current.arr[j][1])
                        j = -1;
                    }
                    else if (arr[i][0] == logs.colorSet.current.arr[j][0]) {
                        logs.csl(arr[i].slice(2, arr[i].length), arr[i][1], false, (logs.colorSet.current.arr[j][1] ? logs.colorSet.current.arr[j][1] : 'default'));
                        j = -1
                    }
                }
            }
        }
        console.groupEnd();
    },
    load: function (target, version, open = false) {
        var v = -1;
        for (let i = 0; i < target.length; i++) {
            if (target[i].v == version) v = i, i = target.length;
        }
        if (v >= 0) logs.csl(target[v].log, 'Update logs for ' + version, open);
        else return 'No logs for this version.'
    }
}
logs.enable();
console.info("madlib.js up and running, version " + mdlUpdateLogs[mdlUpdateLogs.length - 1].v);
logs.load(mdlUpdateLogs, mdlUpdateLogs[mdlUpdateLogs.length - 1].v);
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
delta = (a, b, c) => b ** 2 - 4 * a * c;
isMultipleOf = (i, a) => i / a == Math.abs(i / a);
Array.prototype.max = function () { return Math.max.apply(null, this); }
Array.prototype.min = function () { return Math.min.apply(null, this); }
Array.prototype.copy = function () { return JSON.parse(JSON.stringify(this)); }
function toTimeFormat(a) {
    var r = "";
    var powers = [365.25 * 24 * 60 * 60000, 24 * 60 * 60000, 60 * 60000, 60000, 1000, 1]
    var suffix = ['years', 'days', 'hours', 'minutes', 'seconds', 'miliseconds']
    for (let i = 0; i < powers.length; i++) {
        if (Math.floor(a / powers[i])) r += Math.floor(a / powers[i]) + " " + suffix[i] + ", ", a -= Math.floor(a / powers[i]) * powers[i];
    }
    return r
}
function getAllProperties(o) {
    var names = Object.getOwnPropertyNames(o);
    var prop = [];
    for (let i = 0; i < names.length; i++) {
        prop[i] = o[names[i]];
    }
    return [names, prop]
    /*var objectToInspect;
    var result = [];
    for(objectToInspect = o;
        objectToInspect !== null;
        objectToInspect = Object.getPrototypeOf(objectToInspect)){  
      result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
    }
    return result; */
}
function periodicBrute(generator, range, acc = 0, len = 1, inc = 1) {
    var max = 0; var min = 1;
    if (len > 1) {
        var t = []; var c = 0;
        for (let i = 0; i < len; i += inc) { t[i] = generator(); }

        for (let i = 0; i < range; i += inc) {
            var a = generator();
            if (max < a) max = a;
            else if (min > a) min = a;
            if (acc != 0) { if (Math.round(acc * t[c]) == Math.round(acc * a)) if (c++, c == len) return [i, min, max] }
            else { if (t[c] == a) if (c++, c == len) return [i, min, max] }
        }
    } else {
        var t = generator();
        for (let i = 0; i < range; i += inc) {
            var a = generator();
            if (max < a) max = a;
            else if (min > a) min = a;
            if (acc != 0) { if (Math.round(acc * t) == Math.round(acc * a)) return [i, min, max] }
            else { if (t == a) return [i, min, max] }
        }
    }
    return ['No periodicity found for current range and accuracy.', min, max]
}
function total(array) {
    array = array.flat(Infinity);
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
        this.mod = 1 / Math.sqrt(x);
        this.mult = Math.sqrt(this.mod * goldenRatio);
        this.step = 1 / (this.mult ** 2);
        this.xlc = Math.sqrt(this.mult + this.mod + this.step);
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
    int: (a, b, x = Math.random()) => Math.round(a + rand.lcg() * (b - a)),
    real: function (a, b, acc = -1, x = Math.random()) {
        return (acc >= 0 ? Math.round((a + Math.random() * (b - a)) * (10 ** acc)) / (10 ** acc) : a + Math.random() * (b - a))
    },
    gen2D: function (a, b, turb = true, lcg = true) {
        rand.map.x = a; rand.map.y = b; rand.map.smoothed = []; rand.map.elem = [];
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
        rand.map.x = a; rand.map.y = b; rand.map.z = c; rand.map.smoothed = []; rand.map.elem = [];
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
var platformer = {
    map: [],
    display: undefined,
    bgc: undefined,
    player: {},
    settings: { g: -9.8 },
    respawn: function (x, y, w, h, jumpHeight, accTime, decelTime, maxSpd, isTransparent = false, isVisible = false, color = '', index = -1) {
        platformer.player = { pos: [x, y], size: [w, h], isTransparent: isTransparent, isVisible: isVisible, color: color, index: index, speed: [0, 0], jumpHeight: jumpHeight, spdTime: [accTime, decelTime], maxMotionSpd: maxSpd }
    },
    plJump: function () {
        if (!platformer.isPlayerFalling()) {
            platformer.player.speed[1] = platformer.player.jumpHeight;
            return platformer.player.jumpHeight;
        } return 0
    },
    plDisp: function (show) {
        if (show) platformer.display.getContext("2d").fillStyle = platformer.player.color;
        else platformer.display.getContext("2d").fillStyle = platformer.bgc;
        platformer.display.getContext("2d").fillRect(platformer.player.pos[0], platformer.player.pos[1], platformer.player.size[0], platformer.player.size[1]);
    },
    plMove: function (dir) {
        platformer.plDisp(false);
        platformer.player.speed[0] = platformer.player.maxMotionSpd * (dir == 'right' ? 1 : -1);
        platformer.player.pos[0] = Math.floor(platformer.player.pos[0] + platformer.player.speed[0]);
        for (let i = 0; i < platformer.map.length; i++) {
            var c = platformer.solve(platformer.collison('player', i), 'player', i);
        }
        platformer.plDisp(true);
        return platformer.player.pos[0];
    },
    isPlayerFalling: function () {
        platformer.player.pos[1] -= 1
        var f = 0;
        for (let i = 0; i < platformer.map.length; i++) {
            var a = platformer.collison('player', i);
            if (a[1] < 0 && a[3] < 0) f++;
        }
        return !(f)
    },
    plFall: function (t) {
        var r = platformer.isPlayerFalling();
        if (r) {
            platformer.plDisp(false);
            platformer.player.speed[1] += platformer.settings.g;
            platformer.player.pos[1] = Math.floor(platformer.player.pos[1] + platformer.player.speed[1]);
            for (let i = 0; i < platformer.map.length; i++) platformer.solve(platformer.collison('player', i), 'player', i);
            platformer.plDisp(true);
            return platformer.player.pos[1]
        } return platformer.player.pos[1]
    },
    getLowestIndex: function (start = -1) {
        var arr = [];
        for (let i = 0; i < platformer.map.length; i++) {
            arr[i] = platformer.map[i].index;
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < start) arr.splice(i, 1);
        }
        if (platformer.player.index >= start && platformer.player.index < arr.min()) return platformer.player.index;
        else return arr.min;
    },
    displayAll: function () {
        platformer.display.getContext("2d").fillStyle = platformer.bgc;
        platformer.display.getContext("2d").fillRect(0, 0, platformer.display.width, platformer.display.height);
        platformer.display.getContext("2d").fillStyle = platformer.player.color;
        platformer.display.getContext("2d").fillRect(platformer.player.pos[0], platformer.player.pos[1], platformer.player.size[0], platformer.player.size[1]);
        for (let i = 0; i < platformer.map.length; i++) {
            platformer.getLowestIndex(i);
            if (platformer.map[i].color) platformer.display.getContext("2d").fillStyle = platformer.map[i].color;
            if (platformer.map[i].type = 'square') {
                if (platformer.map[i].isVisible) platformer.display.getContext("2d").fillRect(platformer.map[i].pos[0], platformer.map[i].pos[1], platformer.map[i].size[0], platformer.map[i].size[1]);
            } else if (platformer.map[i].type = 'circle') {
                if (platformer.map[i].isVisible) platformer.display.getContext("2d").fillRect(platformer.map[i].pos[0], platformer.map[i].pos[1], platformer.map[i].radius, 0, 2 * pi);
            }
        }
    },
    setDisplay: function (canvas, bgc, displayMode = 'partial') {
        platformer.display = canvas;
        platformer.bgc = bgc;
        platformer.displayMode = displayMode;
    },
    collison: function (i1, i2) {
        if (i1 == 'player') obj1 = platformer.player;
        else obj1 = platformer.map[i1];
        if (!obj1.isTransparent && !platformer.map[i2].isTransparent) {
            var x1 = obj1.pos[0] - (platformer.map[i2].pos[0] + platformer.map[i2].size[0]);
            var x2 = platformer.map[i2].pos[0] - (obj1.pos[0] + obj1.size[0]);
            var y1 = obj1.pos[1] - (platformer.map[i2].pos[1] + platformer.map[i2].size[1]);
            var y2 = platformer.map[i2].pos[1] - (obj1.pos[1] + obj1.size[1]);
            return [x1, y1, x2, y2]
        }
    },
    solve: function (coords, i1, i2 = undefined) {
        if (coords.max() < 0) {
            if (i1 == 'player') obj1 = platformer.player;
            else obj1 = platformer.map[i1];
            var m = coords.max();
            if (platformer.display && platformer.displayMode == 'partial') {
                if (obj1.isVisible) {
                    platformer.display.getContext("2d").fillStyle = platformer.bgc;
                    platformer.display.getContext("2d").fillRect(obj1.pos[0], obj1.pos[1], obj1.size[0], obj1.size[1]);
                }
                if (i2 && platformer.map[i2].isVisible) {
                    platformer.display.getContext("2d").fillStyle = platformer.bgc;
                    platformer.display.getContext("2d").fillRect(platformer.map[i2].pos[0], platformer.map[i2].pos[1], platformer.map[i2].size[0], platformer.map[i2].size[1]);
                }
            }
            if (isMultipleOf(coords.indexOf(m), 2)) obj1.pos[1] += (isMultipleOf(coords.indexOf(m), 4) ? -coords[1] : -coords[3]);
            else obj1.pos[0] += (isMultipleOf(coords.indexOf(m), 3) ? -coords[0] : -coords[2]);
            if (platformer.display && platformer.displayMode == 'partial') {
                if (obj1.color) platformer.display.getContext("2d").fillStyle = obj1.color;
                if (obj1.isVisible) platformer.display.getContext("2d").fillRect(obj1.pos[0], obj1.pos[1], obj1.size[0], obj1.size[1]);
                if (platformer.map[i2].color) platformer.display.getContext("2d").fillStyle = platformer.map[i2].color;
                if (platformer.map[i2].isVisible) platformer.display.getContext("2d").fillRect(platformer.map[i2].pos[0], platformer.map[i2].pos[1], platformer.map[i2].size[0], platformer.map[i2].size[1]);

            }
        }
        return obj1.pos
    },
    buildSquare: function (x, y, w, h, isTransparent = false, isVisible = false, isDeadly = false, color = '', index = platformer.map.length) {
        platformer.map[platformer.map.length] = { type: 'square', pos: [x, y], size: [w, h], isTransparent: isTransparent, isVisible: isVisible, isDeadly: isDeadly, color: color, index: index };
        if (platformer.display && platformer.displayMode == 'partial') {
            if (color) platformer.display.getContext("2d").fillStyle = color;
            if (isVisible) platformer.display.getContext("2d").fillRect(x, y, w, h);
        }
        return platformer.map[platformer.map.length - 1];
    },
    buildCircle: function (x, y, r, isTransparent = false, isVisible = false, isDeadly = false, color = '', index = platformer.map.length) {
        platformer.map[platformer.map.length] = { type: 'circle', pos: [x, y], radius: r, isTransparent: isTransparent, isVisible: isVisible, isDeadly: isDeadly, color: color, index: index };
        if (platformer.display && platformer.displayMode == 'partial') {
            if (color) platformer.display.getContext("2d").fillStyle = color;
            if (isVisible) platformer.display.getContext("2d").arc(x, y, r, 0, 2 * Math.PI), platformer.display.getContext("2d").stroke();
        }
        return platformer.map[platformer.map.length - 1];
    },
    prepBroad: function () {

    }
}
//TODO: Sort. This. Fucking. Mess.
//TODO: From there...
//2D block game handler
var tiled = {
    texture: { size: 8, pos: (x, y) => [texture.size * x, texture.size * y], },
    blocks: [],
    map: [],
    settings: {},
    metadata: { region: [] },
    getBlockId: function (block) {
        var t = -1;
        for (let i = 0; i < blocks.length; i++) {
            if (type == blocks[i].name) {
                t = i;
                i = blocks.length;
            }
        }
        return t
    },
    Setup: function (subLevels, layers, chkSize, dataDef, type = []) {
        tiled.settings.subLevels = subLevels;
        tiled.settings.layers = layers;
        tiled.settings.dataDef = dataDef;
        tiled.settings.typeData = type;
        tiled.settings.chunkSize = chkSize;
        var s = Object.getOwnPropertyNames(tiled.metadata);
        for (let i = 0; i < s.length; i++) {
            for (let j = 0; j < type.length; j++) {
                if (s[i] == type[j]) tiled.metadata[type[j]][tiled.metadata[type[j]].length] = dataDef[j];
            }
        }
    },
    Region: function (r) {
        tiled.metadata.region.push(r);
    },
    BuildChunk: function (coordinates, data = undefined) {
        var c = null;
        for (let i = 0; i < tiled.map.length; i++) {
            if (tiled.map[i].pos == coordinates.toString()) c = tiled.map[i].pos, i = tiled.map.length;
        }
        var t = tiled.map.length;
        if (c == null) {
            tiled.map[t] = {
                data: [], pos: coordinates, meta: [],
            };
            for (let i = 0; i < tiled.settings.layers; i++) tiled.map[t].data[i] = [];
            if (data != undefined) { var a = tiled.EditChunk(coordinates, data); return [tiled.map[t], a]; }
            else return tiled.map[t]
        } else return c
    },
    EditChunk: function (coordinates, data) {
        var c = null; var t = 0;
        for (let i = 0; i < tiled.map.length; i++) {
            if (tiled.map[i].pos == coordinates.toString()) c = tiled.map[i].pos, t = i, i = tiled.map.length;
        }
        if (c != null) {
            tiled.map[t].meta[tiled.map[t].meta.length] = data;
        } else return coordinates
    },
    Fill: function (coordinates, layer, subLevel, data) {
        var c = null;
        for (let i = 0; i < tiled.map.length; i++) {
            if (tiled.map[i].pos == coordinates.toString()) c = i, i = tiled.map.length;
        }
        if (c != null) {
            var p = 256; var t = -1; var from = -1;
            for (let i = 0; i < tiled.metadata.region.length; i++) {
                if (tiled.metadata.region[i].name == tiled.map[c].meta[i].from) from = i, i = tiled.metadata.region.length;
            }
            for (let i = 0; i < tiled.map[c].meta.length; i++) {
                if (tiled.metadata.region[from].type == 'generative' && tiled.metadata.region[from].priority < p) p = tiled.metadata.region[from].priority, t = i;
            }
            var arr = [];
            for (let y = 0; y < data; y++) {
                var a = [];
                for (let x = 0; x < data[y]; x++) {
                    for (let i = 0; i < tiled.map[c].meta[t].depth[layer][subLevel].length; i++) {
                        if (tiled.map[c].meta[t].depth[layer][subLevel][i][0] >= data[y][x]) a.push(this.getBlockId(tiled.map[c].meta[t].depth[layer][subLevel][i][1]));
                    }
                }
                arr.push(a);
            }
            tiled.map[c].data[layer][subLevel] = arr;
            return tiled.map[c].data[layer][subLevel]
        } else return coordinates
    },
    Filter: function (chunk, array) {
        var a = 1;
        var p = Object.getOwnPropertyNames(chunk.meta);
        var c = -1;
        for (let i = 0; i < p.length; i++) {
            if (chunk.meta[p[i]]) return c = i;
        };
        if (chunk.meta[p])
            for (let y = 0; y < 50; y++) {
                var r = [];
                for (let x = 0; x < 50; x++) {
                    var a = Math.floor(mix(0, blocks.length, rand.map.smoothed[y][x]));
                    r.push(a);
                }
                coords.medium.push(r);
            }
    },
    World: function (size, generator = rand.gen2D) {
        console.info('Hold on.. generating world..')
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                this.BuildChunk([x, y]);
            }
        }
        for (let i = 0; i < tiled.metadata.region.length; i++) {
            var arrey = generator(size, size);
            var arr = [];
            for (let j = 0; j < arrey.length; j++) {
                arr.push(arrey[j].map(x => Math.round(x * tiled.metadata.region[i].data.length)));
            }
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    this.EditChunk([x, y], tiled.metadata.region[i].data[arr[y][x]]);
                }
            }

        }
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                for (let l = 0; l < tiled.settings.layers; l++) {
                    for (let s = 0; s < tiled.settings.subLevels; s++) {
                        var arr = generator(tiled.settings.chunkSize, tiled.settings.chunkSize);
                        this.Fill([x, y], l, s, arr)
                    }
                }
            }
        }
    }
};
/*var texture = {
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
};*/
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
    addKey: function (key, action, param = void ("")) {
        this.setKeyVal(key);
        this.setKeyAct(key, action);
        this.setKeyPar(key, param)
    },
    setKeyVal: function (k) { key.state[key.state.length] = k; key.val[k] = false; },
    setKeyAct: function (k, act) { key.act[k] = act; },
    setKeyPar: function (k, par) { key.par[k] = par },
    restrictions: function (x1, x2, y1, y2) {
        key.border.xMin = x1; key.border.xMax = x2; key.border.yMin = y1; key.border.yMax = y2; key.restrict = true;
    },
    border: { xMin: 0, xMax: 1, yMin: 0, yMax: 1 },
    pos: { x: 100, y: 100 },
    state: [],
    val: {},
    act: {},
    par: {},
    action: function () {
        var t = 0;
        if (key.enable) {
            for (let t = 0; t < key.state.length; t++) {
                i = key.val[key.state[t]];
                if (i == true) { console.log(key.act[key.state[t]](key.par[key.state[t]])); }
            }
            if (key.restrict) {
                if (key.border.xMin >= key.pos.x) key.pos.x = key.border.xMin;
                else if (key.border.xMax <= key.pos.x) key.pos.x = key.border.xMax;
                if (key.border.yMin >= key.pos.y) key.pos.y = key.border.yMin;
                else if (key.border.yMax <= key.pos.y) key.pos.y = key.border.yMax;
            }
        }
    }
};
document.addEventListener("keydown", function (e) {
    e = e || event; // to deal with IE
    key.val[e.code] = e.type == 'keydown';
});
document.addEventListener("keyup", function (e) {
    e = e || event; // to deal with IE
    key.val[e.code] = e.type == 'keydown'
    if (event.code == "Escape") { pause() }
});
function load() { if (key.enable) keymotion(); }
document.addEventListener("mousemove", function (e) {
    if (cursor.enable) { }
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    if (cursor.enable) { }
});