import { useEffect, useState } from 'react'
import { API_URL } from '../api'

function LugaresTable() {
  const [lugares, setLugares] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // GET: trae la lista de lugares desde la API
  async function cargarLugares() {
    setCargando(true)
    setError(null)
    try {
      const respuesta = await fetch(`${API_URL}/lugares/`)
      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los lugares')
      }
      const datos = await respuesta.json()
      setLugares(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  // [] = se ejecuta una sola vez, cuando el componente aparece en pantalla
  useEffect(() => {
    cargarLugares()
  }, [])

  // DELETE: elimina un lugar por su id
  async function eliminarLugar(id) {
    if (!confirm('¿Eliminar este lugar?')) return
    try {
      const respuesta = await fetch(`${API_URL}/lugares/${id}/`, { method: 'DELETE' })
      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el lugar')
      }
      setLugares(lugares.filter((lugar) => lugar.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="tarjeta">
      <h2>Lugares</h2>

      {cargando && <p className="cargando">Cargando lugares...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!cargando && lugares.length === 0 && <p>No hay lugares registrados.</p>}

      {lugares.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Dirección</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lugares.map((lugar) => (
              <tr key={lugar.id}>
                <td>{lugar.nombre}</td>
                <td>{lugar.categoria_nombre}</td>
                <td>{lugar.direccion}</td>
                <td>{lugar.descripcion}</td>
                <td>
                  <button className="peligro" onClick={() => eliminarLugar(lugar.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default LugaresTable
