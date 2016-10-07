var fnTargets = document.querySelectorAll(".gallery ul");

// # Listen on every Gallery Thumbnail
for (i = 0; i < fnTargets.length; i++) {
  fnTargets[i].addEventListener('click', function(target) {
    target.preventDefault();
    fnSwitch(target)
  });
}

// # Swap Gallery SRC
function fnSwitch(target) {
  var imgs = target.srcElement.parentNode.parentNode.getElementsByTagName('li');
  [].forEach.call(imgs, function(el) { el.classList.remove("active"); });
  target.srcElement.parentNode.classList.add('active');
  // Set picture src to thumbnail src
  target.srcElement.parentNode.parentNode.parentNode.querySelector('picture > img').src = target.target.attributes.src.value;
}
