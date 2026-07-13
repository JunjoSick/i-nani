var clock = document.getElementById('clock');
var heading = document.querySelector('h1');
var originalHeading = heading.innerText;
var originalTitle = document.title;
var pyongyangFormatter;
var filtri = "https://easylist-downloads.adblockplus.org/antiadblockfilters.txt \nhttps://raw.githubusercontent.com/bogachenko/fuckfuckadblock/master/fuckfuckadblock.txt \nhttps://raw.githubusercontent.com/gioxx/xfiles/master/filtri.txt \nhttps://big.oisd.nl";
var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
var konamiIndex = 0;
var typedBuffer = '';
var clockClicks = 0;
var headingTimer;
var titleTimer;
var clockClickTimer;
var manualSpecialBackgroundUntil = 0;
var gravityButton = document.getElementById('gravity-toggle');
var gravityMessage = document.createElement('div');
var gravityActive = false;

gravityMessage.id = 'gravity-message';
gravityMessage.innerText = 'visto? abbiamo tutti perso.';
document.body.appendChild(gravityMessage);

console.log(filtri);
console.log("psst: try the clock, the old code, or type dwarf / juche / bookforge / claude. the 'perdi tutto' button does exactly what it promises.");
console.log("(p.s. by reading the title, you just lost the game. so did I. abbiamo tutti perso.)");

try {
    pyongyangFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Pyongyang',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
    });
} catch (error) {
    console.log('Pyongyang timezone fallback ready:', error);
}

function padClockPart(value) {
    return value < 10 ? '0' + value : value.toString();
}

function getPyongyangTime() {
    try {
        var parts = pyongyangFormatter && pyongyangFormatter.formatToParts(new Date());
        var time = {};

        if (!parts) {
            throw new Error('Asia/Pyongyang formatter unavailable');
        }

        parts.forEach(function(part) {
            if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
                time[part.type] = part.value;
            }
        });

        if (time.hour && time.minute && time.second) {
            return time;
        }
    } catch (error) {
        console.log('Pyongyang timezone fallback used:', error);
    }

    var now = new Date();
    var hour = (now.getUTCHours() + 9) % 24;

    return {
        hour: padClockPart(hour),
        minute: padClockPart(now.getUTCMinutes()),
        second: padClockPart(now.getUTCSeconds())
    };
}

function setTemporaryHeading(message) {
    window.clearTimeout(headingTimer);
    heading.innerText = message;
    headingTimer = window.setTimeout(function() {
        heading.innerText = originalHeading;
    }, 4000);
}

function setTemporaryTitle(message) {
    window.clearTimeout(titleTimer);
    document.title = message;
    titleTimer = window.setTimeout(function() {
        document.title = originalTitle;
    }, 4000);
}

function spawnSparkle() {
    var sparkle = document.createElement('span');

    sparkle.className = 'claude-sparkle';
    sparkle.innerText = '✻';
    sparkle.style.left = (5 + Math.random() * 90) + 'vw';
    sparkle.style.fontSize = (14 + Math.random() * 22) + 'px';
    sparkle.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    sparkle.style.animationDelay = (Math.random() * 0.8) + 's';
    document.body.appendChild(sparkle);

    window.setTimeout(function() {
        sparkle.remove();
    }, 5500);
}

function summonClaude() {
    setTemporaryHeading('✻ claude was here');
    setTemporaryTitle('✻ beep boop');

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    for (var i = 0; i < 14; i++) {
        spawnSparkle();
    }
}

function unlockSnoopy() {
    manualSpecialBackgroundUntil = Date.now() + 10000;
    setTemporaryHeading('snoopy mode, briefly');
    updateClock();
}

function updateClock() {
    var pyongyangTime = getPyongyangTime();

    clock.innerText = pyongyangTime.hour + ':' + pyongyangTime.minute + ':' + pyongyangTime.second;

    if ((pyongyangTime.hour === '04' && pyongyangTime.minute === '20') || Date.now() < manualSpecialBackgroundUntil) {
        document.body.classList.add('special-background');
    } else {
        document.body.classList.remove('special-background');
    }
}

function scheduleClock() {
    updateClock();
    window.setTimeout(scheduleClock, 1000 - new Date().getMilliseconds());
}

scheduleClock();

