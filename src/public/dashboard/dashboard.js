const API = "http://localhost:3000/api";

/*
--------------------------------
REGISTRAR TIPO DE ALERTA
--------------------------------
*/

document
.getElementById("formTipoAlerta")
.addEventListener("submit", async (e)=>{

e.preventDefault()

const nombre_alerta =
document.getElementById("nombre_alerta").value


await fetch(`${API}/tipos_alerta`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre_alerta
})

})

alert("Tipo de alerta registrado")

})



/*
--------------------------------
REGISTRAR MARCA
--------------------------------
*/

document
.getElementById("formMarca")
.addEventListener("submit", async (e)=>{

e.preventDefault()

const nombre_marca =
document.getElementById("nombre_marca").value


await fetch(`${API}/marcas`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre_marca
})

})

alert("Marca registrada")

})

/*
--------------------------------
REGISTRAR CHOFER
--------------------------------
*/

document
.getElementById("formChofer")
.addEventListener("submit", async (e)=>{

e.preventDefault()

const data={

nombre:document.getElementById("nombre").value,

apellido_paterno:document.getElementById("apellido_paterno").value,

apellido_materno:document.getElementById("apellido_materno").value,

licencia:document.getElementById("licencia").value,

telefono:document.getElementById("telefono").value,

email:document.getElementById("email").value

}

await fetch(`${API}/choferes`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

alert("Chofer registrado")

})



/* -----------------------------
CARGAR MARCAS
----------------------------- */

async function cargarMarcas(){

const res = await fetch(`${API}/marcas`)

const data = await res.json()

const select = document.getElementById("selectMarca")

select.innerHTML=""

data.forEach(marca=>{

const option=document.createElement("option")

option.value=marca.id_marca

option.textContent=marca.nombre_marca

select.appendChild(option)

})

}



/* -----------------------------
CARGAR MODELOS
----------------------------- */

async function cargarModelos(){

const res=await fetch(`${API}/modelos`)

const data=await res.json()

const select=document.getElementById("selectModelo")

select.innerHTML=""

data.forEach(modelo=>{

const option=document.createElement("option")

option.value=modelo.id_modelo

option.textContent=modelo.nombre_modelo

select.appendChild(option)

})

}



/* -----------------------------
CARGAR CHOFERES
----------------------------- */

async function cargarChoferes(){

const res=await fetch(`${API}/choferes`)

const data=await res.json()

const select=document.getElementById("selectChofer")

select.innerHTML=""

data.forEach(chofer=>{

const option=document.createElement("option")

option.value=chofer.id_chofer

option.textContent=
`${chofer.nombre} ${chofer.apellido_paterno}`

select.appendChild(option)

})

}



/* -----------------------------
CARGAR TIPOS ALERTA
----------------------------- */

async function cargarTiposAlertas(){

const res=await fetch(`${API}/tipos_alerta`)

const data=await res.json()

const select=document.getElementById("selectTipoAlerta")

select.innerHTML=""

data.forEach(tipo=>{

const option=document.createElement("option")

option.value=tipo.id_tipo_alerta

option.textContent=tipo.nombre_alerta

select.appendChild(option)

})

}



/* -----------------------------
CARGAR UNIDADES
----------------------------- */

async function cargarUnidades(){

const res=await fetch(`${API}/unidades`)

const data=await res.json()

const select=document.getElementById("selectUnidad")

select.innerHTML=""

data.forEach(unidad=>{

const option=document.createElement("option")

option.value=unidad.id_unidad

option.textContent=unidad.placa

select.appendChild(option)

})

}



/* -----------------------------
REGISTRAR MODELO
----------------------------- */

document
.getElementById("formModelo")
.addEventListener("submit", async(e)=>{

e.preventDefault()

const nombre_modelo=
document.getElementById("nombre_modelo").value

const id_marca=
document.getElementById("selectMarca").value


await fetch(`${API}/modelos`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre_modelo,
id_marca
})

})

alert("Modelo registrado")

})



/* -----------------------------
REGISTRAR UNIDAD
----------------------------- */

document
.getElementById("formUnidad")
.addEventListener("submit", async(e)=>{

e.preventDefault()

const data={

placa:document.getElementById("placa").value,

anio:document.getElementById("anio").value,

id_chofer:document.getElementById("selectChofer").value,

id_modelo:document.getElementById("selectModelo").value

}

await fetch(`${API}/unidades`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

alert("Unidad registrada")

})



/* -----------------------------
REGISTRAR ALERTA
----------------------------- */

document
.getElementById("formAlerta")
.addEventListener("submit", async(e)=>{

e.preventDefault()

const data={

id_tipo_alerta:
document.getElementById("selectTipoAlerta").value,

id_unidad:
document.getElementById("selectUnidad").value

}

await fetch(`${API}/alertas_db`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

alert("Alerta registrada")

})



/* -----------------------------
CARGAR ALERTAS
----------------------------- */

async function cargarAlertas(){

const res=await fetch(`${API}/alertas`)

const data=await res.json()

const lista=document.getElementById("listaAlertas")

lista.innerHTML=""

data.forEach(alerta=>{

const li=document.createElement("li")

li.textContent=
`Alerta ${alerta.id_alerta} | Tipo ${alerta.id_tipo_alerta} | Unidad ${alerta.id_unidad}`

lista.appendChild(li)

})

}



/* -----------------------------
INICIAR DASHBOARD
----------------------------- */

async function iniciarDashboard(){

await cargarMarcas()

await cargarModelos()

await cargarChoferes()

await cargarTiposAlertas()

await cargarUnidades()

}

iniciarDashboard()