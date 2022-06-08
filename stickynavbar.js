// JS for the Sticky NavBar
let navbar = document.getElementById("main-nav");
let navPos = navbar.getBoundingClientRect().top;

window.addEventListener("scroll", e => {
    scrollPos = window.scrollY;
  });

  let timVine = document.getElementById("tim-vine");

  window.addEventListener("scroll", e => {
    let viewportHeight = window.innerHeight;
    let scrollPos = window.scrollY;
    if (scrollPos > navPos) {
      navbar.classList.add('sticky');
      header.classList.add('navbarOffsetMargin');
    } else {
      navbar.classList.remove('sticky');
      header.classList.remove('navbarOffsetMargin');
    }
  });


let navbarLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", e => {

 scrollpos = window.scrollY;
  if (scrollpos > (viewportHeight - navHeight)) {
    navbar.classList.add('sticky')
  } else {
    navbar.classList.remove('sticky')
  }

  navbarLinks.forEach(link => {
    let section = document.querySelector(link.hash);
    if (scrollPos + 150 > section.offsetTop && scrollPos + 150 < section.offsetTop + section.offsetHeight ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});