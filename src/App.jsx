import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { analizadorSintactico } from './analizadorSintactico';

function App() {
  const [cadena, setCadena] = useState('');
  const [resultado, setResultado] = useState(null);
  const [pilaInfo, setPilaInfo] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');

  const analizarCadena = () => {
    const { esValida, infoPila, error } = analizadorSintactico(cadena);
    setResultado(esValida);
    setPilaInfo(infoPila);
    setErrorMensaje(error);
  };

  const editorDidMount = (editor, monaco) => {
    console.log('Editor montado');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{ textAlign:'center', paddingLeft: '360px'}}>
        <h2>Programa Implementado Tabla Predictiva</h2>
        <h4>Axel Giovanni Reyes Ramos 213370</h4>
      </div>

      <div style={{ width: '800px', marginBottom: '10px', paddingLeft: '360px'}}>
        <MonacoEditor
          width="800"
          height="200"
          language="plaintext"
          theme="vs-dark"
          value={cadena}
          onChange={setCadena}
          editorDidMount={editorDidMount}
        />
      </div>

      <div style={{padding: '10px',textAlign:'center', paddingLeft: '360px'}} >
        <button onClick={analizarCadena}>Analizar</button>
      </div>

      {resultado !== null && (
        <div>
          <p>
            La cadena {cadena} es {resultado ? 'válida' : `inválida: ${errorMensaje}`}.
          </p>
        </div>
      )}

      <div>
        <h3>Información de la Pila:</h3>
        <table style={{ border: '1px solid white', borderCollapse: 'collapse', width: '50%' }}>
          <tbody>
            {pilaInfo.map((info, index) => {
              const [accion, caracterActual, cadenaRestante] = info.split(': ');
              return (
                <tr key={index}>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{accion}</td>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{caracterActual}</td>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{cadenaRestante}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