document.getElementById('mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

clock.addEventListener('click', function() {
    window.clearTimeout(clockClickTimer);
    clockClicks += 1;

    if (clockClicks >= 5) {
        clockClicks = 0;
        setTemporaryHeading('Pyongyang time is watching');
        setTemporaryTitle("Juche o'clock");
        return;
    }

    clockClickTimer = window.setTimeout(function() {
        clockClicks = 0;
    }, 1200);
});

function collectFallingPieces() {
    var elements = [];
    var pieces = [];

    document.querySelectorAll('h1, .project, .github-profile').forEach(function(element) {
        elements.push(element);
    });

    elements.push(clock);
    elements.push(document.getElementById('mode-toggle'));
    elements.push(gravityButton);

    elements.forEach(function(element, index) {
        var rect = element.getBoundingClientRect();

        pieces.push({
            element: element,
            rect: rect,
            inlineStyle: element.getAttribute('style'),
            tx: 0,
            ty: 0,
            vx: (Math.random() - 0.5) * 3,
            vy: -(1 + Math.random() * 3),
            angle: 0,
            spin: (Math.random() - 0.5) * 8,
            delay: index * 90,
            floor: Math.max(0, window.innerHeight - rect.bottom - Math.random() * 40),
            done: false
        });
    });

    return pieces;
}

function freezePieces(pieces) {
    pieces.forEach(function(piece) {
        var style = piece.element.style;

        style.position = 'fixed';
        style.top = piece.rect.top + 'px';
        style.left = piece.rect.left + 'px';
        style.width = piece.rect.width + 'px';
        style.margin = '0';
        style.right = 'auto';
        style.bottom = 'auto';
        style.zIndex = '998';
    });
}

function settlePieces(pieces) {
    gravityMessage.classList.add('visible');

    window.setTimeout(function() {
        gravityMessage.classList.remove('visible');

        pieces.forEach(function(piece) {
            piece.element.style.transition = 'transform 0.9s ease';
            piece.element.style.transform = 'translate(0px, 0px) rotate(0deg)';
        });

        window.setTimeout(function() {
            pieces.forEach(function(piece) {
                if (piece.inlineStyle === null) {
                    piece.element.removeAttribute('style');
                } else {
                    piece.element.setAttribute('style', piece.inlineStyle);
                }
            });

            gravityActive = false;
        }, 950);
    }, 1800);
}

function loseEverything() {
    if (gravityActive) {
        return;
    }

    gravityActive = true;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gravityMessage.classList.add('visible');
        window.setTimeout(function() {
            gravityMessage.classList.remove('visible');
            gravityActive = false;
        }, 2500);
        return;
    }

    var pieces = collectFallingPieces();
    var started = performance.now();
    var lastFrame = started;

    freezePieces(pieces);

    function step(now) {
        var dt = Math.min((now - lastFrame) / 16.67, 3);
        var elapsed = now - started;

        lastFrame = now;

        pieces.forEach(function(piece) {
            if (piece.done || elapsed < piece.delay) {
                return;
            }

            piece.vy += 0.9 * dt;
            piece.tx += piece.vx * dt;
            piece.ty += piece.vy * dt;
            piece.angle += piece.spin * dt;

            if (piece.ty >= piece.floor && piece.vy > 0) {
                piece.ty = piece.floor;

                if (Math.abs(piece.vy) < 2) {
                    piece.vy = 0;
                    piece.spin = 0;
                    piece.done = true;
                } else {
                    piece.vy = -piece.vy * 0.45;
                    piece.vx *= 0.8;
                    piece.spin *= 0.6;
                }
            }

            piece.element.style.transform = 'translate(' + piece.tx + 'px, ' + piece.ty + 'px) rotate(' + piece.angle + 'deg)';
        });

        var allDone = pieces.every(function(piece) {
            return piece.done;
        });

        if (allDone || elapsed > 4500) {
            settlePieces(pieces);
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}

if (gravityButton) {
    gravityButton.addEventListener('click', loseEverything);
}

document.addEventListener('keydown', function(event) {
    var key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    var konamiKey = konamiCode[konamiIndex];

    if (key === konamiKey) {
        konamiIndex += 1;

        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            unlockSnoopy();
        }
    } else {
        konamiIndex = key === konamiCode[0] ? 1 : 0;
    }

    if (key.length === 1 && key >= 'a' && key <= 'z') {
        typedBuffer = (typedBuffer + key).slice(-20);

        if (typedBuffer.endsWith('dwarf')) {
            setTemporaryHeading('Dwarves are still cool');
        }

        if (typedBuffer.endsWith('juche')) {
            setTemporaryTitle("Juche o'clock");
        }

        if (typedBuffer.endsWith('bookforge')) {
            setTemporaryHeading('Book forged. probably.');
        }

        if (typedBuffer.endsWith('claude')) {
            summonClaude();
        }
    }
});
