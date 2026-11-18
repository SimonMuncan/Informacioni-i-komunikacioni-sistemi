const forma = document.getElementById('kontakt-forma');
const poljePoruka = document.getElementById('poruka');
const poljeTelefon = document.getElementById('telefon');
const brojac = document.getElementById('brojac-poruka');
const MAKS_PORUKA = Number(poljePoruka.getAttribute('maxlength'));

forma.noValidate = true;

const polja = [
  document.getElementById('povod'),
  forma.querySelector('input[name="nacin"]'),
  document.getElementById('ime'),
  document.getElementById('prezime'),
  document.getElementById('email'),
  poljeTelefon,
  poljePoruka
];

const PORUKE_PRAZNO = {
  povod: 'Izaberite šta treba očistiti.',
  nacin: 'Izaberite kako da vas kontaktiramo.',
  ime: 'Unesite ime.',
  prezime: 'Unesite prezime.',
  email: 'Unesite adresu e-pošte.',
  telefon: 'Unesite broj telefona.',
  poruka: 'Napišite kratku poruku.'
};

const parametri = new URLSearchParams(window.location.search);
if (parametri.has('poruka')) {
  poljePoruka.value = parametri.get('poruka').slice(0, MAKS_PORUKA);
}

function porukaGreske(polje) {
  const v = polje.validity;

  if (polje.type !== 'radio' && polje.tagName !== 'SELECT' && polje.value.trim() === '') {
    return PORUKE_PRAZNO[polje.name];
  }
  if (v.valueMissing) return PORUKE_PRAZNO[polje.name];
  if (v.typeMismatch) return 'Unesite ispravnu adresu e-pošte, na primer ime@primer.rs.';
  if (v.patternMismatch) return 'Telefon može sadržati samo cifre, razmake, crtice, kosu crtu i znak +.';
  if (v.tooShort) {
    return 'Najmanje ' + polje.minLength + ' karaktera (trenutno ' + polje.value.trim().length + ').';
  }
  return '';
}

function proveriPolje(polje) {
  const greska = porukaGreske(polje);
  const okvir = polje.closest('.field');
  const mestoZaGresku = okvir.querySelector('.field-error');

  mestoZaGresku.textContent = greska;
  okvir.classList.toggle('is-invalid', greska !== '');
  okvir.classList.toggle('is-valid', greska === '');
  polje.setAttribute('aria-invalid', String(greska !== ''));
  return greska === '';
}

polja.forEach(function (polje) {
  const grupa = polje.type === 'radio' ? forma.querySelectorAll('input[name="' + polje.name + '"]') : [polje];

  grupa.forEach(function (element) {
    element.addEventListener('blur', function () {
      polje.dataset.dodirnuto = 'da';
      proveriPolje(polje);
    });

    element.addEventListener(polje.tagName === 'SELECT' || polje.type === 'radio' ? 'change' : 'input', function () {
      if (polje.dataset.dodirnuto === 'da' || polje.type === 'radio' || polje.tagName === 'SELECT') {
        polje.dataset.dodirnuto = 'da';
        proveriPolje(polje);
      }
    });
  });
});

poljeTelefon.addEventListener('blur', function () {
  const vrednost = poljeTelefon.value.trim();
  if (vrednost.startsWith('+')) return;

  const cifre = vrednost.replace(/\D/g, '');
  if (cifre.length >= 9 && cifre.length <= 10 && cifre.startsWith('0')) {
    poljeTelefon.value = cifre.slice(0, 3) + '/' + cifre.slice(3, 6) + '-' + cifre.slice(6);
    proveriPolje(poljeTelefon);
  }
});

function osveziBrojac() {
  const duzina = poljePoruka.value.length;
  brojac.textContent = duzina + ' / ' + MAKS_PORUKA;
  brojac.classList.toggle('is-near', duzina > MAKS_PORUKA * 0.9);
}

poljePoruka.addEventListener('input', osveziBrojac);
osveziBrojac();

forma.addEventListener('submit', function (dogadjaj) {
  dogadjaj.preventDefault();

  let prvoNeispravno = null;
  polja.forEach(function (polje) {
    polje.dataset.dodirnuto = 'da';
    if (!proveriPolje(polje) && prvoNeispravno === null) {
      prvoNeispravno = polje;
    }
  });

  if (prvoNeispravno !== null) {
    prvoNeispravno.focus();
    return;
  }

  const podaci = new FormData(forma);
  const termin = podaci.get('termin') || 'nije izabran (dogovor telefonom)';

  const poruka =
    'Hvala na upitu! Uneli ste sledeće podatke:\n\n' +
    'Šta treba očistiti: ' + podaci.get('povod') + '\n' +
    'Željeni termin: ' + termin + '\n' +
    'Način kontakta: ' + podaci.get('nacin') + '\n' +
    'Ime i prezime: ' + podaci.get('ime').trim() + ' ' + podaci.get('prezime').trim() + '\n' +
    'E-pošta: ' + podaci.get('email').trim() + '\n' +
    'Telefon: ' + podaci.get('telefon').trim() + '\n' +
    'Poruka: ' + podaci.get('poruka').trim();

  alert(poruka);
  forma.reset();
});

forma.addEventListener('reset', function () {
  polja.forEach(function (polje) {
    delete polje.dataset.dodirnuto;
    polje.removeAttribute('aria-invalid');
    const okvir = polje.closest('.field');
    okvir.classList.remove('is-invalid', 'is-valid');
    okvir.querySelector('.field-error').textContent = '';
  });
  setTimeout(osveziBrojac); 
});
