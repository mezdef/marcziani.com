var footnote = document.createElement('div');
var fnClass = "fn-container";
var fnSup= "sup[id^='fnref']";
var fnContainer = document.getElementsByClassName(fnClass);
var fnTargets = document.querySelectorAll(fnSup + ' a');
footnote.classList.add("fn-container");


// # Listen for clicks outside the footnote
document.addEventListener('click', function(event) {
  if (fnContainer.length > 0) {
    if (event.target.className !== fnClass && event.target.className !== 'footnote') {
      fnContainer[0].parentNode.classList.remove('active')
      fnContainer[0].parentNode.removeChild(fnContainer[0]);
      document.documentElement.classList.remove('fn-open');
    }
  }
});

// # Listen on every footnote
for (i = 0; i < fnTargets.length; i++) {
  fnTargets[i].addEventListener('click', function(target) {
    target.preventDefault();
    fnCreate(target)
  });
}

// # Insert Footnote
function fnCreate(target) {
  var targetId = target.srcElement.text;
  footnote.innerHTML = document.getElementById('fn:' + targetId).children[0].innerHTML;
  target.srcElement.parentNode.classList.add('active');
  target.srcElement.parentNode.appendChild(footnote);
  document.documentElement.classList.add('fn-open');
}
