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

                if(encrypt) { cipherIndex = plaintextCharIndex + keyCharIndex }
                else        { cipherIndex = plaintextCharIndex - keyCharIndex }

                cipherIndex = cipherIndex % 26;
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
        setInterval(function(){
            app.stopSpinner();
        }, 500);

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