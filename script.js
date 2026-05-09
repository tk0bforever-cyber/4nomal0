const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Almacenar clientes conectados al evento SSE
let clients = [];

// Ruta SSE para notificaciones en tiempo real
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);
    
    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
    });
});

// Función para enviar notificación a todos los clientes SSE
function notificarNuevaVisita(ip, userAgent) {
    const data = {
        ip: ip,
        userAgent: userAgent,
        timestamp: new Date().toLocaleString()
    };
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
}

// Ruta que recibe los datos del visitante
app.post('/visita', (req, res) => {
    const { ip, userAgent } = req.body;
    console.log(`[NUEVA VISITA] IP: ${ip} - UA: ${userAgent}`);
    
    // Notificar a los administradores
    notificarNuevaVisita(ip, userAgent);
    
    res.json({ status: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Abre esta URL en dos navegadores diferentes para probar`);
});