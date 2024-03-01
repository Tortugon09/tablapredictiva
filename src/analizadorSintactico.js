function analizadorSintactico(cadena) {
  let pila = ['$', 'A'];
  let apuntador = 0;
  let infoPila = [];
  let permitirEspacio = false;
  let ultimaProduccion = '';
  let mensajeError = '';

  const pushInfo = (X) => {
    infoPila.push(`Push: ${X}, Cadena: ${cadena.slice(apuntador)}`);
  };

  const popInfo = (X, a) => {
    infoPila.push(`Pop: ${X}, Carácter actual: '${a}', Cadena restante: '${cadena.slice(apuntador)}'`);
  };

  while (pila.length > 0) {
    const X = pila[pila.length - 1];
    let a = cadena[apuntador];

    if ((a === ' ' || a === '\n') && ((permitirEspacio && !(ultimaProduccion === 'T' && X === 'N')) || (X === ',' || X === ';'))) {
      apuntador++;
      continue;
    }

    if (X === '$') {
      infoPila.push('Análisis completado.');
      pila.pop();
      break;
    }

    if (X === a) {
      popInfo(X, a);
      pila.pop();
      apuntador++;
      permitirEspacio = false;

      if (a === ',' || a === ';') {
        ultimaProduccion = a;
        permitirEspacio = true;
      } else {
        ultimaProduccion = '';
      }
    } else if (esNoTerminal(X)) {
      const produccion = obtenerProduccion(X, a);
      if (produccion) {
        popInfo(X, a);
        pila.pop();

        pushInfo(X);

        permitirEspacio = true;
        ultimaProduccion = X;

        if (produccion[0] !== 'ε') {
          for (let i = produccion.length - 1; i >= 0; i--) {
            pila.push(produccion[i]);
          }
        }
      } else {
        mensajeError = `Error: No se pudo encontrar una producción válida para ${X} con el símbolo ${a}.`;
        infoPila.push(mensajeError);
        return { esValida: false, infoPila, error: mensajeError};
      }
    } else {
      mensajeError = `Error: Token inesperado '${a}' para el símbolo esperado '${X}'.`;
      permitirEspacio = false;
      infoPila.push(mensajeError);
      popInfo(X, a);
      return { esValida: false, infoPila, error: mensajeError };
    }
  }

  return { esValida: apuntador === cadena.length, infoPila };
}

function esNoTerminal(simbolo) {
  return /[A-Z]/.test(simbolo);
}

function obtenerProduccion(noTerminal, next) {
  switch (noTerminal) {
    case 'A':
      return ['T', 'N', 'M', ';'];
    case 'N':
      return ['L', 'R'];
    case 'R':
      return /[a-z]/.test(next) ? ['L', 'R'] : ['ε'];
    case 'M':
      return ['[', 'E', ']'];
    case 'E':
      return ['D', 'C', 'X'];
    case 'D':
      return /[0-9]/.test(next) ? [next] : null;
    case 'C':
      return /[0-9]/.test(next) ? ['D', 'C'] : ['ε'];
    case 'T':
      return ['l', 'e', 't'];
    case 'L':
      return /[a-z]/.test(next) ? [next] : null;
    case 'X':
      return /[,]/.test(next) ? [',', 'D', 'C', 'X'] : ['ε'];
    default:
      return null;
  }
}

export { analizadorSintactico, esNoTerminal, obtenerProduccion };