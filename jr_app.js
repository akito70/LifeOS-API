/* =========================================================
   JR CONNECTION — PRICE DESK
   V4
   ========================================================= */

/* =========================
   CONFIGURACIÓN
========================= */

const STORAGE_KEY = "jrConnectionPriceCatalog_v4";
const UPDATED_KEY = "jrConnectionPriceCatalogUpdated_v4";

const EXCHANGE_RATE = 36.96;

const ADMIN_PIN = "2580";


/* =========================
   OPCIONES DEL SISTEMA
========================= */

const PHONE_BRANDS = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Redmi",
    "Honor",
    "Infinix"
];

const CATEGORIES = [
    "Teléfono",
    "Artículo"
];


/* =========================
   PRODUCTOS DE EJEMPLO
========================= */

const defaultProducts = [

    {
        id: crypto.randomUUID(),
        category: "Teléfono",
        brand: "Apple",
        model: "iPhone 14 Pro Max",
        color: "Deep Purple",
        storage: "256 GB",
        battery: 89,
        quantity: 1,
        priceUSD: 285
    },

    {
        id: crypto.randomUUID(),
        category: "Teléfono",
        brand: "Samsung",
        model: "Galaxy S23 Ultra",
        color: "Black",
        storage: "256 GB",
        battery: null,
        quantity: 2,
        priceUSD: 265
    },

    {
        id: crypto.randomUUID(),
        category: "Teléfono",
        brand: "Redmi",
        model: "Note 13 Pro",
        color: "Black",
        storage: "256 GB",
        battery: null,
        quantity: 2,
        priceUSD: 245
    },

    {
        id: crypto.randomUUID(),
        category: "Teléfono",
        brand: "Honor",
        model: "X8b",
        color: "Green",
        storage: "256 GB",
        battery: null,
        quantity: 1,
        priceUSD: 185
    },

    {
        id: crypto.randomUUID(),
        category: "Teléfono",
        brand: "Infinix",
        model: "Note 40",
        color: "Titan Gold",
        storage: "256 GB",
        battery: null,
        quantity: 2,
        priceUSD: 175
    },

    {
        id: crypto.randomUUID(),
        category: "Artículo",
        brand: "",
        model: "Cargador USB-C 25W",
        color: "White",
        storage: "",
        battery: null,
        quantity: 5,
        priceUSD: 12
    }

];


/* =========================
   ESTADO
========================= */

let products = [];

let adminUnlocked = false;

let editingProductId = null;


/* =========================
   ELEMENTOS HTML
========================= */

const searchInput =
    document.getElementById("searchInput");

const brandFilter =
    document.getElementById("brandFilter");

const availabilityFilter =
    document.getElementById("availabilityFilter");

const sortFilter =
    document.getElementById("sortFilter");

const productGrid =
    document.getElementById("productGrid");

const emptyState =
    document.getElementById("emptyState");

const resultText =
    document.getElementById("resultText");

const clearSearch =
    document.getElementById("clearSearch");

const adminSearch =
    document.getElementById("adminSearch");

const adminTable =
    document.getElementById("adminTable");

const adminPin =
    document.getElementById("adminPin");

const pinError =
    document.getElementById("pinError");

const pinView =
    document.getElementById("pinView");

const adminView =
    document.getElementById("adminView");

const importFile =
    document.getElementById("importFile");


/* =========================
   INICIO
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

        normalizeProducts();

        setupEvents();

        updateBrandFilter();

        populateFormOptions();

        render();

        updateStats();

        updateLastUpdate();

        updateFooterDate();

    }
);


/* =========================
   EVENTOS
========================= */

function setupEvents() {

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                render();

                updateClearButton();

            }
        );

    }


    if (brandFilter) {

        brandFilter.addEventListener(
            "change",
            render
        );

    }


    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            render
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            render
        );

    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value = "";

                }

                render();

                updateClearButton();

                if (searchInput) {

                    searchInput.focus();

                }

            }
        );

    }


    if (adminSearch) {

        adminSearch.addEventListener(
            "input",
            renderAdmin
        );

    }


    if (importFile) {

        importFile.addEventListener(
            "change",
            handleImport
        );

    }


    if (adminPin) {

        adminPin.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    unlockAdmin();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                if (searchInput) {

                    searchInput.focus();

                    searchInput.select();

                }

            }

        }
    );

}


