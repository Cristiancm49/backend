const pool = require('../config/db');
const bcrypt = require('bcrypt');


const usuarioControllers = {
    getUsuarios: async (req, res) => {
        try {
            const result = await pool.query(`SELECT 
  usuario.idUsuario,
  usuario.nombre AS nombreUsuario,
  usuario.apellidos,
  usuario.contrasena,
  usuario.email,
  usuario.idRol,
  rol.nombre AS nombreRol
FROM usuario
INNER JOIN rol ON usuario.idRol = rol.idRol;
`);
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error al obtener usuarios.' });
        }
    },

    getUsuarioById: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query(`SELECT * FROM usuario WHERE idusuario = $1`, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            res.status(500).json({ message: 'Error al obtener usuario por ID.' });
        }
    },

    createUsuario: async (req, res) => {
        const { nombre, apellidos, contrasena, email, idRol } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            const result = await pool.query(`
                INSERT INTO usuario (
                    nombre, 
                    apellidos, 
                    contrasena, 
                    email, 
                    idrol
                ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [nombre, apellidos, hashedPassword, email, idRol]);
            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente.',
                usuario: result.rows[0]
            })
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario.' });
        }
    },

    updateUsuario: async (req, res) => {
        const { id } = req.params;
        const { nombre, apellidos, contrasena, email, idRol } = req.body;

        try {
            const campos = [];
            const valores = [];
            let i = 1;

            if (nombre) {
                campos.push(`nombre = $${i++}`);
                valores.push(nombre);
            }
            if (apellidos) {
                campos.push(`apellidos = $${i++}`);
                valores.push(apellidos);
            }
            if (contrasena) {
                const hashed = await bcrypt.hash(contrasena, 10);
                campos.push(`contrasena = $${i++}`);
                valores.push(hashed);
            }
            if (email) {
                campos.push(`email = $${i++}`);
                valores.push(email);
            }
            if (idRol !== undefined) {
                campos.push(`idrol = $${i++}`);
                valores.push(idRol);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'No se enviaron datos para actualizar.' });
            }

            valores.push(id); // última posición para el WHERE

            const query = `UPDATE usuario SET ${campos.join(', ')} WHERE idusuario = $${i} RETURNING *`;
            const result = await pool.query(query, valores);

            res.json({
                mensaje: 'Usuario actualizado exitosamente.',
                usuario: result.rows[0]
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error al actualizar usuario.' });
        }
    }, deleteUsuario: async (req, res) => {
        const { id } = req.params;
      
        try {
          const result = await pool.query(
            'DELETE FROM usuario WHERE idusuario = $1 RETURNING *',
            [id]
          );
      
          if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
          }
      
          res.status(200).json({ message: 'Usuario eliminado correctamente.', usuario: result.rows[0] });
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          res.status(500).json({ message: 'Error al eliminar el usuario.' });
        }
      }

};

module.exports = usuarioControllers;