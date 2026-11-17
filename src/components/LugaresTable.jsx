import { useEffect, useState } from 'react'
import { API_URL } from '../api'

const formularioVacio = { nombre: '', direccion: '', descripcion: '', categoria: '' }

function LugaresTable() {
  const [lugares, setLugares] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)

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

  // GET: trae las categorías para el select (relación ForeignKey)
  async function cargarCategorias() {
    try {
      const respuesta = await fetch(`${API_URL}/categorias/`)
      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las categorías')
      }
      setCategorias(await respuesta.json())
    } catch (err) {
      setError(err.message)
    }
  }

  // [] = se ejecuta una sola vez, cuando el componente aparece en pantalla
  useEffect(() => {
    cargarLugares()
    cargarCategorias()
  }, [])

  function cambiarCampo(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  // POST (crear) o PUT (editar) según si estamos editando
  async function guardarLugar(e) {
    e.preventDefault()
    setError(null)
    const url = editandoId
      ? `${API_URL}/lugares/${editandoId}/`
      : `${API_URL}/lugares/`
    try {
      const respuesta = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      })
      if (!respuesta.ok) {
        throw new Error('No se pudo guardar el lugar')
      }
      setFormulario(formularioVacio)
      setEditandoId(null)
      cargarLugares()
    } catch (err) {
      setError(err.message)
    }
  }

  function empezarEdicion(lugar) {
    setEditandoId(lugar.id)
    setFormulario({
      nombre: lugar.nombre,
      direccion: lugar.direccion,
      descripcion: lugar.descripcion,
      categoria: lugar.categoria,
    })
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setFormulario(formularioVacio)
  }

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

      <form onSubmit={guardarLugar}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={cambiarCampo}
          required
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={formulario.direccion}
          onChange={cambiarCampo}
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={formulario.descripcion}
          onChange={cambiarCampo}
        />
        {/* onFocus recarga las categorías por si se creó una nueva arriba */}
        <select
          name="categoria"
          value={formulario.categoria}
          onChange={cambiarCampo}
          onFocus={cargarCategorias}
          required
        >
          <option value="">-- Categoría --</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear lugar'}</button>
        {editandoId && (
          <button type="button" className="secundario" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

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
                  <button className="secundario" onClick={() => empezarEdicion(lugar)}>
                    Editar
                  </button>
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
