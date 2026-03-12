//#regionInicio

class Usuario {
    constructor(_usuario, _password, _pais) {
        this.usuario = _usuario
        this.password = _password
        this.idPais = _pais
    }
}

class UsuarioLogueado {
    constructor(_usuario, _password) {
        this.usuario = _usuario
        this.password = _password
    }
}

class Pelicula {
    constructor(_categoria, _nombre, _fecha) {
        this.idCategoria = _categoria
        this.nombre = _nombre
        this.fecha = _fecha
    }
}

const MENU = document.querySelector("#menu")
const ROUTER = document.querySelector("#router")
const HOME = document.querySelector("#home")
const LOGIN = document.querySelector("#login")
const REGISTRARSE = document.querySelector("#registrarse")
const AGREGAR = document.querySelector("#agregar")
const LISTADO = document.querySelector("#listado")
const ESTADISTICAS = document.querySelector("#estadisticas")
const MAPA = document.querySelector("#mapa")
const URLBASE = "https://movielist.develotion.com"

inicio()
let categorias = []
let peliculas = []
let map = null
let paises = []
let usuariosPais = []

function cerrarMenu() {
    MENU.close()
}

function inicio() {
    previaListaPaises()

    ocultarTodo()
    ocultarMenu()
    if (localStorage.getItem("token") == null) {
        mostrarMenuComun()
        HOME.style.display = "block"
    } else {
        mostrarMenuVIP()
        previaListaCategorias()
        previaListaPeliculas()
        cargarListaPaises()
        cargarListaUsuarios()
        HOME.style.display = "block"
    }

    document.querySelector("#slcFiltrado").addEventListener("ionChange", function (event) {
        filtrarPeliculas(event.detail.value)
    })


    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrarse").addEventListener("click", previaRegistro)
    document.querySelector("#btnLogin").addEventListener("click", previaLogin)
    document.querySelector("#btnAgregar").addEventListener("click", previaEvaluarPelicula)
    document.querySelector("#btnListadoPage").addEventListener("click", previaListaPeliculas)
    document.querySelector("#btnLogoutPage").addEventListener("click", cerrarSesion)
    document.querySelector("#btnMapaPage").addEventListener("click", mostrarMapa)
    document.querySelector("#btnEstadisticasPage").addEventListener("click", mostrarEstadisticas)
    document.querySelector("#btnEstadisticasPage").addEventListener("click", mostrarPorcentajes)

}

function navegar(evt) {
    const ruta = evt.detail.to
    ocultarTodo()
    if (ruta == "/") HOME.style.display = "block"
    if (ruta == "/registrarse") REGISTRARSE.style.display = "block"
    if (ruta == "/login") LOGIN.style.display = "block"
    if (ruta == "/agregar") AGREGAR.style.display = "block"
    if (ruta == "/listado") LISTADO.style.display = "block"
    if (ruta == "/estadisticas") ESTADISTICAS.style.display = "block"
    if (ruta == "/mapa") MAPA.style.display = "block"
}


//#endregionInicio

//#regionOcultarMostrar
function ocultarTodo() {
    HOME.style.display = "none"
    REGISTRARSE.style.display = "none"
    LOGIN.style.display = "none"
    AGREGAR.style.display = "none"
    LISTADO.style.display = "none"
    ESTADISTICAS.style.display = "none"
    MAPA.style.display = "none"
}

function ocultarMenu() {
    document.querySelector("#btnRegistrarsePage").style.display = "none"
    document.querySelector("#btnLoginPage").style.display = "none"
    document.querySelector("#btnLogoutPage").style.display = "none"
    document.querySelector("#btnAgregarPage").style.display = "none"
    document.querySelector("#btnListadoPage").style.display = "none"
    document.querySelector("#btnEstadisticasPage").style.display = "none"
    document.querySelector("#btnMapaPage").style.display = "none"
}
function mostrarMenuComun() {
    document.querySelector("#btnRegistrarsePage").style.display = "block"
    document.querySelector("#btnLoginPage").style.display = "block"
}
function mostrarMenuVIP() {
    document.querySelector("#btnAgregarPage").style.display = "block"
    document.querySelector("#btnListadoPage").style.display = "block"
    document.querySelector("#btnEstadisticasPage").style.display = "block"
    document.querySelector("#btnMapaPage").style.display = "block"
    document.querySelector("#btnLogoutPage").style.display = "block"


}

function mensajeAlert(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}
//#endregionOcultarMostrar

//#regionRegistro
function previaListaPaises() {
    fetch("https://movielist.develotion.com/paises")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            cargarListaPaises(data.paises)
        })
        .catch(function (error) {
            console.log(error);
        })
}

function cargarListaPaises(listaPaises) {
    let miSelect = ""
    for (let unP of listaPaises) {
        miSelect += `<ion-select-option value="${unP.id}">${unP.nombre}</ion-select-option>`
    }
    document.querySelector("#slcPaisU").innerHTML = miSelect
}

