import React from 'react'

import {useDispatch, useSelector} from 'react-redux'
import { obtenerPokemonesAccion,  siguientePokemonAccion, anteriorPokemonAccion, unPokeDetalleAccion} from '../redux/pokeDucks'
import Detalle from './Detalle'

const Pokemones = () => {
    const dispatch = useDispatch() /* Declaramos dispatch el cual va a disparar
    nuestra/s acción obtenerPokemonsAction */

    // Crearmos el state utilizando nuestra tienda
    // Store.pokemones lo sacamos de la tienda
    const pokemones = useSelector(store => store.pokemones.results)
    /* El useSelector devuelve a traves de una función de flecha nuestro store
    y retornamos nuestro array que se encuentra en la tienda (store.pokemones.array) */
    const next = useSelector(store => store.pokemones.next)
    const previous = useSelector(store => store.pokemones.previous)

    React.useEffect(() => {
        const fetchData = () => {
            dispatch(obtenerPokemonesAccion())
        }
        fetchData()
    }, [dispatch])

    return (
        <div className="row mt-5">

            <div className="col-md-6">

                <h3>Lista de pokemones</h3>

                <ul className="list-group mt-4">
                    {
                        pokemones.map(item => (
                            <li key={item.name} className="list-group-item text-uppercase">
                                {item.name}
                                <button 
                                    className="btn btn-dark btn-sm float-right"
                                    onClick={() => dispatch(unPokeDetalleAccion(item.url))}
                                >
                                    Info
                                </button>
                            </li>
                        ))
                    } {/* Pintamos los pokemones en una lista */}
                </ul>

                <div className="d-flex justify-content-between mt-4">
                    {
                        pokemones.length === 0 && 
                        <button onClick={() => dispatch(obtenerPokemonesAccion())} className="btn btn-dark">Get Pokemones</button>
                    } {/* Si el pokemones.length es 0, que se muestre el botón Obtener Pokemones */}
                    {/* -------------------------- FLUJO DUCKS -------------------------- */}
                    {/* Nuestra lista de Pokemones va a viajar directamente a nuestro array inicial,
                    ya que una vez que presionemos el botón, va ir al try, va a decir: intenta
                    consumir esta api. En el caso de que NO falle, vamos a ejecutar el dispatch
                    el cual va a generar un type que es GET_POKE_SUCCESS y va a ejecutar 
                    nuestro return en el caso perteneciente a este type en el switch, pero
                    sin antes de que nosotros le enviemos el payload que contiene todos los 
                    pokemones. Este payload va a viajar al action con la key peyload,
                    por lo tanto, en el return nosotros devbolvemos el state que en este caso 
                    será nuestro array vacio, pero le indicamos que el array ya no este vacio,
                    sino que ahora sea lo que venga del payload. */}

                    {
                        next &&
                        <button onClick={() => dispatch(siguientePokemonAccion())} className="btn btn-dark">Siguiente</button>
                    } {/* Si existe algo en next, que se muestre el botón de Siguiente */}

                    {
                        previous &&
                        <button onClick={() => dispatch(anteriorPokemonAccion())} className="btn btn-dark">Anterior</button>
                    } {/* Si existe algo en previous, que se muestre el botón de Siguiente */}
                </div>

        
                
                
            </div>
            <div className="col-md-6">
                <h3>Detalle Pokemon</h3>
                <Detalle />
            </div>
        </div>
    )
}

export default Pokemones
