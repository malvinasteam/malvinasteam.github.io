let boton = document.getElementsByClassName("camara");

let btnHome = document.getElementsByClassName("btnHome");
let btnSearch = document.getElementsByClassName("btnSearch");
let btnScan = document.getElementsByClassName("btnScan");
let btnMenu = document.getElementsByClassName("btnMenu");

let seccHome = document.getElementsByClassName("home");
let seccSearch = document.getElementsByClassName("search");
let seccScan = document.getElementsByClassName("scan");
let seccMenu = document.getElementsByClassName("menu");

let inputSearch = document.getElementsByClassName("inputSearch");
let btnSearchInput = document.getElementsByClassName("btnSearchInput");
let searchResultado = document.getElementsByClassName("search-result");

let lastSeccion = 1;

btnHome[0].addEventListener("click", function() {
        
    displyaHandlerSection(1);
    lastSeccion = 1;
    stopScan();
});

btnSearch[0].addEventListener("click", function() {
        
    displyaHandlerSection(2);
    lastSeccion = 2;
    stopScan();
});

btnScan[0].addEventListener("click", function() {
        
    displyaHandlerSection(3);
    lastSeccion = 3;
    Scan();
});

btnMenu[0].addEventListener("click", function() {
        
    displyaHandlerSection(4);
    lastSeccion = 4;
    stopScan();
});

const displyaHandlerSection = (section) => {

    switch (section){
        case 1: 
            seccHome[0].classList.remove("all-novisible");
            seccSearch[0].classList.add("all-novisible");
			seccScan[0].classList.add("all-novisible");
            seccMenu[0].classList.add("all-novisible");
        
            btnHome[0].classList.add("icon-down-menu-actived");
            btnSearch[0].classList.remove("icon-down-menu-actived");
			btnScan[0].classList.remove("icon-down-menu-actived");
            btnMenu[0].classList.remove("icon-down-menu-actived");
            break;

        case 2:
            seccSearch[0].classList.remove("all-novisible");
            seccHome[0].classList.add("all-novisible");
			seccScan[0].classList.add("all-novisible");
            seccMenu[0].classList.add("all-novisible");

            btnHome[0].classList.remove("icon-down-menu-actived");
            btnSearch[0].classList.add("icon-down-menu-actived");
			btnScan[0].classList.remove("icon-down-menu-actived");
            btnMenu[0].classList.remove("icon-down-menu-actived");
            break;

        case 3:
            seccScan[0].classList.remove("all-novisible");
            seccHome[0].classList.add("all-novisible");
			seccSearch[0].classList.add("all-novisible");
			seccMenu[0].classList.add("all-novisible");

            btnHome[0].classList.remove("icon-down-menu-actived");
            btnSearch[0].classList.remove("icon-down-menu-actived");
            btnScan[0].classList.add("icon-down-menu-actived");
			btnMenu[0].classList.remove("icon-down-menu-actived");
            break;

		case 4:
			seccMenu[0].classList.remove("all-novisible");
            seccHome[0].classList.add("all-novisible");
			seccSearch[0].classList.add("all-novisible");
			seccScan[0].classList.add("all-novisible");

            btnHome[0].classList.remove("icon-down-menu-actived");
            btnSearch[0].classList.remove("icon-down-menu-actived");
            btnScan[0].classList.remove("icon-down-menu-actived");
			btnMenu[0].classList.add("icon-down-menu-actived");
            break;

        default:
            console.log("vuelve a home");
            seccHome[0].classList.toggle("all-novisible");
            break;
    }

}

btnSearchInput[0].addEventListener("click", function() {
    console.log("Boton Buscar");
    searchEngine(inputSearch[0].value);
});

inputSearch[0].addEventListener("keypress", function(event){
    if(event.which == 13) {
        console.log(inputSearch[0].value);
        searchEngine(inputSearch[0].value);
    }
      
});

//TODO VER LO DE ASYNC ACA Y HACER EL SPINNER DE BUSQUEDA

async function searchEngine (param) {
    const url = "https://malvinas-team.000webhostapp.com/apiSearch.php?q="+ param;
	var opts = {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		mode: "no-cors", // no-cors, *cors, same-origin
		headers: {
		      //'Content-Type': 'application/json'
		      'Content-Type': 'text/plain',
    		},
		//cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		//credentials: "same-origin", // include, *same-origin, omit
	}
    const response = await fetch(url,opts);
	const resultado = await response.text();
    searchResultado[0].innerHTML = resultado;
	//TODO ESTO DEBERIA SER UNA FUNCION
	var splide = new Splide( '#prod1', {
		rewind      :   true,
		rewindByDrag:   true,
		arrows      :   false,
		fixedWidth  :   '9rem',
		fixedHeight :   '9rem',
		rewind      :   true,
		rewindByDrag:   true,
		gap : '0.5rem',
		padding: '0.25rem',
		} );
	splide.mount();
    
}

const stopScan = () => {
	Quagga.stop();
}


//document.addEventListener("DOMContentLoaded", () => {
const Scan = () => {
	const $resultados = document.querySelector("#resultado");
	Quagga.init({
		inputStream: {
			constraints: {
                width: 1280,
				height: 720,
			},
			name: "Live",
			type: "LiveStream",
			target: document.querySelector('#contenedor'), // Pasar el elemento del DOM
		},
		decoder: {
			readers: ["ean_reader"]
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Iniciado correctamente");
		Quagga.start();
	});

	Quagga.onDetected((data) => {
		$resultados.textContent = data.codeResult.code;
		// Imprimimos todo el data para que puedas depurar
		console.log(data);
	});

	Quagga.onProcessed(function (result) {
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});
};
//});
