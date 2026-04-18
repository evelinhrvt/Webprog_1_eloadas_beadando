const headerEsNav = `
<header>
    <h1>Web programozás-1 Előadás Házi feladat</h1>
</header>
<nav>
    <a href="index.html">Főoldal</a>
    <a href="javascript.html">JS CRUD</a>
    <a href="react.html">React CRUD</a>
    <a href="spa.html">React SPA</a>
    <a href="fetchapi.html">Fetch API</a>
    <a href="axios.html">Axios</a>
    <a href="oojs.html">OOJS</a>
</nav>
`;

const footer = `
<footer>
    Készítette: Palotai Tamás (PMB6ZM) és Horvát Evelin (AJ4B6Q)
</footer>
`;

document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin", headerEsNav);
    document.body.insertAdjacentHTML("beforeend", footer);
});
