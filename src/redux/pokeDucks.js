import axios from 'axios' // Necesario para el llamado a la api

// constantes
const dataInicial = {
    count: 0,
    next: null,
    previous: null,
    results: []
} /* Las constantes toman una data inicial que tienen nuestros estados
que estarán limpios o vacíos por defecto */

// types
const OBTENER_POKEMONES_EXITO = 'OBTENER_POKEMONES_EXITO'
const SIGUIENTE_POKEMONES_EXITO = 'SIGUIENTE_POKEMONES_EXITO'
const POKE_INFO_EXITO = 'POKE_INFO_EXITO'
/* Los Types son constantes que generalmente van en mayúsculas y nosotros
describimos lo más específicamente posible lo que va a hacer
nuestro switch (OBTENER_POKEMONES_EXITO) y eso va a ser igual a 
nuestra constante ('OBTENER_POKEMONES_EXITO') */

// reducer
export default function pokeReducer(state = dataInicial, action){
    switch(action.type) {
        case OBTENER_POKEMONES_EXITO:
            return {...state, ...action.payload} /* Este caso retorna 
            un objeto con una acción que modifica nuestro state: El
            state tiene que ser copiado de la data inicial (con los 3
            puntitos accedemos al array), el array va a ser igual al 
            action.payload que es nuestro array de pokemones, por lo tanto
            cuando nosotros tengamos una acción de obtenerPokemonsAction,
            en nuestro Reducer se van a enviar toda esa lista de pokemones
            a nuestro state (data inicial) */
        case SIGUIENTE_POKEMONES_EXITO:
            return {...state, ...action.payload}
            /*Hacemos el caso de GET_POKE_NEXT_SUCCESS el cual retorna lo que venga del
            state ya modificado, el array que es igual a action.payload.array que es 
            otro array con los 20 siguientes pokemones y además el offset va a ser igual
            a action.payload.offset el cual por cada siguiente sumará 20. */
        case POKE_INFO_EXITO:
            return {...state, unPokemon: action.payload}
        default:
            return state
        /* Es recomendable colocar un default en el caso de que no se lea ninguna
        de las opciones (casos) que le mandemos y retornamos nuestro state
        que puede ser nuestro estado inicial o nuestro estado ya modificado */
    } /* El switch va a leer las action (nuestra acción obtenerPokemonsAction)
    luego va a leer el type (GET_POKE_SUCCESS) y va a generar un case: en
    el caso de que nosotros mandemos este type, generamos una acción (un 
    return de alguna modificacion de nuestro state que es 
    nuestra data inicial, nuestro array). */
}

// acciones

export const unPokeDetalleAccion = (url = 'https://pokeapi.co/api/v2/pokemon/1/') => async (dispatch) => {


    if(localStorage.getItem(url)) {

        dispatch({
            type: POKE_INFO_EXITO,
            payload: JSON.parse(localStorage.getItem(url))
            /* En el localStorage tenemos todo nuestro objeto
            que nosotros estamos guardando */
        })
        console.log('desde localstorage')

        return
    }

    try {
        console.log('desde api')
       const res = await axios.get(url) 
    //    console.log(res.data)
       dispatch({
           type: POKE_INFO_EXITO,
           payload: {
               nombre: res.data.name,
               ancho: res.data.weight,
               alto: res.data.height,
               foto: res.data.sprites.front_default
           }
       })
       localStorage.setItem(url, JSON.stringify({
            nombre: res.data.name,
            ancho: res.data.weight,
            alto: res.data.height,
            foto: res.data.sprites.front_default
        }))
        /* Cada vez que obtenemos la información de un pokemon
        mediante la constante res, se va a guardar en el
        localStorage.
        La foto si o si va a ser un llamado a la api, porque
        el localStorage solo aguanta hasta 5MB, por lo tanto,
        siempre tiene que ser solo información. */
    } catch (error) {
        console.log(error)
    }

}

