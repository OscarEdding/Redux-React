import {auth, firebase, db, storage} from '../firebase'

// data inicial
const dataInicial = {
    loading: false,
    activo: false
} /* El loading nos va a servir para deshabilitar botones
cuando el usuario se esté logeando y el activo nos va a
decir si el usuario está activo o no. */

// types
const LOADING = 'LOADING'
const USUARIO_ERROR = 'USUARIO_ERROR'
const USUARIO_EXITO = 'USUARIO_EXITO'
const CERRAR_SESION = 'CERRAR_SESION'

// reducer
export default function usuarioReducer (state = dataInicial, action) {
    switch(action.type){
        case LOADING:
            return {...state, loading: true}
        case USUARIO_ERROR:
            return {...dataInicial}
        case USUARIO_EXITO:
            return {...state, loading: false, user: action.payload, activo: true}
        case CERRAR_SESION:
            return {...dataInicial}
        default:
            return {...state}
    }
}

// action
export const ingresoUsuarioAccion = () => async(dispatch) => {
    dispatch({
        type: LOADING
    })
    try {

        const provider = new firebase.auth.GoogleAuthProvider();
        const res = await auth.signInWithPopup(provider)

        console.log(res.user)

        const usuario = {
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName,
            photoURL: res.user.photoURL
        }

        const usuarioDB = await db.collection('usuarios').doc(usuario.email).get()
        /* Esperamos que si existe dentro de la colección usuario el documento email
        y lo capturamos. */
        console.log(usuarioDB)

        if(usuarioDB.exists) {
            // Cuando exista el usuario en Firestore
            dispatch({
                type: USUARIO_EXITO,
                payload: usuarioDB.data()
            }) // El usuario se guarda en el dispatch
            localStorage.setItem('usuario', JSON.stringify(usuarioDB.data()))
            // El usuario se guarda en el localStorage
        } else {
            // Cuando NO exista el usuario en Firestore
            await db.collection('usuarios').doc(usuario.email).set(usuario)
            dispatch({
                type: USUARIO_EXITO,
                payload: usuario
            })
            localStorage.setItem('usuario', JSON.stringify(usuario))
        }
        
    } catch (error) {
        console.log(error)
        dispatch({
            type: USUARIO_ERROR 
        })
    }
}

export const leerUsuarioActivoAccion = () => (dispatch) => {
    if(localStorage.getItem('usuario')){
        dispatch({
            type: USUARIO_EXITO,
            payload: JSON.parse(localStorage.getItem('usuario'))
            /* Con esto empujamos la misma información que tenemos
            guardada en nuestro localStorage al state. */
        })
    }
}

export const cerrarSesionAccion = () => (dispatch) => {
    auth.signOut() /* Eliminamos al usuario a través de Google */
    localStorage.removeItem('usuario')
    /* Eliminamos al usuario a través del localStorage */
    dispatch({
        type: CERRAR_SESION
    })
}

export const actualizarUsuarioAccion = (nombreActualizado) => async (dispatch, getState) => {
    dispatch({
        type: LOADING
    })

    const {user} = getState().usuario
    /* Accedemos al usuario de nuestra tienda y lo guardamos */
    console.log(user)

    try {
        
        await db.collection('usuarios').doc(user.email).update({
            displayName: nombreActualizado
        }) /* Actualiza al usuario en la base de datos (Firestore) */

        const usuario = {
            ...user,
            displayName: nombreActualizado
        } /* Objeto del usuario editado que contenga el objeto user y el nuevo nombre */

        dispatch({
            type: USUARIO_EXITO,
            payload: usuario
        }) /* Actualizamos la tienda */
        localStorage.setItem('usuario', JSON.stringify(usuario))
        /* Lo guardamos en el localStorage */

    } catch (error) {
        console.log(error)
    }
}

export const editarFotoAccion = (imagenEditada) => async(dispatch, getState) => {

    dispatch({
        type: LOADING
    })
    const {user} = getState().usuario
    /* Accedemos al usuario de nuestra tienda y lo guardamos */

    try {

        const imagenRef = await storage.ref().child(user.email).child('foto perfil')
        /* storage.ref() es una referencia, como un indicador que apunta a un 
        archivo que se encuentra en la nube. En este caso vamos a 
        guardar un archivo en una carpeta.
        Con el .child(user.email) creas una nueva referencia hacia una ubicación
        específica que será la carpeta donde se va a guardar el archivo. Con el 
        user.email creamos una carpeta de archivos para cada usuario.
        Con el .child("Foto Perfíl") se va a crear un archivo con el nombre
        que le estamos asignando. */
        await imagenRef.put(imagenEditada) /* Guardamos el archivo con el put.
        El put nos sirve para actualizar, por lo que no la elimina. */
        const imagenURL = await imagenRef.getDownloadURL()
        /* La función .getDownloadURL()  trae la url de donde nosotros estamos
        guardando el archivo, en este caso, la foto. */

        await db.collection('usuarios').doc(user.email).update({
            /* Accedemos a nuestra colección 'usuarios' al documento user.email 
            en la base de datos y hacemos un update para actualizar. */
            photoURL: imagenURL
            /* photoURL: Propiedad que tenemos almacenada en firebase.
            imagenURL: Imagen proveniente de storage. */
        })

        const usuario = {
            ...user, /* Toda la información no actualizada */
            photoURL: imagenURL /* Imagen actualizada */
        } /* Construimos nuestro objeto usuario con sus datos actualizados */

        dispatch({
            type: USUARIO_EXITO,
            payload: usuario
        }) /* Le pasamos nuestro usuario con los datos actualizados */

        localStorage.setItem('usuario', JSON.stringify(usuario))
        /* Lo guardamos en el localStorage */
        
    } catch (error) {
        console.log(error)
    }
}