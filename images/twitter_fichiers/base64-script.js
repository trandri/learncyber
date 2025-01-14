document.addEventListener("DOMContentLoaded", function() {
    var dropArea = document.getElementById('drop_area');
    var imageInput = document.getElementById('imageInput');
    var preview = document.getElementById("preview");
    var imageInfo = document.getElementById("imageInfo");
    var historyContainer = document.getElementById("conversionHistory");
    var errorContainer = document.getElementById("errorContainer"); // Assurez-vous d'ajouter ce div dans votre HTML

    // Ajouter les images converties à l'historique
    function addToHistory(file, base64) {
        var container = document.createElement('div');
        container.className = 'history-item';
        var fileName = document.createElement('p');
        fileName.textContent = 'Image: ' + file.name;
        var progressBar = document.createElement('progress');
        progressBar.value = 100;
        progressBar.max = 100;
        var percent = document.createElement('span');
        percent.textContent = ' 100%';

        container.appendChild(fileName);
        container.appendChild(progressBar);
        container.appendChild(percent);
        historyContainer.appendChild(container);
    }

    // Configurer les événements de drag and drop
    dropArea.onclick = function() {
        imageInput.click();
    };

    dropArea.ondragover = dropArea.ondragenter = function(event) {
        event.preventDefault();
        dropArea.style.backgroundColor = 'lightgray';
    };

    dropArea.ondragleave = function() {
        dropArea.style.backgroundColor = '';
    };

    dropArea.ondrop = function(event) {
        event.preventDefault();
        dropArea.style.backgroundColor = '';
        imageInput.files = event.dataTransfer.files;
        processFile(imageInput.files[0]);
    };

    imageInput.onchange = function() {
        processFile(imageInput.files[0]);
    };

    // Traitement du fichier sélectionné ou déposé
    function processFile(file) {
        // Clear any previous preview or error messages
        preview.innerHTML = '';
        imageInfo.innerHTML = '';
        errorContainer.innerHTML = ''; // Clear error container on new file input

        if (file.size > 51200) { // Limite de taille de fichier à 50 Ko
            alert("L'image dépasse la limite de taille de 50 Ko. Veuillez choisir une image plus petite.");
            errorContainer.innerHTML = '<p style="color: red; text-align: center;">Conversion impossible : l\'image est trop grande.</p>';
            return; // Stop processing if the file is too large
        }

        document.getElementById('loadingGif').style.display = 'block';
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                imageInfo.innerHTML = '<strong>Image d\'origine : ' + file.name + '</strong><br>Taille: ' + (file.size / 1024).toFixed(2) + ' Ko, Dimensions: ' + img.width + 'x' + img.height;
                preview.innerHTML = '<img src="' + event.target.result + '" style="width: 150px;">';
                addToHistory(file, event.target.result);
                document.getElementById('loadingGif').style.display = 'none';
            };
            img.src = event.target.result;
            document.getElementById("base64Output").value = event.target.result;
        };
        reader.onerror = function(event) {
            alert("Erreur de lecture de fichier : " + event.target.error.code);
            document.getElementById('loadingGif').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Fonction pour copier le texte Base64
    function copierTexte() {
        var base64Text = document.getElementById("base64Output").value;
        if (base64Text.length) {
            navigator.clipboard.writeText(base64Text).then(() => {
                alert("Image en base64 copié !");
            }).catch(err => {
                alert("Erreur lors de la copie : " + err);
            });
        } else {
            alert("Veuillez convertir votre image");
        }
    }

    // Attacher la fonction de copie au bouton Copier
    var copyButton = document.querySelector('#form-copier-coller button');
    copyButton.addEventListener('click', copierTexte);
});
