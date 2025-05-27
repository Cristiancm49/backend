const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authController = {
    login: async (req, res) => {
        const { email, contrasena } = req.body;
        try {
            const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Email no encontrado.' });
            }

            const usuario = result.rows[0];
            const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!passwordValida) {
                return res.status(401).json({ message: 'Contraseña incorrecta.' });
            }

            const token = jwt.sign({ idUsuario: usuario.idusuario, idRol: usuario.idrol }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                mensaje: 'Inicio de sesión exitoso.',
                token,
                usuario: {
                    id: usuario.idusuario,
                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    email: usuario.email,
                    idRol: usuario.idrol
                }
            })
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            res.status(500).json({ message: 'Error al iniciar sesion.' });
        }
    },
    register: async (req, res) => {
        const { nombre, apellidos, contrasena, email, idRol } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const result = await pool.query(
                `INSERT INTO usuario (
                    nombre, 
                    apellidos, 
                    contrasena, 
                    email, 
                    idrol
                ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [nombre, apellidos, hashedPassword, email, idRol]);
                
                res.status(201).json({
                    message: 'Usuario registrado exitosamente.',
                    usuario: result.rows[0]
                })

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ message: 'Error al registrar usuario.' });
        }
    }

};

module.exports = authController;