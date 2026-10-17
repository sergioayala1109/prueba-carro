import { useState } from 'react';
import { avisoError, avisoExito } from '../../utils/alertas';

// Convierte un teléfono escrito por una persona en el formato que usan los
// enlaces: "+56 9 8453 6000" -> "+56984536000".
function derivarTel(numero) {
  const digitos = String(numero).replace(/\D/g, '');
  return digitos ? `+${digitos}` : '';
}

function ListaSimple({ titulo, nota, items, onCambiar, onAgregar, onQuitar, vacio }) {
  return (
    <>
      <p className="subtitulo-campo">{titulo}</p>
      {nota && <p className="campo__nota">{nota}</p>}
      <div className="repeticion">
        {items.length === 0 && <span className="campo__nota">{vacio}</span>}
        {items.map((valor, indice) => (
          <div className="repeticion__fila" key={`${titulo}-${indice}`}>
            <label className="campo">
              <input
                type="text"
                value={valor}
                onChange={(e) => onCambiar(indice, e.target.value)}
              />
            </label>
            <button
              type="button"
              className="boton-mini boton-mini--peligro"
              onClick={() => onQuitar(indice)}
            >
              Quitar
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="boton-mini" onClick={onAgregar}>
            + Agregar
          </button>
        </div>
      </div>
    </>
  );
}

export default function FormNegocio({ negocio, textos, onGuardar }) {
  const [borrador, setBorrador] = useState(() => JSON.parse(JSON.stringify({ negocio, textos })));

  const negocioActual = borrador.negocio;
  const textosActual = borrador.textos;

  const cambiarNegocio = (campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: { ...previo.negocio, [campo]: valor },
    }));

  const cambiarDireccion = (campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        direccion: { ...previo.negocio.direccion, [campo]: valor },
      },
    }));

  const cambiarTelefono = (indice, campo, valor) =>
    setBorrador((previo) => {
      const telefonos = previo.negocio.telefonos.map((telefono, i) => {
        if (i !== indice) return telefono;
        const actualizado = { ...telefono, [campo]: valor };
        if (campo === 'numero') actualizado.tel = derivarTel(valor);
        return actualizado;
      });
      return { ...previo, negocio: { ...previo.negocio, telefonos } };
    });

  const agregarTelefono = () =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        telefonos: [
          ...previo.negocio.telefonos,
          { etiqueta: 'Teléfono', numero: '', tel: '', whatsapp: false },
        ],
      },
    }));

  const quitarTelefono = (indice) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        telefonos: previo.negocio.telefonos.filter((_, i) => i !== indice),
      },
    }));

  const cambiarRed = (indice, campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        redes: previo.negocio.redes.map((red, i) =>
          i === indice ? { ...red, [campo]: valor } : red,
        ),
      },
    }));

  const agregarRed = () =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        redes: [...previo.negocio.redes, { nombre: '', usuario: '', url: '' }],
      },
    }));

  const quitarRed = (indice) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        redes: previo.negocio.redes.filter((_, i) => i !== indice),
      },
    }));

  const cambiarHorario = (indice, campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        horario: previo.negocio.horario.map((bloque, i) =>
          i === indice ? { ...bloque, [campo]: valor } : bloque,
        ),
      },
    }));

  const agregarHorario = () =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        horario: [...previo.negocio.horario, { dias: '', horas: '' }],
      },
    }));

  const quitarHorario = (indice) =>
    setBorrador((previo) => ({
      ...previo,
      negocio: {
        ...previo.negocio,
        horario: previo.negocio.horario.filter((_, i) => i !== indice),
      },
    }));

  // --- Textos ---
  const cambiarHero = (campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        hero: { ...previo.textos.hero, [campo]: valor },
      },
    }));

  const cambiarNosotros = (campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        nosotros: { ...previo.textos.nosotros, [campo]: valor },
      },
    }));

  const cambiarLista = (seccion, campo, indice, valor) =>
    setBorrador((previo) => {
      const lista = [...previo.textos[seccion][campo]];
      lista[indice] = valor;
      return {
        ...previo,
        textos: {
          ...previo.textos,
          [seccion]: { ...previo.textos[seccion], [campo]: lista },
        },
      };
    });

  const agregarItem = (seccion, campo, valorVacio) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        [seccion]: {
          ...previo.textos[seccion],
          [campo]: [...previo.textos[seccion][campo], valorVacio],
        },
      },
    }));

  const quitarItem = (seccion, campo, indice) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        [seccion]: {
          ...previo.textos[seccion],
          [campo]: previo.textos[seccion][campo].filter((_, i) => i !== indice),
        },
      },
    }));

  const cambiarMetrica = (indice, campo, valor) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        nosotros: {
          ...previo.textos.nosotros,
          metricas: previo.textos.nosotros.metricas.map((metrica, i) =>
            i === indice ? { ...metrica, [campo]: valor } : metrica,
          ),
        },
      },
    }));

  const agregarMetrica = () =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        nosotros: {
          ...previo.textos.nosotros,
          metricas: [
            ...previo.textos.nosotros.metricas,
            { valor: '', etiqueta: '' },
          ],
        },
      },
    }));

  const quitarMetrica = (indice) =>
    setBorrador((previo) => ({
      ...previo,
      textos: {
        ...previo.textos,
        nosotros: {
          ...previo.textos.nosotros,
          metricas: previo.textos.nosotros.metricas.filter((_, i) => i !== indice),
        },
      },
    }));

  const enviar = (evento) => {
    evento.preventDefault();
    const resultado = onGuardar(borrador.negocio, borrador.textos);
    if (resultado?.ok) {
      avisoExito('Datos guardados en este navegador.');
    } else {
      avisoError(resultado?.error ?? 'No se pudieron guardar.', 'No se pudo guardar');
    }
  };

  return (
    <form onSubmit={enviar}>
      <div className="panel">
        <p className="subtitulo-campo">Marca</p>
        <div className="campos campos--dos">
          <label className="campo">
            <span className="campo__label">Nombre</span>
            <input
              type="text"
              value={negocioActual.nombre}
              onChange={(e) => cambiarNegocio('nombre', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Eslogan</span>
            <input
              type="text"
              value={negocioActual.eslogan}
              onChange={(e) => cambiarNegocio('eslogan', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Correo</span>
            <input
              type="email"
              value={negocioActual.correo}
              onChange={(e) => cambiarNegocio('correo', e.target.value)}
            />
          </label>
        </div>

        <label className="campo" style={{ marginTop: '0.85rem' }}>
          <span className="campo__label">Misión (pie de página)</span>
          <textarea
            value={negocioActual.mision}
            onChange={(e) => cambiarNegocio('mision', e.target.value)}
          />
        </label>

        <p className="subtitulo-campo">Dirección</p>
        <div className="campos campos--dos">
          <label className="campo">
            <span className="campo__label">Calle y número</span>
            <input
              type="text"
              value={negocioActual.direccion.calle}
              onChange={(e) => cambiarDireccion('calle', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Comuna</span>
            <input
              type="text"
              value={negocioActual.direccion.comuna}
              onChange={(e) => cambiarDireccion('comuna', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Región</span>
            <input
              type="text"
              value={negocioActual.direccion.ciudad}
              onChange={(e) => cambiarDireccion('ciudad', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">País</span>
            <input
              type="text"
              value={negocioActual.direccion.pais}
              onChange={(e) => cambiarDireccion('pais', e.target.value)}
            />
          </label>
        </div>

        <p className="subtitulo-campo">Teléfonos</p>
        <p className="campo__nota">
          El número de WhatsApp es el que usan todos los botones "Cotizar".
        </p>
        <div className="repeticion">
          {negocioActual.telefonos.map((telefono, indice) => (
            <div className="repeticion__fila" key={`tel-${indice}`}>
              <label className="campo">
                <span className="campo__label">Etiqueta</span>
                <input
                  type="text"
                  value={telefono.etiqueta}
                  onChange={(e) => cambiarTelefono(indice, 'etiqueta', e.target.value)}
                />
              </label>
              <label className="campo">
                <span className="campo__label">Número</span>
                <input
                  type="text"
                  value={telefono.numero}
                  placeholder="+56 9 1234 5678"
                  onChange={(e) => cambiarTelefono(indice, 'numero', e.target.value)}
                />
              </label>
              <label className="campo campo--check" style={{ alignSelf: 'end' }}>
                <input
                  type="checkbox"
                  checked={Boolean(telefono.whatsapp)}
                  onChange={(e) => cambiarTelefono(indice, 'whatsapp', e.target.checked)}
                />
                <span>WhatsApp</span>
              </label>
              <button
                type="button"
                className="boton-mini boton-mini--peligro"
                style={{ alignSelf: 'end' }}
                onClick={() => quitarTelefono(indice)}
              >
                Quitar
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="boton-mini" onClick={agregarTelefono}>
              + Agregar teléfono
            </button>
          </div>
        </div>

        <p className="subtitulo-campo">Redes sociales</p>
        <div className="repeticion">
          {negocioActual.redes.map((red, indice) => (
            <div className="repeticion__fila" key={`red-${indice}`}>
              <label className="campo">
                <span className="campo__label">Nombre</span>
                <input
                  type="text"
                  value={red.nombre}
                  onChange={(e) => cambiarRed(indice, 'nombre', e.target.value)}
                  placeholder="Instagram"
                />
              </label>
              <label className="campo">
                <span className="campo__label">Usuario</span>
                <input
                  type="text"
                  value={red.usuario}
                  onChange={(e) => cambiarRed(indice, 'usuario', e.target.value)}
                  placeholder="@monsantestudiocreativo"
                />
              </label>
              <label className="campo">
                <span className="campo__label">Enlace</span>
                <input
                  type="text"
                  value={red.url}
                  onChange={(e) => cambiarRed(indice, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <button
                type="button"
                className="boton-mini boton-mini--peligro"
                style={{ alignSelf: 'end' }}
                onClick={() => quitarRed(indice)}
              >
                Quitar
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="boton-mini" onClick={agregarRed}>
              + Agregar red
            </button>
          </div>
        </div>

        <p className="subtitulo-campo">Horario de atención</p>
        <div className="repeticion">
          {negocioActual.horario.map((bloque, indice) => (
            <div className="repeticion__fila" key={`horario-${indice}`}>
              <label className="campo">
                <span className="campo__label">Días</span>
                <input
                  type="text"
                  value={bloque.dias}
                  onChange={(e) => cambiarHorario(indice, 'dias', e.target.value)}
                />
              </label>
              <label className="campo">
                <span className="campo__label">Horas</span>
                <input
                  type="text"
                  value={bloque.horas}
                  onChange={(e) => cambiarHorario(indice, 'horas', e.target.value)}
                />
              </label>
              <button
                type="button"
                className="boton-mini boton-mini--peligro"
                style={{ alignSelf: 'end' }}
                onClick={() => quitarHorario(indice)}
              >
                Quitar
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="boton-mini" onClick={agregarHorario}>
              + Agregar bloque
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="subtitulo-campo">Portada (Hero)</p>
        <div className="campos campos--dos">
          <label className="campo">
            <span className="campo__label">Etiqueta superior</span>
            <input
              type="text"
              value={textosActual.hero.etiqueta}
              onChange={(e) => cambiarHero('etiqueta', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Título</span>
            <input
              type="text"
              value={textosActual.hero.titulo}
              onChange={(e) => cambiarHero('titulo', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Palabras destacadas (van en rosa)</span>
            <input
              type="text"
              value={textosActual.hero.resaltado}
              onChange={(e) => cambiarHero('resaltado', e.target.value)}
            />
          </label>
        </div>

        <label className="campo" style={{ marginTop: '0.85rem' }}>
          <span className="campo__label">Descripción</span>
          <textarea
            value={textosActual.hero.descripcion}
            onChange={(e) => cambiarHero('descripcion', e.target.value)}
          />
        </label>

        <ListaSimple
          titulo="Ventajas del Hero"
          items={textosActual.hero.ventajas}
          vacio="Sin ventajas."
          onCambiar={(i, v) => cambiarLista('hero', 'ventajas', i, v)}
          onAgregar={() => agregarItem('hero', 'ventajas', '')}
          onQuitar={(i) => quitarItem('hero', 'ventajas', i)}
        />
      </div>

      <div className="panel">
        <p className="subtitulo-campo">Sección "Nosotros"</p>
        <div className="campos campos--dos">
          <label className="campo">
            <span className="campo__label">Etiqueta</span>
            <input
              type="text"
              value={textosActual.nosotros.etiqueta}
              onChange={(e) => cambiarNosotros('etiqueta', e.target.value)}
            />
          </label>
          <label className="campo">
            <span className="campo__label">Título</span>
            <input
              type="text"
              value={textosActual.nosotros.titulo}
              onChange={(e) => cambiarNosotros('titulo', e.target.value)}
            />
          </label>
        </div>

        <ListaSimple
          titulo="Párrafos"
          items={textosActual.nosotros.parrafos}
          vacio="Sin párrafos."
          onCambiar={(i, v) => cambiarLista('nosotros', 'parrafos', i, v)}
          onAgregar={() => agregarItem('nosotros', 'parrafos', '')}
          onQuitar={(i) => quitarItem('nosotros', 'parrafos', i)}
        />

        <p className="subtitulo-campo">Cifras destacadas</p>
        <p className="campo__nota">
          Estas cifras son inventadas: edítalas o bórralas antes de publicar.
        </p>
        <div className="repeticion">
          {textosActual.nosotros.metricas.map((metrica, indice) => (
            <div className="repeticion__fila" key={`metrica-${indice}`}>
              <label className="campo">
                <span className="campo__label">Valor</span>
                <input
                  type="text"
                  value={metrica.valor}
                  onChange={(e) => cambiarMetrica(indice, 'valor', e.target.value)}
                />
              </label>
              <label className="campo">
                <span className="campo__label">Texto</span>
                <input
                  type="text"
                  value={metrica.etiqueta}
                  onChange={(e) => cambiarMetrica(indice, 'etiqueta', e.target.value)}
                />
              </label>
              <button
                type="button"
                className="boton-mini boton-mini--peligro"
                style={{ alignSelf: 'end' }}
                onClick={() => quitarMetrica(indice)}
              >
                Quitar
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="boton-mini" onClick={agregarMetrica}>
              + Agregar cifra
            </button>
          </div>
        </div>
      </div>

      <div className="editor__pie" style={{ border: 'none', padding: '1rem 0 0' }}>
        <button type="submit" className="boton boton--primario">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
