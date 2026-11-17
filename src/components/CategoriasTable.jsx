import { useEffect, useState } from 'react'
import { API_URL } from '../api'

function CategoriasTable() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // GET: trae la lista de categorías desde la API
  async function cargarCategorias() {
    setCargando(true)
    setError(null)
    try {
      const respuesta = await fetch(`${API_URL}/categorias/`)
      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las categorías')
      }
      const datos = await respuesta.json()
      setCategorias(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  // [] = se ejecuta una sola vez, cuando el componente aparece en pantalla
  useEffect(() => {
    cargarCategorias()
  }, [])

  // DELETE: elimina una categoría por su id
  async function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría? También se eliminarán sus lugares.')) return
    try {
      const respuesta = await fetch(`${API_URL}/categorias/${id}/`, { method: 'DELETE' })
      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la categoría')
      }
      setCategorias(categorias.filter((categoria) => categoria.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="tarjeta">
      <h2>Categorías</h2>

      {cargando && <p className="cargando">Cargando categorías...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!cargando && categorias.length === 0 && <p>No hay categorías registradas.</p>}

      {categorias.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <button className="peligro" onClick={() => eliminarCategoria(categoria.id)}>
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

export default CategoriasTable
