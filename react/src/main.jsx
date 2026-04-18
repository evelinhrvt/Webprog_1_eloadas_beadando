import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const API_URL = '/api.php';

const kezdoMozik = [
  { moziazon: 1, mozinev: 'A38 Hajó', irszam: 1113, cim: 'Petőfi híd budai hídfő', telefon: '4643940' },
  { moziazon: 2, mozinev: 'Bárka Kikötő a Ráday utcában', irszam: 1092, cim: 'Ráday utca', telefon: '' },
  { moziazon: 3, mozinev: 'Bem', irszam: 1024, cim: 'Margit krt. 5/b.', telefon: '3168708' },
  { moziazon: 4, mozinev: 'Cinema City Csepel Plaza', irszam: 1212, cim: 'Rákóczi F. út 154-170.', telefon: '4258111' },
  { moziazon: 5, mozinev: 'Corvin Budapest Filmpalota', irszam: 1082, cim: 'Corvin köz 1.', telefon: '4595050' }
];

const uresUrlap = { mozinev: '', irszam: '', cim: '', telefon: '' };

function MoziUrlap({ urlap, szerkesztettAzon, onValtozas, onMentes, onMegse }) {
  return (
    <div className="urlap">
      <input type="text" name="mozinev" placeholder="Mozi neve" value={urlap.mozinev} onChange={onValtozas} />
      <input type="number" name="irszam" placeholder="Irányítószám" value={urlap.irszam} onChange={onValtozas} />
      <input type="text" name="cim" placeholder="Címe" value={urlap.cim} onChange={onValtozas} />
      <input type="text" name="telefon" placeholder="Telefon" value={urlap.telefon} onChange={onValtozas} />
      <button onClick={onMentes}>{szerkesztettAzon === null ? 'Hozzáadás' : 'Módosítás mentése'}</button>
      {szerkesztettAzon !== null && <button onClick={onMegse}>Mégse</button>}
    </div>
  );
}

function MoziLista({ mozik, onSzerkeszt, onTorol }) {
  return (
    <ul>
      {mozik.map((mozi) => (
        <li key={mozi.moziazon}>
          <div className="lista-szoveg">
            <strong>{mozi.mozinev}</strong>
            <span> ({mozi.irszam}, {mozi.cim}{mozi.telefon ? `, tel.: ${mozi.telefon}` : ''})</span>
          </div>
          <button onClick={() => onSzerkeszt(mozi)}>Módosítás</button>
          <button className="torles" onClick={() => onTorol(mozi.moziazon)}>Törlés</button>
        </li>
      ))}
    </ul>
  );
}

function ReactCrud() {
  const [mozik, setMozik] = useState(kezdoMozik);
  const [urlap, setUrlap] = useState(uresUrlap);
  const [szerkesztettAzon, setSzerkesztettAzon] = useState(null);
  const [uzenet, setUzenet] = useState('');

  function urlapValtozik(e) {
    setUrlap({ ...urlap, [e.target.name]: e.target.value });
  }

  function urlapTorles() {
    setSzerkesztettAzon(null);
    setUrlap(uresUrlap);
  }

  function ment() {
    if (!urlap.mozinev.trim() || !urlap.cim.trim()) {
      setUzenet('A mozi neve és címe kötelező.');
      return;
    }

    if (szerkesztettAzon === null) {
      const ujAzon = mozik.length ? Math.max(...mozik.map((mozi) => mozi.moziazon)) + 1 : 1;
      setMozik([...mozik, { ...urlap, moziazon: ujAzon }]);
      setUzenet('Sikeres hozzáadás.');
    } else {
      setMozik(mozik.map((mozi) => (mozi.moziazon === szerkesztettAzon ? { ...urlap, moziazon: szerkesztettAzon } : mozi)));
      setUzenet('Sikeres módosítás.');
    }

    urlapTorles();
  }

  function szerkeszt(mozi) {
    setSzerkesztettAzon(mozi.moziazon);
    setUrlap({
      mozinev: mozi.mozinev || '',
      irszam: mozi.irszam || '',
      cim: mozi.cim || '',
      telefon: mozi.telefon || ''
    });
    setUzenet('Szerkesztési mód.');
  }

  function torol(id) {
    setMozik(mozik.filter((mozi) => mozi.moziazon !== id));
    if (szerkesztettAzon === id) {
      urlapTorles();
    }
    setUzenet('Sikeres törlés.');
  }

  return (
    <section>
      <h2>React CRUD</h2>
      <MoziUrlap urlap={urlap} szerkesztettAzon={szerkesztettAzon} onValtozas={urlapValtozik} onMentes={ment} onMegse={urlapTorles} />
      {uzenet && <p className="uzenet">{uzenet}</p>}
      <MoziLista mozik={mozik} onSzerkeszt={szerkeszt} onTorol={torol} />
    </section>
  );
}

