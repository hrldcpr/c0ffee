(function() {
    function createSvg(tag) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    function getChildren(node) {
        // Safari doesn't support .children on SVG elements
        return Array.prototype.slice.call(node.childNodes).filter(function(x) {
            return x.nodeType === 1;
        });
    }

    function createLed(x, y, theta) {
        var use = createSvg('use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#led');
        use.setAttribute('transform', 'translate('+x+', '+y+') rotate('+theta+')');
        return use;
    }

    var CHARACTER_LEDS = [
        [0, -6, 0],
        [-3, -3, 90], [3, -3, 90],
        [0, 0, 0],
        [-3, 3, 90], [3, 3, 90],
        [0, 6, 0]
    ];
    function createCharacter(x, y) {
        x = x*9 + 4;
        y = y*15 + 7;
        var g = createSvg('g');
        g.setAttribute('transform', 'translate('+x+', '+y+')');
        CHARACTER_LEDS.forEach(function(led) {
            g.appendChild(createLed.apply(null, led));
        });
        return g;
    }

    function randomColor() {
        return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }

    var LETTER_LEDS = {
        C: [true,
            true, false,
            false,
            true, false,
            true],
        O: [true,
            true, true,
            false,
            true, true,
            true],
        F: [true,
            true, false,
            true,
            true, false,
            false],
        E: [true,
            true, false,
            true,
            true, false,
            true]
    };
    function flickerCharacter(c) {
        var leds = getChildren(c);
        LETTER_LEDS[c.getAttributeNS(NAMESPACE, 'letter')].forEach(function(enabled, i) {
            var className = enabled ? 'enabled' : 'disabled';
            if (Math.random() < 0.2) className = enabled ? 'disabled' : 'incorrect';
            leds[i].setAttribute('class', className);
            // var fill = enabled ? 'white' : 'none';
            // if (Math.random() < 0.1) fill = enabled ? 'none' : randomColor();
            // leds[i].setAttribute('fill', fill);
        });
    }

    
    var NAMESPACE = 'http://x.st/coffee';
    var coffee = document.getElementById('coffee');
    'COFFEE'.split('').forEach(function(letter, i) {
        var character = createCharacter(i, 0);
        // SVG elements don't support data attributes except in Chrome,
        // so we use a namespaced attribute instead
        character.setAttributeNS(NAMESPACE, 'letter', letter);
        coffee.appendChild(character);
    });

    (function animate() {
        getChildren(coffee).forEach(flickerCharacter);
        requestAnimationFrame(animate);
    })();
})();
