const express = require('express')
const path = require('path');

const app = express()
const PORT = process.env.PORT || 3000;


// asi tendremos un middleware
app.use(express.json())


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'principal.html'));
  
});


app.get('/api/camiones', (req, res) => {
  // Más adelante, aquí harás la consulta a tu base de datos. 
  // Por ahora, devolvemos datos "mockeados" (de prueba).
  const camionesMock = [
    { id: 'TRK-001', chofer: 'Roberto M.', estado: 'activo', velocidad: 85, combustible: 62 },
    { id: 'TRK-002', chofer: 'Ana G.', estado: 'advertencia', velocidad: 110, combustible: 40 },
    { id: 'TRK-004', chofer: 'Luis P.', estado: 'mantenimiento', velocidad: 0, combustible: 10 }
  ];
  
  res.json(camionesMock);
});

app.listen(PORT,() =>{
    console.log(`Servidor levantado en puerto http://localhost:${PORT}`);
})