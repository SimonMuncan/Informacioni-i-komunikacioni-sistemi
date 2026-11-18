const stavke = Array.from(document.querySelectorAll('.g-item'));
const dugmadFilter = document.querySelectorAll('.filter-btn');

dugmadFilter.forEach(function (dugme) {
  dugme.addEventListener('click', function () {
    const filter = dugme.dataset.filter;

    dugmadFilter.forEach(function (d) {
      const aktivno = d === dugme;
      d.classList.toggle('active', aktivno);
      d.setAttribute('aria-pressed', String(aktivno));
    });

    stavke.forEach(function (stavka) {
      const sakrij = filter !== 'sve' && stavka.dataset.kategorija !== filter;
      stavka.classList.toggle('is-hidden', sakrij);
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lbSlika = lightbox.querySelector('img');
const lbOpis = lightbox.querySelector('.lb-caption');
const lbBrojac = lightbox.querySelector('.lb-counter');
let trenutniIndeks = 0;

function vidljiveStavke() {
  return stavke.filter(function (stavka) {
    return !stavka.classList.contains('is-hidden');
  });
}

function prikaziSliku(indeks) {
  const lista = vidljiveStavke();
  trenutniIndeks = (indeks + lista.length) % lista.length;

  const stavka = lista[trenutniIndeks];
  lbSlika.src = stavka.querySelector('a').getAttribute('href');
  lbSlika.alt = stavka.querySelector('img').alt;
  lbOpis.textContent = stavka.querySelector('figcaption').textContent;
  lbBrojac.textContent = (trenutniIndeks + 1) + ' / ' + lista.length;

  lbSlika.classList.remove('lb-anim');
  void lbSlika.offsetWidth;
  lbSlika.classList.add('lb-anim');
}

if (typeof lightbox.showModal === 'function') {
  stavke.forEach(function (stavka) {
    stavka.querySelector('a').addEventListener('click', function (dogadjaj) {
      dogadjaj.preventDefault();
      prikaziSliku(vidljiveStavke().indexOf(stavka));
      lightbox.showModal();
    });
  });

  lightbox.querySelector('.lb-prev').addEventListener('click', function () {
    prikaziSliku(trenutniIndeks - 1);
  });

  lightbox.querySelector('.lb-next').addEventListener('click', function () {
    prikaziSliku(trenutniIndeks + 1);
  });

  lightbox.querySelector('.lb-close').addEventListener('click', function () {
    lightbox.close();
  });

  lightbox.addEventListener('click', function (dogadjaj) {
    if (dogadjaj.target === lightbox) {
      lightbox.close();
    }
  });

  document.addEventListener('keydown', function (dogadjaj) {
    if (!lightbox.open) return;
    if (dogadjaj.key === 'ArrowLeft') prikaziSliku(trenutniIndeks - 1);
    if (dogadjaj.key === 'ArrowRight') prikaziSliku(trenutniIndeks + 1);
  });
}
