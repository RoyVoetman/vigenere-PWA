(function() {

    var app = {
        firstRun: true,
        alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        container: document.querySelector('.main'),
        resultDiv: document.querySelector('.result'),
        resultElement: document.querySelector('.result p'),
        spinner: document.querySelector('.loader'),
        plaintext: "",
        key: ""
    };

    /*****************************************************************************
     *
     * Javascript modulo bug
     * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
     *
     ****************************************************************************/
    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    };

    /*****************************************************************************
    *
    * Event listeners for UI elements
    *
    ****************************************************************************/

    document.getElementById('butEncrypt').addEventListener('click', function() {
        app.key       = document.querySelector('input[name="key"]').value;
        app.plaintext = document.querySelector('input[name="text"]').value;

        // Encryption
        app.vigenere(true);
    });

    document.getElementById('butDecrypt').addEventListener('click', function() {
        app.key       = document.querySelector('input[name="key"]').value;
        app.plaintext = document.querySelector('input[name="text"]').value;

        // Decryption
        app.vigenere(false);
    });

    /*****************************************************************************
    *
    * Method for encryption and decryption
    *
    ****************************************************************************/

    app.vigenere = function(encrypt) {
        var keyLength       = app.key.length,
            plaintextLength = app.plaintext.length,
            ciphertext      = "";

        var plaintextCharIndex, keyCharIndex, cipherIndex, cipherChar;

        for(var i = 0, j = 0; i < plaintextLength; i++) {
            
            if( isAlpha( app.plaintext[i] ) ) {

                plaintextCharIndex = charToIndex( app.plaintext[i].toLowerCase() );
                keyCharIndex       = charToIndex( app.key[j].toLowerCase()       );


                if(encrypt) { cipherIndex = app.encryptFormula(plaintextCharIndex, keyCharIndex) }
                else        { cipherIndex = app.decryptFormula(plaintextCharIndex, keyCharIndex) }

                cipherChar  = app.alphabet[ cipherIndex ];

                if( isUpper(app.plaintext[i]) ) {
                    cipherChar = cipherChar.toUpperCase();
                }

                ciphertext += cipherChar;

                if( j === keyLength - 1 ) { j = 0; }
                else                      { j++; }

            } else {
                ciphertext += app.plaintext[i];
            }

        }

        if(app.firstRun) {
            app.resultDiv.style.display = "block";
        }

        app.resultElement.textContent = ciphertext;

    };

    app.encryptFormula = function (pIndex, kIndex) {
        return (pIndex + kIndex).mod(26);
    };

    app.decryptFormula = function (cIndex, kIndex) {
        return (cIndex - kIndex).mod(26);
    };

    /*****************************************************************************
    *
    * Helper functions for Vigenere
    *
    ****************************************************************************/

    var isAlpha = function(char){
        return /^[A-Z]$/i.test(char);
    };

    var charToIndex = function(char) {
        return app.alphabet.indexOf(char);
    };

    var isUpper = function(char) {
        return char === char.toUpperCase()
    };

    /*****************************************************************************
     *
     * init after DOM is fully loaded (including images, videos, etc)
     *
     ****************************************************************************/

    window.onload = function() {
        app.stopSpinner();

        if('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/vigenere/service-worker.js')
                .then(function() { console.log("Service Worker Registered"); });
        }
    };

    app.stopSpinner = function() {
        app.spinner.style.display = "none";
        app.container.style.display = "block";
    };

})();