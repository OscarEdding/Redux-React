import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk' // Sirve para hacer promesas con Redux

import pokeReducer from './pokeDucks' // Importamos nuestro Reducer
/* Siempre en el store debemos llamar a todos nuestros Reducers */
import usuarioReducer, {leerUsuarioActivoAccion} from './usuarioDucks'

const rootReducer = combineReducers({
    pokemones: pokeReducer,
    usuario: usuarioReducer
}) /* combineReducers toma un objeto el cual contiene todo nuestros ducks
combinados (separados por comas) para que nosotros podamos consumirlos 
en nuestros componentes. Debemos asignarle un nombre y con un igual de
dos puntos (:) debemos asignarle un Reducer. */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
    const store = createStore( rootReducer,  composeEnhancers( applyMiddleware(thunk) ))
    leerUsuarioActivoAccion()(store.dispatch)
    /* Tenemos que ejecutar nuestra acción antes de retornar la tienda, se utiliza doble
    parentesis ya que son 2 funciones de flecha ()() y en el segundo parentesis
    como recibe un dispatch, vamos a acceder al store.dispatch para que ejecute
    el dispatch correspondiente. */
    return store;
} /* Creamos una constante store que crea una tienda y le pasamos como
parámetros el rootReducer que son todos nuestros ducks combinados, y
le pasamos la extensión que es una función la cual va a recibir en 
su interior nuestro middleware que le pasamos como parámetros thunk
el cual trabaja con promesas. Finalmente, una vez creada la tienda,
la vamos a devolver con un return. */
