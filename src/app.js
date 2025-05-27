const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
const conectMongo = require('./config/mongo');
conectMongo();
app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend-three-iota-40.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const institucionesRoutes = require('./routes/institucionesRoutes');
const estadoProyRoutes = require('./routes/estadoProyRoutes');
const proyectoRoutes = require('./routes/proyectosRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const listEstudiantesProyRoutes = require('./routes/listEstudiantesProyRoutes');
const estudiantesRoutes = require('./routes/estudiantesRoutes');
const archivosRoutes = require('./routes/archivosRoutes');
const fotoPerfilRoutes = require('./routes/fotoPerfilRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const historialRoutes = require('./routes/historialRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/instituciones', institucionesRoutes);
app.use('/api/estadoProy', estadoProyRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/proyectos', listEstudiantesProyRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/foto-perfil', fotoPerfilRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/historial', historialRoutes);


app.get('/ping-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: rows[0].now });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error(error); // ← ESTE ES EL IMPORTANTE
    res.status(500).json({ status: 'error', message: 'No se pudo conectar con la base de datos' });
  }
});

app.get('/', (req, res) => {
    res.send('Gestión de Proyectos Escolares - Backend Activo');
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
