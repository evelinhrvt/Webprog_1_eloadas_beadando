// A fejléc és a navigáció HTML kódja
const headerEsNav = `
<header>
    <h1>Web programozás-1 Előadás Házi feladat</h1>
</header>
<nav>
    <a href="index.html">Főoldal</a>
    <a href="javascript.html">JS CRUD</a>
    <a href="React.html">React CRUD</a>
    <a href="spa.html">React SPA</a>
    <a href="fetchapi.html">Fetch API</a>
    <a href="axios.html">Axios</a>
    <a href="oojs.html">OOJS</a>
</nav>
`;

// A lábléc HTML kódja
const footer = `
<footer>
    Készítette: Palotai Tamás (PMB6ZM) és Horvát Evelin (AJ4B6Q)
</footer>
`;

// Amikor a böngésző betölti az oldalt, beszúrjuk ezeket a megfelelő helyekre
document.addEventListener("DOMContentLoaded", () => {
    // A body legelejére beszúrjuk a fejlécet és a menüt
    document.body.insertAdjacentHTML("afterbegin", headerEsNav);

    // A body legvégére beszúrjuk a láblécet
    document.body.insertAdjacentHTML("beforeend", footer);
});