export const obtenerPokemonesAccion = () => async (dispatch) => {

    /* console.log("getState: ", getState().pokemones.offset) // Ver el getState

    const offset2 = getState().pokemones.offset // Guardamos el getState (offset)
    console.log("Opción 1: " + offset2)

    const { offset } = getState().pokemones // Accede a la prop. offset del obj. pokemones
    console.log("Opción 2: " + offset) */

    if(localStorage.getItem('offset=0')) { // Hacer petición a la api: Si existe 'offset=0' 
        console.log('datos guardados')
        dispatch({
            type: OBTENER_POKEMONES_EXITO,
            payload: JSON.parse(localStorage.getItem('offset=0'))
            /* Con JSON.parse deshacemos la transformación que hicimos con el 
            JSON.stringify.
            El localStorage.getItem('offset=0') al ser una cadena de string,
            debemos transformarlo nuevamente con JSON.parse.
            En este payload viene toda la información de obtenerPokemonsAction */
        })
        return
    }

    try {
        console.log('datos desde la api')
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=10`)
        /* Va a crear una constante que guarde la respuesta de la espera del 
        axios.get y le pasamos la url. La respuesta que nos va a devolver
        es una lista de pokemones. */
        console.log(res.data)
        dispatch({
            type: OBTENER_POKEMONES_EXITO,
            payload: res.data
        }) /* Para poder activar a nuestro switch que tenemos en el Reducer
        ocupamos el dispatch. Dentro del dispatch debemos señalar el type
        que hicimos arriba (GET_POKE_SUCCESS) y un payload que manda la
        respuesta (res.data.results) al estado inicial (array) */
        localStorage.setItem('offset=0', JSON.stringify(res.data))
        /* El setItem nos permite guardar los valores en el localStorage.
        El offset=0 es nuestra key el cual va a guardar toda la respuesta
        de nuestra data, pero como no se pueden guardar arrays, por lo que
        se debe transformar en una cadena de string mediante JSON.stringify */
    } catch (error) {
        console.log(error)
    }
}
/* Hacemos un export de una constante que se llame obtenerPokemonsAction
la cual es una función de flecha asíncrona la cual va a retornar otra 
función de flecha: En la primera función de flecha vamos a recibir
los parámetros que necesitemos enviar a esta función. Hay acciones que
necesitan parámetros y otras que no, nuestra primera función no necesita,
pero la segunda función si, un dispatch con el que activamos al reducer y
un getState con el cual obtenemos la data inicial */

/* Procedimiento:   Nosotros hacemos acciones, las acciones se procesan en el 
                    Reducer con los casos dentro del switch los cuales van a 
                    retornar una acción que va a modificar nuestro state 
                    (estado inicial) */

export const siguientePokemonAccion = () => async (dispatch, getState) => {

    // Primera Alternativa:
    /* const offset2 = getState().pokemones.offset // Guardamos el getState (offset)
    const siguiente2 = offset + 20 

    // Segunda Alternativa:
    const {offset} = getState().pokemones
    const siguiente = offset + numero

    console.log('siguiente: ', siguiente)*/

    const next = getState().pokemones.next
    /* Tambien podemos utilizar otra alternativa que sería:
    const next = getState().pokemones.next */

    if(localStorage.getItem(next)) { // Hacer petición a la api: Si existe next
        console.log('datos guardados')
        dispatch({
            type: OBTENER_POKEMONES_EXITO,
            payload: JSON.parse(localStorage.getItem(next))
        })
        return
    }

    try {
        console.log('datos desde la api')
        const res = await axios.get(next)
        dispatch({
            type: SIGUIENTE_POKEMONES_EXITO,
            payload: res.data
        }) /* Hacemos un dispatch donde debemos colocar un type que lo crearemos
        con el nombre de GET_POKE_NEXT_SUCCESS y un payload que manda la
        respuesta como un objeto y contiene el array que tiene nuestro state inicial 
        (res.data.results) y un offset que tiene nuestra constante siguiente. */
        localStorage.setItem(next, JSON.stringify(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const anteriorPokemonAccion = () => async(dispatch, getState) => {

    const {previous} = getState().pokemones // Contiene la url para poder retroceder

    if(localStorage.getItem(previous)) { // Hacer petición a la api: Si existe previous
        console.log('datos guardados')
        dispatch({
            type: OBTENER_POKEMONES_EXITO,
            payload: JSON.parse(localStorage.getItem(previous))
        })
        return
    }

    try {
        const res = await axios.get(previous)
        dispatch({
            type: SIGUIENTE_POKEMONES_EXITO,
            payload: res.data
        })
        localStorage.setItem(previous, JSON.stringify(res.data))
    } catch (error) {
        console.log(error)
    }

}
