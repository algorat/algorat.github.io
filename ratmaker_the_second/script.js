
      const images = document.getElementById('big-ratitude');
      const soloClasses = [
        'eyes',
        'eyes2',
        'eyes3',
        'eyes4',
        'background',
        'body',
        'body2',
        'body3',
        'body4',
        'mouth',
        'mouth2',
        'mouth3',
        'mouth4',
        'frame',
        'foreground',
        'eyebrows',
        'eyebrows2',
        'eyebrows3',
        'eyebrows4'
      ];

      function randomize() {
        reset();
        displayRandomFrom('eyes', 1);
        displayRandomFrom('background', 1);
        displayRandomFrom('body', 1);
        displayRandomFrom('mouth', 1);
        displayRandomFrom('frame', 1);
        displayRandomFrom('foreground', 1);
        displayRandomFrom('friend', Math.random() > 0.3 ? 0 : 1);
        displayRandomFrom('extra', Math.floor(Math.random() * 3));
      }

      function displayRandomFrom(className, numItems) {
        const items = Array.from(document.getElementsByClassName(className));
        for (let i = 0; i < numItems; i++) {
          const randomIndex = Math.floor(Math.random() * items.length);
          showImageElement(items[randomIndex]);
        }
      }

      function isHidden(element) {
        return !element.classList.contains('checked')
      }

      function toggleFade(element){
        
        if (isHidden(element)){

          showImageElement(element)

        }
        else{

          hideImageElement(element)
        }

      }

      function hideImageElement(element) {
          element.classList.remove('checked');
          document
            .getElementById(element.getAttribute('img-url'))
             .classList.toggle('hidden'); // not sure if this needs to be here

          document
            .getElementById(element.getAttribute('img-url'))
             .classList.add('dontDrawMe'); 
             // so that the downloader knows not to draw this element
          
          document
            .getElementById(element.getAttribute('img-url')).style.transition = '0.4s';
          document  
            .getElementById(element.getAttribute('img-url')).style.opacity = 0;

      }

      function showImageElement(element) {
          element.classList.add('checked');
          document
            .getElementById(element.getAttribute('img-url'))
            .classList.toggle('hidden');


          document
            .getElementById(element.getAttribute('img-url'))
             .classList.remove('dontDrawMe'); 
             // so that the downloader knows to draw this element
   
          document.getElementById(
              element.getAttribute('img-url')).style.transition = '0.25s';
          document.getElementById(
              element.getAttribute('img-url')).style.opacity = 1;
       
      }

      function reset() {
        const allImageElements = Array.from(
          document.getElementsByClassName('option')
        );
        allImageElements.forEach(imageElement =>
          hideImageElement(imageElement)
        );
      }

      function toggleItem(evt) {
        const element = evt.srcElement;
        soloClasses.forEach(soloClassName => {
          if (element.classList.contains(soloClassName)) {


            Array.from(document.getElementsByClassName(soloClassName)).forEach(
              soloClassItem => {
                if (soloClassItem.classList.contains('checked')) {
                     if (soloClassItem != element){
                     hideImageElement(soloClassItem)
                   }
                }
              }
            );
          }
        });
        
        toggleFade(element)

      }

      document.querySelectorAll('.option').forEach(item => {
        item.addEventListener('click', toggleItem);
        const imgUrl = item.getAttribute('img-url');
        const newImage = document.createElement('IMG');

        newImage.src = 'assets/' + imgUrl;
        newImage.id = imgUrl;
        newImage.style.opacity = 0;
        newImage.classList.add('hidden');
        newImage.classList.add('dontDrawMe');
        newImage.classList.add('rat-image');

        images.appendChild(newImage);
      });

      //saves image to local files
      function saveImage() {
        var canvas = document.createElement('CANVAS');
        var canWid = 425;
        var canHei = 275;

        canvas.width = canWid;
        canvas.height = canHei;
        canvas.style.width = canWid + 'px';
        canvas.style.height = canHei + 'px';

        var ctx = canvas.getContext('2d');

        Array.from(document.getElementsByClassName('rat-image')).forEach(
          img => {
            if (!img.classList.contains('dontDrawMe')) { 
              ctx.drawImage(img, 0, 0, 425, 275);
            }
          }
        );

        var linkToClick = document.createElement('A'); //hacky solution to save file
        linkToClick.setAttribute('download', 'Rat-persona.png');
        linkToClick.setAttribute(
          'href',
          canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream')
        );
        var event = new MouseEvent('click');
        linkToClick.dispatchEvent(event);
      }