function previaRegistro() {

    let usuario = document.querySelector("#txtNomU").value
    let pass = document.querySelector("#txtPassU").value
    let pais = Number(document.querySelector("#slcPaisU").value)
    let nuevoU = new Usuario(usuario, pass, pais)
    registrarUsuario(nuevoU)
}

function registrarUsuario(nuevoU) {

    fetch(`${URLBASE}/usuariosPais`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoU)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (data.codigo == 200) {
                mensajeAlert("SUCCESS", "Usuario creado con éxito", "", 3000)
                localStorage.setItem("token", data.token)
                ocultarMenu()
                mostrarMenuVIP()
                ocultarTodo()
                HOME.style.display = "block"
                document.querySelector("#txtNomU").value = ""
                document.querySelector("#txtPassU").value = ""
                document.querySelector("#slcPaisU").value = ""
            } else {
                mensajeAlert("ERROR", data.mensaje, "", 3000)
            }

        })
        .catch(function (error) {
        })
}

//#endregionRegistro

//#regionSesion

function previaLogin() {
    let usuario = document.querySelector("#txtUsuario").value
    let password = document.querySelector("#txtPass").value
    let usuarioLogueado = new UsuarioLogueado(usuario, password)
    login(usuarioLogueado)
}

function login(usuarioLogueado) {
    fetch(`${URLBASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioLogueado)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (data.codigo == 200) {
                localStorage.setItem("token", data.token)
                mensajeAlert("SUCCESS", "Inicio de sesión exitoso", "", 3000)
                document.querySelector("#txtUsuario").value = ""
                document.querySelector("#txtPass").value = ""
                inicio()
            } else {
                mensajeAlert("ERROR", data.mensaje, "", 3000)
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function cerrarSesion() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    inicio()
}

//#endregionSesion

//#regionPeliculas

function previaListaCategorias() {

    fetch(`${URLBASE}/categorias`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            categorias = info.categorias
            cargarCategorias(info.categorias)
        })
        .catch(function (error) {
            console.log(error);
        })
}

function cargarCategorias(listaCategorias) {
    let miSelect = `<ion-select-option value="">Seleccione una...</ion-select-option>`
    for (let unaC of listaCategorias) {
        miSelect += `<ion-select-option value="${unaC.id}">${unaC.nombre} ${unaC.emoji}</ion-select-option>`
    }
    document.querySelector("#slcCategoria").innerHTML = miSelect
}

function previaEvaluarPelicula(pelicula) {
    let comentario = document.querySelector("#txtComentario").value
    let prompt = new Object()
    prompt.prompt = comentario
    evaluarPelicula(prompt)
}

function evaluarPelicula(prompt) {

    fetch(`${URLBASE}/genai`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(prompt)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            if (!info.error) {
                if (info.score > 0) {
                    previaAgregarPelicula()
                } else {
                    mensajeAlert("ERROR", info.comment, "", 3000)
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function previaAgregarPelicula() {
    let slc = document.querySelector("#slcCategoria").value
    let nombre = document.querySelector("#txtNomPeli").value
    let fecha = document.querySelector("#txtFechaViPeli").value

    let nuevaPeli = new Pelicula(slc, nombre, fecha)

    agregarPelicula(nuevaPeli)
}

function agregarPelicula(nuevaPeli) {

    fetch(`${URLBASE}/peliculas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(nuevaPeli)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            if (informacion.error == null) {
                mensajeAlert("SUCCESS", "Película registrada con éxito", "", 3000)
                ocultarTodo()
                LISTADO.style.display = "block"
                previaListaPeliculas()
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function previaListaPeliculas() {
    fetch(`${URLBASE}/peliculas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            peliculas = info.peliculas
            listadoPeliculas()
        })
        .catch(function (error) {
            console.log(error);
        })
}

function obtenerNombreCategoria(idCategoria) {
    for (let cat of categorias) {
        if (cat.id == idCategoria) return cat.nombre
    }
    return "Categoría no encontrada"
}

function obtenerEmojiCategoria(idCategoria) {
    for (let cat of categorias) {
        if (cat.id == idCategoria) return cat.emoji
    }
    return "Emoji no encontrado"
}

function listadoPeliculas() {
    document.querySelector("#slcServicio").addEventListener("change", () => {
        let filtro = document.querySelector("#slcFiltrado").value
        filtrarPeliculas(filtro)
    })
}

function filtrarPeliculas(filtro) {
    let miLista = ""
    let hoy = new Date()
    if (filtro == "") {
        for (let unaP of peliculas) {
            miLista += `<ion-card>
                            <ion-card-header>
                                <ion-card-title>${unaP.nombre}</ion-card-title>
                                <ion-card-subtitle>${obtenerNombreCategoria(unaP.idCategoria)} ${obtenerEmojiCategoria(unaP.idCategoria)}</ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                <p>Fecha: ${unaP.fechaEstreno}</p>
                            </ion-card-content>
                            <ion-button onclick="eliminarPelicula(${unaP.id})">Eliminar</ion-button>
                        </ion-card>`
        }
    } else if (filtro == "s") {
        let unaSemana = new Date()
        unaSemana.setDate(hoy.getDate() - 7)
        for (let unaP of peliculas) {
            let fechaEstreno = new Date(unaP.fechaEstreno)
            if (fechaEstreno >= unaSemana && fechaEstreno <= hoy) {
                miLista += `<ion-card>
                <ion-card-header>
                <ion-card-title>${unaP.nombre}</ion-card-title>
                <ion-card-subtitle>${obtenerNombreCategoria(unaP.idCategoria)} ${obtenerEmojiCategoria(unaP.idCategoria)}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                <p>Fecha: ${unaP.fechaEstreno}</p>
                </ion-card-content>
                <ion-button onclick="eliminarPelicula(${unaP.id})">Eliminar</ion-button>
                </ion-card>`
            }
        }
    } else if (filtro == "m") {
        let unMes = new Date()
        unMes.setDate(hoy.getDate() - 30)
        for (let unaP of peliculas) {
            let fechaEstreno = new Date(unaP.fechaEstreno)
            if (fechaEstreno >= unMes && fechaEstreno <= hoy) {
                miLista += `<ion-card>
                <ion-card-header>
                <ion-card-title>${unaP.nombre}</ion-card-title>
                <ion-card-subtitle>${obtenerNombreCategoria(unaP.idCategoria)} ${obtenerEmojiCategoria(unaP.idCategoria)}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                <p>Fecha: ${unaP.fechaEstreno}</p>
                </ion-card-content>
                <ion-button onclick="eliminarPelicula(${unaP.id})">Eliminar</ion-button>
                </ion-card>`
            }
        }
    }
    document.querySelector("#divListado").innerHTML = miLista
}

function eliminarPelicula(idPelicula) {
        fetch(`${URLBASE}/peliculas/${idPelicula}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },

        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data && data.error) {
                    mensajeAlert("ERROR", data.error, "", 3000)
                    throw data.error;
                } else {
                    mensajeAlert("SUCCESS", "Película eliminada con éxito", "", 3000)
                    previaListaPeliculas()
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

//#endregionPeliculas

// #regionMapa

function cargarListaPaises() {

    fetch(`${URLBASE}/paises`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            paises = []
            paises = info.paises
        })
        .catch(function (error) {
            console.log(error)
        })
}
function cargarListaUsuarios() {

    fetch(`${URLBASE}/usuariosPorPais`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            usuariosPais = []
            for (let unP of info.paises) {
                usuariosPais.push({ nombre: unP.nombre, cantidadDeUsuarios: unP.cantidadDeUsuarios })
            }
            console.log("Info: ",info)
            console.log("usuariosPais: ",usuariosPais)
        })
        .catch(function (error) {
            console.log(error)
        })
}

    function mostrarMapa() {
        if (map != null) {
            map.remove()
        }
        map = L.map('elMapa').setView([-15.6000, -60.0000], 3);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        //  for que recorre lista de paises y crear marcadores

        for (let unP of paises){
            var marker = L.marker([unP.latitud, unP.longitud]).addTo(map);
            for (let unUP of usuariosPais){
                if (unP.nombre == unUP.nombre){
                    marker.bindPopup(`<b>${unP.nombre}</b><br>Usuarios: ${unUP.cantidadDeUsuarios}`).openPopup();
                }
            }
        }
    }

//#endregionMapa

//#regionEstadisticas

    function mostrarEstadisticas() {

        miTexto = ""
        let contador
        for (let unaC of categorias) {
            contador = 0
            for (let unaP of peliculas) {
                if (unaC.id == unaP.idCategoria)
                    contador++

            }
            miTexto += `<ion-item button="true">
                        <ion-label>${unaC.emoji} ${unaC.nombre}</ion-label>
                        <ion-note slot="end">${contador}</ion-note>
                    </ion-item>`
        }
        document.querySelector("#estadisticaUsuario").innerHTML = miTexto
    }

    function mostrarPorcentajes() {

        let totalPeliculas = peliculas.length
        let cantidadMas12 = 0
        let cantidadOtras = 0

        for (let unaP of peliculas) {
            if (obtenerEdadCategoria(unaP.idCategoria) > 12) {
                cantidadMas12++
            } else {
                cantidadOtras++
            }
        }
        let porcentajeMas12 = (cantidadMas12 / totalPeliculas) * 100
        let porcentajeOtras = (cantidadOtras / totalPeliculas) * 100
        let miTexto = `<ion-item button="true">
                            <ion-label>Películas para mayores de 12</ion-label>
                            <ion-note slot="end"> % ${porcentajeMas12}</ion-note>
                    </ion-item>
                    <ion-item button="true">
                            <ion-label>Películas aptas para todo público</ion-label>
                            <ion-note slot="end"> % ${porcentajeOtras}</ion-note>
                    </ion-item>`
        document.querySelector("#porcentajeUsuario").innerHTML = miTexto
    }

    function obtenerEdadCategoria(idCategoria) {
        for (let unaC of categorias) {
            if (unaC.id == idCategoria) return unaC.edad_requerida
        }
    }

// #endregionEstadisticas

