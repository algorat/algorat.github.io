window.onload = () => {

  var rats = ['img/rat3.png', 'img/rat4.png', 'img/rat5.png']; 

  window.addEventListener('click', e => {
    let rat = document.createElement('img');
    rat.src = rats[(Math.random() * rats.length) | 0];
    rat.style.position = 'absolute';
    rat.style.left = e.pageX - 50;
    rat.style.top = e.pageY - 50;
    rat.style.width = '100px';
    document.body.append(rat);
  });
};
