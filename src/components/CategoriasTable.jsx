import { useEffect, useState } from 'react'
import { API_URL } from '../api'

const formularioVacio = { nombre: '', descripcion: '' }

function CategoriasTable() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)

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

  function cambiarCampo(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  // POST (crear) o PUT (editar) según si estamos editando
  async function guardarCategoria(e) {
    e.preventDefault()
    setError(null)
    const url = editandoId
      ? `${API_URL}/categorias/${editandoId}/`
      : `${API_URL}/categorias/`
    try {
      const respuesta = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      })
      if (!respuesta.ok) {
        throw new Error('No se pudo guardar la categoría')
      }
      setFormulario(formularioVacio)
      setEditandoId(null)
      cargarCategorias()
    } catch (err) {
      setError(err.message)
    }
  }

  function empezarEdicion(categoria) {
    setEditandoId(categoria.id)
    setFormulario({ nombre: categoria.nombre, descripcion: categoria.descripcion })
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setFormulario(formularioVacio)
  }

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

      <form onSubmit={guardarCategoria}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={cambiarCampo}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={formulario.descripcion}
          onChange={cambiarCampo}
        />
        <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear categoría'}</button>
        {editandoId && (
          <button type="button" className="secundario" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

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
                  <button className="secundario" onClick={() => empezarEdicion(categoria)}>
                    Editar
                  </button>
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