/* =========================
   CARGAR PRODUCTOS
========================= */

function loadProducts() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {

                products = parsed;

                return;

            }

        }

    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );

    }


    products =
        structuredClone(
            defaultProducts
        );

    saveProducts();

}


/* =========================
   NORMALIZAR DATOS
========================= */

function normalizeProducts() {

    products =
        products.map(product => {

            return {

                id:
                    product.id ||
                    crypto.randomUUID(),

                category:
                    product.category ||
                    "Teléfono",

                brand:
                    PHONE_BRANDS.includes(
                        product.brand
                    )
                        ? product.brand
                        : (
                            product.category ===
                            "Artículo"
                                ? ""
                                : "Apple"
                        ),

                model:
                    product.model ||
                    "",

                color:
                    product.color ||
                    "",

                storage:
                    product.storage ||
                    "",

                battery:
                    product.battery === "" ||
                    product.battery === undefined
                        ? null
                        : product.battery,

                quantity:
                    Number(
                        product.quantity || 0
                    ),

                priceUSD:
                    Number(
                        product.priceUSD ??
                        product.price ??
                        0
                    )

            };

        });

    saveProducts();

}


/* =========================
   GUARDAR
========================= */

function saveProducts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

    localStorage.setItem(
        UPDATED_KEY,
        new Date().toISOString()
    );

}


/* =========================
   CONVERSIÓN DE MONEDA
========================= */

function usdToNio(priceUSD) {

    return (
        Number(priceUSD || 0) *
        EXCHANGE_RATE
    );

}


function formatUSD(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(
        Number(value || 0)
    );

}