function Szamlalo() {
  const [szam, setSzam] = useState(0);

  return (
    <div className="mini-app">
      <h3>Egyszerű számláló</h3>
      <div className="szam">{szam}</div>
      <button onClick={() => setSzam(szam + 1)}>+1</button>
      <button onClick={() => setSzam(szam - 1)}>-1</button>
      <button onClick={() => setSzam(0)}>Nullázás</button>
    </div>
  );
}

function SzinValto() {
  const [szin, setSzin] = useState('#00509E');
  const szinek = ['#00509E', '#B20710', '#2E7D32', '#E65100', '#6A1B9A', '#00838F'];

  function valtoztat() {
    const valaszthato = szinek.filter((elem) => elem !== szin);
    setSzin(valaszthato[Math.floor(Math.random() * valaszthato.length)]);
  }

  return (
    <div className="mini-app szinvalto" style={{ backgroundColor: szin }}>
      <h3>Színváltó játék</h3>
      <p>Kattints a gombra a szín megváltoztatásához!</p>
      <button onClick={valtoztat}>Szín váltása</button>
    </div>
  );
}

function SpaFeladat() {
  const [aktivMenu, setAktivMenu] = useState('szamlalo');

  return (
    <section>
      <h2>SPA két menüvel</h2>
      <div className="tabok">
        <button className={aktivMenu === 'szamlalo' ? 'aktiv' : ''} onClick={() => setAktivMenu('szamlalo')}>Számláló</button>
        <button className={aktivMenu === 'szinvalto' ? 'aktiv' : ''} onClick={() => setAktivMenu('szinvalto')}>Színváltó</button>
      </div>
      {aktivMenu === 'szamlalo' ? <Szamlalo /> : <SzinValto />}
    </section>
  );
}

function AxiosCrud() {
  const [mozik, setMozik] = useState([]);
  const [urlap, setUrlap] = useState(uresUrlap);
  const [szerkesztettAzon, setSzerkesztettAzon] = useState(null);
  const [uzenet, setUzenet] = useState('');
  const [hiba, setHiba] = useState('');

  function betolt() {
    axios.get(API_URL)
      .then((valasz) => {
        setHiba('');
        setMozik(Array.isArray(valasz.data) ? valasz.data : []);
      })
      .catch(() => setHiba('Nem sikerült kapcsolódni az adatbázishoz.'));
  }

  useEffect(() => {
    betolt();
  }, []);

  function urlapValtozik(e) {
    setUrlap({ ...urlap, [e.target.name]: e.target.value });
  }

  function urlapTorles() {
    setSzerkesztettAzon(null);
    setUrlap(uresUrlap);
  }

  function ment() {
    if (!urlap.mozinev.trim() || !urlap.cim.trim()) {
      setUzenet('A mozi neve és címe kötelező.');
      return;
    }

    const ujFelvetel = szerkesztettAzon === null;
    const adat = { ...urlap, moziazon: szerkesztettAzon };
    const keres = ujFelvetel ? axios.post(API_URL, adat) : axios.put(API_URL, adat);

    keres.then(() => {
      betolt();
      urlapTorles();
      setUzenet(ujFelvetel ? 'Sikeres hozzáadás.' : 'Sikeres módosítás.');
    });
  }

  function szerkeszt(mozi) {
    setSzerkesztettAzon(mozi.moziazon);
    setUrlap({
      mozinev: mozi.mozinev || '',
      irszam: mozi.irszam || '',
      cim: mozi.cim || '',
      telefon: mozi.telefon || ''
    });
    setUzenet('Szerkesztési mód.');
  }

  function torol(id) {
    axios.delete(API_URL, { data: { moziazon: id } }).then(() => {
      betolt();
      if (szerkesztettAzon === id) {
        urlapTorles();
      }
      setUzenet('Sikeres törlés.');
    });
  }

  return (
    <section>
      <h2>React + Axios CRUD</h2>
      <MoziUrlap urlap={urlap} szerkesztettAzon={szerkesztettAzon} onValtozas={urlapValtozik} onMentes={ment} onMegse={urlapTorles} />
      {uzenet && <p className="uzenet">{uzenet}</p>}
      {hiba && <p className="hiba">{hiba}</p>}
      <MoziLista mozik={mozik} onSzerkeszt={szerkeszt} onTorol={torol} />
    </section>
  );
}

function App() {
  const [oldal, setOldal] = useState('crud');

  return (
    <>
      <header>
        <h1>Web programozás-1 Előadás Házi feladat</h1>
      </header>
      <nav>
        <button className={oldal === 'crud' ? 'aktiv' : ''} onClick={() => setOldal('crud')}>React CRUD</button>
        <button className={oldal === 'spa' ? 'aktiv' : ''} onClick={() => setOldal('spa')}>SPA</button>
        <button className={oldal === 'axios' ? 'aktiv' : ''} onClick={() => setOldal('axios')}>Axios CRUD</button>
      </nav>
      <main className="container">
        {oldal === 'crud' && <ReactCrud />}
        {oldal === 'spa' && <SpaFeladat />}
        {oldal === 'axios' && <AxiosCrud />}
      </main>
      <footer>Készítette: Palotai Tamás (PMB6ZM) és Horvát Evelin (AJ4B6Q)</footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
