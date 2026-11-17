import CategoriasTable from './components/CategoriasTable'
import LugaresTable from './components/LugaresTable'

function App() {
  return (
    <main className="contenedor">
      <h1>Ruta Patrimonio Popayán</h1>
      <p className="subtitulo">Guía de lugares históricos y turísticos</p>

      <CategoriasTable />
      <LugaresTable />
    </main>
  )
}

export default App