function formatNIO(value) {

    return new Intl.NumberFormat(
        "es-NI",
        {
            style: "currency",
            currency: "NIO",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(
        Number(value || 0)
    );

}


/* =========================
   ESTADÍSTICAS
========================= */

function updateStats() {

    const modelCount =
        document.getElementById(
            "modelCount"
        );

    const unitCount =
        document.getElementById(
            "unitCount"
        );

    const brandCount =
        document.getElementById(
            "brandCount"
        );


    const phoneProducts =
        products.filter(
            product =>
                product.category ===
                "Teléfono"
        );


    const brands =
        new Set(
            phoneProducts.map(
                product =>
                    product.brand
            )
        );


    const units =
        products.reduce(
            (
                total,
                product
            ) => {

                return (
                    total +
                    Number(
                        product.quantity || 0
                    )
                );

            },
            0
        );


    if (modelCount) {

        modelCount.textContent =
            products.length;

    }


    if (unitCount) {

        unitCount.textContent =
            units;

    }


    if (brandCount) {

        brandCount.textContent =
            brands.size;

    }

}


/* =========================
   FILTRO DE MARCAS
========================= */

function updateBrandFilter() {

    if (!brandFilter) return;


    const current =
        brandFilter.value ||
        "all";


    brandFilter.innerHTML = `

        <option value="all">
            Todas las marcas
        </option>

        ${PHONE_BRANDS.map(
            brand => `

                <option
                    value="${escapeHtml(brand)}"
                >

                    ${escapeHtml(brand)}

                </option>

            `
        ).join("")}

        <option value="Artículo">
            Artículos
        </option>

    `;


    if (
        PHONE_BRANDS.includes(
            current
        ) ||
        current === "Artículo"
    ) {

        brandFilter.value =
            current;

    } else {

        brandFilter.value =
            "all";

    }

}


/* =========================
   OPCIONES DEL FORMULARIO
========================= */

function populateFormOptions() {

    const typeSelect =
        document.getElementById(
            "productCategory"
        );


    if (
        typeSelect &&
        typeSelect.tagName === "SELECT"
    ) {

        typeSelect.innerHTML = `

            <option value="Teléfono">
                Teléfono
            </option>

            <option value="Artículo">
                Artículo
            </option>

        `;

    }


    const brandSelect =
        document.getElementById(
            "productBrand"
        );


    if (
        brandSelect &&
        brandSelect.tagName === "SELECT"
    ) {

        brandSelect.innerHTML = `

            <option value="">
                Sin marca
            </option>

            ${PHONE_BRANDS.map(
                brand => `

                    <option
                        value="${escapeHtml(brand)}"
                    >

                        ${escapeHtml(brand)}

                    </option>

                `
            ).join("")}

        `;

    }

}


/* =========================
   FILTRAR PRODUCTOS
========================= */

function getFilteredProducts() {

    const search =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const brand =
        brandFilter?.value ||
        "all";


    const availability =
        availabilityFilter?.value ||
        "available";


    const sort =
        sortFilter?.value ||
        "default";


    let filtered =
        [...products];


    /* BUSCADOR */

    if (search) {

        filtered =
            filtered.filter(
                product => {

                    const text = [

                        product.category,

                        product.brand,

                        product.model,

                        product.color,

                        product.storage

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    /* MARCA / ARTÍCULO */

    if (
        brand !== "all"
    ) {

        if (
            brand === "Artículo"
        ) {

            filtered =
                filtered.filter(
                    product =>
                        product.category ===
                        "Artículo"
                );

        } else {

            filtered =
                filtered.filter(
                    product =>
                        product.brand ===
                        brand
                );

        }

    }


    /* DISPONIBILIDAD */

    if (
        availability ===
        "available"
    ) {

        filtered =
            filtered.filter(
                product =>
                    Number(
                        product.quantity
                    ) > 0
            );

    }


    if (
        availability ===
        "out"
    ) {

        filtered =
            filtered.filter(
                product =>
                    Number(
                        product.quantity
                    ) <= 0
            );

    }


    /* ORDEN */

    switch (sort) {

        case "priceLow":

            filtered.sort(
                (a, b) =>
                    Number(
                        a.priceUSD
                    ) -
                    Number(
                        b.priceUSD
                    )
            );

            break;


        case "priceHigh":

            filtered.sort(
                (a, b) =>
                    Number(
                        b.priceUSD
                    ) -
                    Number(
                        a.priceUSD
                    )
            );

            break;


        case "name":

            filtered.sort(
                (a, b) =>
                    `${a.brand} ${a.model}`
                        .localeCompare(
                            `${b.brand} ${b.model}`
                        )
            );

            break;

    }


    return filtered;

}


/* =========================
   MOSTRAR CATÁLOGO
========================= */

function render() {

    const filtered =
        getFilteredProducts();


    if (productGrid) {

        productGrid.innerHTML =
            filtered
                .map(
                    productCard
                )
                .join("");

    }


    if (emptyState) {

        emptyState.hidden =
            filtered.length !== 0;

    }


    if (resultText) {

        const count =
            filtered.length;


        resultText.textContent =
            `${count} ${
                count === 1
                    ? "producto"
                    : "productos"
            }`;

    }


    updateClearButton();

}


/* =========================
   TARJETA DE PRODUCTO
========================= */

function productCard(product) {

    const quantity =
        Number(
            product.quantity || 0
        );


    const available =
        quantity > 0;


    const stockText =
        available
            ? "Disponible"
            : "Agotado";


    const stockClass =
        available
            ? ""
            : "out";


    const isPhone =
        product.category ===
        "Teléfono";


    const priceNIO =
        usdToNio(
            product.priceUSD
        );


    return `

        <article
            class="product-card"
        >

            <div
                class="product-top"
            >

                <span
                    class="product-brand"
                >

                    ${
                        product.brand
                            ? escapeHtml(
                                product.brand
                            )
                            : "JR CONNECTION"
                    }

                </span>


                <span
                    class="stock-badge ${stockClass}"
                >

                    <i class="bi ${
                        available
                            ? "bi-check-circle"
                            : "bi-x-circle"
                    }"></i>

                    ${stockText}

                </span>

            </div>


            <div
                class="product-type"
            >

                ${escapeHtml(
                    product.category
                )}

            </div>


            <h3
                class="product-name"
            >

                ${escapeHtml(
                    product.model ||
                    "Sin nombre"
                )}

            </h3>


            <!-- PRECIO PRINCIPAL -->

            <div
                class="product-price"
            >

                ${formatUSD(
                    product.priceUSD
                )}

            </div>


            <!-- CONVERSIÓN -->

            <div
                class="product-price-nio"
            >

                ${formatNIO(
                    priceNIO
                )}

                <span>
                    C$
                </span>

            </div>


            <div
                class="exchange-info"
            >

                Tasa: C$${EXCHANGE_RATE.toFixed(2)}
                por US$1

            </div>


            <div
                class="product-info"
            >


                ${
                    product.color
                        ? `

                            <span
                                class="info-chip"
                            >

                                <i
                                    class="bi bi-palette"
                                ></i>

                                ${escapeHtml(
                                    product.color
                                )}

                            </span>

                        `
                        : ""
                }


                ${
                    isPhone &&
                    product.storage
                        ? `

                            <span
                                class="info-chip"
                            >

                                <i
                                    class="bi bi-device-ssd"
                                ></i>

                                ${escapeHtml(
                                    product.storage
                                )}

                            </span>

                        `
                        : ""
                }


                ${
                    isPhone &&
                    product.battery !== null &&
                    product.battery !== undefined
                        ? `

                            <span
                                class="info-chip"
                            >

                                <i
                                    class="bi bi-battery-half"
                                ></i>

                                ${escapeHtml(
                                    product.battery
                                )}%

                            </span>

                        `
                        : ""
                }


                <span
                    class="info-chip"
                >

                    <i
                        class="bi bi-box"
                    ></i>

                    ${
                        quantity === 1
                            ? "1 unidad"
                            : `${quantity} unidades`
                    }

                </span>


            </div>


            <button
                class="copy-btn"
                type="button"
                onclick="copyProduct('${product.id}')"
            >

                <i
                    class="bi bi-clipboard"
                ></i>

                Copiar información

            </button>


        </article>

    `;

}


/* =========================
   COPIAR PRODUCTO
========================= */

async function copyProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    const priceNIO =
        usdToNio(
            product.priceUSD
        );


    const lines = [

        product.category ===
        "Artículo"

            ? `📦 ${product.model}`

            : `📱 ${product.brand} ${product.model}`,

        product.storage
            ? `💾 ${product.storage}`
            : null,

        product.color
            ? `🎨 ${product.color}`
            : null,

        product.battery !== null &&
        product.battery !== undefined
            ? `🔋 Batería: ${product.battery}%`
            : null,

        `💵 ${formatUSD(
            product.priceUSD
        )}`,

        `🇳🇮 ${formatNIO(
            priceNIO
        )}`,

        `📦 ${
            Number(product.quantity) > 0
                ? `${product.quantity} disponible(s)`
                : "Agotado"
        }`

    ]
    .filter(Boolean);


    const text =
        lines.join("\n");


    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Información copiada"
        );

    } catch {

        fallbackCopy(text);

    }

}


/* =========================
   COPIA ALTERNATIVA
========================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

        showToast(
            "Información copiada"
        );

    } catch {

        showToast(
            "No se pudo copiar"
        );

    }


    textarea.remove();

}


/* =========================
   BUSCADOR
========================= */

function updateClearButton() {

    if (!clearSearch) return;


    clearSearch.hidden =
        !searchInput?.value.trim();

}


/* =========================
   ADMIN
========================= */

function openAdmin() {

    const modalElement =
        document.getElementById(
            "adminModal"
        );


    if (!modalElement) return;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    if (adminUnlocked) {

        showAdminView();

    } else {

        showPinView();

    }


    modal.show();

}


function showPinView() {

    if (pinView) {

        pinView.hidden =
            false;

    }


    if (adminView) {

        adminView.hidden =
            true;

    }


    if (adminPin) {

        adminPin.value =
            "";

    }


    if (pinError) {

        pinError.textContent =
            "";

    }

}


function showAdminView() {

    if (pinView) {

        pinView.hidden =
            true;

    }


    if (adminView) {

        adminView.hidden =
            false;

    }


    renderAdmin();

}


/* =========================
   PIN
========================= */

function togglePin() {

    if (!adminPin) return;


    const icon =
        document.querySelector(
            ".pin-input-wrap button i"
        );


    if (
        adminPin.type ===
        "password"
    ) {

        adminPin.type =
            "text";


        if (icon) {

            icon.className =
                "bi bi-eye-slash";

        }

    } else {

        adminPin.type =
            "password";


        if (icon) {

            icon.className =
                "bi bi-eye";

        }

    }

}


/* =========================
   DESBLOQUEAR ADMIN
========================= */

function unlockAdmin() {

    const pin =
        adminPin?.value.trim();


    if (
        pin ===
        ADMIN_PIN
    ) {

        adminUnlocked =
            true;


        if (pinError) {

            pinError.textContent =
                "";

        }


        showAdminView();


        showToast(
            "Modo administrador activado"
        );

    } else {

        if (pinError) {

            pinError.textContent =
                "PIN incorrecto.";

        }


        if (adminPin) {

            adminPin.value =
                "";

            adminPin.focus();

        }

    }

}


/* =========================
   TABLA ADMIN
========================= */

function renderAdmin() {

    if (!adminTable) return;


    const search =
        (
            adminSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    let filtered =
        [...products];


    if (search) {

        filtered =
            filtered.filter(
                product => {

                    const text = [

                        product.category,

                        product.brand,

                        product.model,

                        product.color,

                        product.storage

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    adminTable.innerHTML =
        filtered
            .map(
                adminRow
            )
            .join("");


    if (!filtered.length) {

        adminTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No se encontraron productos.

                </td>

            </tr>

        `;

    }

}


/* =========================
   FILA ADMIN
========================= */

function adminRow(product) {

    const priceNIO =
        usdToNio(
            product.priceUSD
        );


    const battery =
        product.battery !== null &&
        product.battery !== undefined
            ? `${product.battery}%`
            : "—";


    return `

        <tr>

            <td>

                ${escapeHtml(
                    product.category
                )}

            </td>


            <td>

                <strong>

                    ${
                        product.brand
                            ? escapeHtml(
                                product.brand
                            )
                            : "—"
                    }

                    ${escapeHtml(
                        product.model
                    )}

                </strong>

            </td>


            <td>

                ${escapeHtml(
                    product.color ||
                    "—"
                )}

            </td>


            <td>

                ${escapeHtml(
                    product.storage ||
                    "—"
                )}

            </td>


            <td>

                ${battery}

            </td>


            <td>

                ${Number(
                    product.quantity ||
                    0
                )}

            </td>


            <td>

                <strong>
                    ${formatUSD(
                        product.priceUSD
                    )}
                </strong>

                <br>

                <small>
                    ${formatNIO(
                        priceNIO
                    )}
                </small>

            </td>


            <td>

                <button
                    class="table-action"
                    type="button"
                    onclick="openProductForm('${product.id}')"
                >

                    <i
                        class="bi bi-pencil"
                    ></i>

                </button>


                <button
                    class="table-action delete"
                    type="button"
                    onclick="deleteProduct('${product.id}')"
                >

                    <i
                        class="bi bi-trash"
                    ></i>

                </button>

            </td>

        </tr>

    `;

}


/* =========================
   FORMULARIO
========================= */

function openProductForm(
    id = null
) {

    if (!adminUnlocked) {

        showToast(
            "Primero desbloquea administración"
        );

        return;

    }


    editingProductId =
        id;


    const title =
        document.getElementById(
            "productModalTitle"
        );


    const category =
        document.getElementById(
            "productCategory"
        );


    const brand =
        document.getElementById(
            "productBrand"
        );


    const model =
        document.getElementById(
            "productModel"
        );


    const color =
        document.getElementById(
            "productColor"
        );


    const storage =
        document.getElementById(
            "productStorage"
        );


    const battery =
        document.getElementById(
            "productBattery"
        );


    const quantity =
        document.getElementById(
            "productQuantity"
        );


    const price =
        document.getElementById(
            "productPrice"
        );


    if (id) {

        const product =
            products.find(
                item =>
                    item.id === id
            );


        if (!product) return;


        title.textContent =
            "Editar producto";


        category.value =
            product.category;


        brand.value =
            product.brand;


        model.value =
            product.model;


        color.value =
            product.color;


        storage.value =
            product.storage;


        battery.value =
            product.battery ?? "";


        quantity.value =
            product.quantity;


        price.value =
            product.priceUSD;

    } else {

        title.textContent =
            "Nuevo producto";


        category.value =
            "Teléfono";


        brand.value =
            "Apple";


        model.value =
            "";


        color.value =
            "";


        storage.value =
            "128 GB";


        battery.value =
            "";


        quantity.value =
            1;


        price.value =
            "";

    }


    updateFormFields();


    const modalElement =
        document.getElementById(
            "productModal"
        );


    if (!modalElement) return;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =========================
   MOSTRAR/OCULTAR CAMPOS
========================= */

function updateFormFields() {

    const category =
        document.getElementById(
            "productCategory"
        );


    if (!category) return;


    const isPhone =
        category.value ===
        "Teléfono";


    const brand =
        document.getElementById(
            "productBrand"
        );


    const storage =
        document.getElementById(
            "productStorage"
        );


    const battery =
        document.getElementById(
            "productBattery"
        );


    /*
       Los campos pueden existir o no
       dependiendo del HTML.
    */

    if (brand) {

        brand.disabled =
            !isPhone;

    }


    if (storage) {

        storage.disabled =
            !isPhone;

    }


    if (battery) {

        battery.disabled =
            !isPhone;

    }


    /*
       Si tu HTML tiene contenedores
       específicos para estos campos,
       también los ocultamos.
    */

    [
        "brandGroup",
        "storageGroup",
        "batteryGroup"
    ]
    .forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.style.display =
                    isPhone
                        ? ""
                        : "none";

            }

        }
    );

}


/* =========================
   GUARDAR PRODUCTO
========================= */

function saveProduct() {

    if (!adminUnlocked) {

        showToast(
            "No tienes permisos"
        );

        return;

    }


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const brand =
        document.getElementById(
            "productBrand"
        ).value.trim();


    const model =
        document.getElementById(
            "productModel"
        ).value.trim();


    const color =
        document.getElementById(
            "productColor"
        ).value.trim();


    const storage =
        document.getElementById(
            "productStorage"
        ).value.trim();


    const batteryValue =
        document.getElementById(
            "productBattery"
        ).value.trim();


    const quantity =
        Number(
            document.getElementById(
                "productQuantity"
            ).value
        );


    const priceUSD =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    /* VALIDACIONES */

    if (!CATEGORIES.includes(category)) {

        showToast(
            "Categoría inválida"
        );

        return;

    }


    if (!model) {

        showToast(
            "Escribe el nombre o modelo"
        );

        return;

    }


    if (
        category === "Teléfono" &&
        !PHONE_BRANDS.includes(
            brand
        )
    ) {

        showToast(
            "Selecciona una marca válida"
        );

        return;

    }


    if (
        Number.isNaN(priceUSD) ||
        priceUSD < 0
    ) {

        showToast(
            "Escribe un precio válido en dólares"
        );

        return;

    }


    if (
        Number.isNaN(quantity) ||
        quantity < 0
    ) {

        showToast(
            "Escribe una cantidad válida"
        );

        return;

    }


    let battery =
        null;


    if (
        category === "Teléfono" &&
        batteryValue !== ""
    ) {

        battery =
            Number(
                batteryValue
            );


        if (
            Number.isNaN(battery) ||
            battery < 0 ||
            battery > 100
        ) {

            showToast(
                "La batería debe estar entre 0 y 100"
            );

            return;

        }

    }


    const productData = {

        category,

        brand:
            category === "Teléfono"
                ? brand
                : "",

        model,

        color,

        storage:
            category === "Teléfono"
                ? storage
                : "",

        battery,

        quantity,

        /*
           MUY IMPORTANTE:
           AQUÍ SOLO GUARDAMOS USD.
        */

        priceUSD

    };


    if (editingProductId) {

        const index =
            products.findIndex(
                product =>
                    product.id ===
                    editingProductId
            );


        if (index !== -1) {

            products[index] = {

                ...products[index],

                ...productData

            };

        }

    } else {

        products.push({

            id:
                crypto.randomUUID(),

            ...productData

        });

    }


    saveProducts();

    updateBrandFilter();

    updateStats();

    updateLastUpdate();

    render();

    renderAdmin();


    const modalElement =
        document.getElementById(
            "productModal"
        );


    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal) {

        modal.hide();

    }


    showToast(
        editingProductId
            ? "Producto actualizado"
            : "Producto agregado"
    );


    editingProductId =
        null;

}


/* =========================
   ELIMINAR
========================= */

function deleteProduct(id) {

    if (!adminUnlocked) {

        showToast(
            "No tienes permisos"
        );

        return;

    }


    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    const confirmed =
        confirm(
            `¿Eliminar "${product.model}" del catálogo?`
        );


    if (!confirmed) return;


    products =
        products.filter(
            item =>
                item.id !== id
        );


    saveProducts();

    updateBrandFilter();

    updateStats();

    updateLastUpdate();

    render();

    renderAdmin();


    showToast(
        "Producto eliminado"
    );

}


/* =========================
   EXPORTAR
========================= */

function exportData() {

    if (!adminUnlocked) {

        showToast(
            "No tienes permisos"
        );

        return;

    }


    const data = {

        app:
            "Jr Connection Price Desk",

        version:
            4,

        exchangeRate:
            EXCHANGE_RATE,

        exportedAt:
            new Date().toISOString(),

        products

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `jr-connection-respaldo-${
            new Date()
                .toISOString()
                .slice(0, 10)
        }.json`;


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Respaldo descargado"
    );

}


/* =========================
   IMPORTAR
========================= */

async function handleImport(event) {

    const file =
        event.target.files?.[0];


    if (!file) return;


    try {

        const text =
            await file.text();


        const data =
            JSON.parse(
                text
            );


        const importedProducts =
            Array.isArray(data)
                ? data
                : data.products;


        if (
            !Array.isArray(
                importedProducts
            )
        ) {

            throw new Error(
                "Formato inválido"
            );

        }


        const confirmed =
            confirm(
                `Se importarán ${importedProducts.length} productos. ¿Continuar?`
            );


        if (!confirmed) {

            event.target.value =
                "";

            return;

        }


        products =
            importedProducts.map(
                product => ({

                    id:
                        product.id ||
                        crypto.randomUUID(),

                    category:
                        product.category ||
                        "Teléfono",

                    brand:
                        product.brand ||
                        "",

                    model:
                        product.model ||
                        "",

                    color:
                        product.color ||
                        "",

                    storage:
                        product.storage ||
                        "",

                    battery:
                        product.battery ??
                        null,

                    quantity:
                        Number(
                            product.quantity ||
                            0
                        ),

                    priceUSD:
                        Number(
                            product.priceUSD ??
                            product.price ??
                            0
                        )

                })
            );


        normalizeProducts();

        updateBrandFilter();

        updateStats();

        updateLastUpdate();

        render();

        renderAdmin();


        showToast(
            "Catálogo importado correctamente"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "No se pudo importar el archivo"
        );

    }


    event.target.value =
        "";

}


/* =========================
   ACTUALIZACIONES
========================= */

function updateLastUpdate() {

    const element =
        document.getElementById(
            "lastUpdate"
        );


    if (!element) return;


    const value =
        localStorage.getItem(
            UPDATED_KEY
        );


    if (!value) {

        element.textContent =
            "Sin actualizar";

        return;

    }


    const date =
        new Date(
            value
        );


    element.textContent =
        "Actualizado " +
        date.toLocaleDateString(
            "es-NI",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


function updateFooterDate() {

    const element =
        document.getElementById(
            "footerDate"
        );


    if (!element) return;


    element.textContent =
        new Date()
            .toLocaleDateString(
                "es-NI",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

}


/* =========================
   NAVEGACIÓN
========================= */

function scrollToCatalog() {

    const catalog =
        document.getElementById(
            "catalog"
        );


    if (catalog) {

        catalog.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "jrToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "jrToast";


        Object.assign(
            toast.style,
            {

                position: "fixed",

                right: "20px",

                bottom: "20px",

                zIndex: "99999",

                padding: "12px 16px",

                borderRadius: "10px",

                background: "#151b25",

                color: "#ffffff",

                fontSize: "13px",

                fontFamily:
                    "Inter, system-ui, sans-serif",

                boxShadow:
                    "0 15px 40px rgba(0,0,0,.4)",

                transition:
                    "opacity .2s ease"

            }
        );


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.opacity =
        "1";


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

            },
            2200
        );

}


/* =========================
   ESCAPAR HTML
========================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================
   FUNCIONES GLOBALES
========================= */

window.openAdmin =
    openAdmin;

window.unlockAdmin =
    unlockAdmin;

window.togglePin =
    togglePin;

window.openProductForm =
    openProductForm;

window.saveProduct =
    saveProduct;

window.deleteProduct =
    deleteProduct;

window.exportData =
    exportData;

window.copyProduct =
    copyProduct;

window.scrollToCatalog =
    scrollToCatalog;

window.render =
    render;

window.updateFormFields =
    updateFormFields;