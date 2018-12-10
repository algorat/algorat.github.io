window.onload = () => {
  window.addEventListener('click', e => {
    let rat = document.createElement('img');
    rat.src = 'img/rat.png';
    rat.style.position = 'absolute';
    rat.style.left = e.pageX - 20;
    rat.style.top = e.pageY - 20;
    rat.style.width = '40px';
    document.body.append(rat);
  });
};
