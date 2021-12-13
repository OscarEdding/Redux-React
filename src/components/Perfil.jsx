import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {actualizarUsuarioAccion, editarFotoAccion} from '../redux/usuarioDucks'

const Perfil = () => {

    const usuario = useSelector(store => store.usuario.user)
    // Con esto tenemos todo el objeto del usuario
    const loading = useSelector(store => store.usuario.loading)
    // console.log(usuario)

    const [nombreUsuario, setNombreUsuario] = React.useState(usuario.displayName)
    // Por defecto tendrá inmediatamente el nombre del usuario
    const [activarFormulario, setActivarFormulario] = React.useState(false)

    const dispatch = useDispatch()

    const actualizarUsuario = () => {
        if(!nombreUsuario.trim()){
            console.log('Nombre Vacío')
            return
        }
        dispatch(actualizarUsuarioAccion(nombreUsuario))
        /* Con este dispatch actualizamos el DisplayName del usuario en la
        base de datos. */
        setActivarFormulario(false)
    }

    // Error de subir imagen
    const [error, setError] = React.useState(false)

    const seleccionarArchivo = imagen => {
        console.log(imagen.target.files[0])
        const imagenCliente = imagen.target.files[0]

        if(imagenCliente === undefined){
            console.log('no se seleccionó imagen')
            return
        } /* Si no se seleccionamos una imagen, arrojará "undefined" */

        if(imagenCliente.type === "image/png" || imagenCliente.type === "image/jpg"){
            dispatch(editarFotoAccion(imagenCliente))

            setError(false)
            /* Cuando seleccionemos un archivo jpg o png, hacemos el
            dispatch, hace el loading y cambia la imagen, el error
            debe permanecer en falso ya que si el formato del archivo
            es correcto no debería arrojar ningún error. */
        }else{
            setError(true)
            /* Si el archivo no es jpg o png, error pasa a true y 
            muestra un mensaje de error por pantalla. */
        }

    }


    return (
        <div className="mt-5 text-center">
            <div className="card">
                <div className="card-body">
                    <img src={usuario.photoURL} alt="" width="100px" className="img-fluid"/>
                    <h5 className="card-title">Nombre: {usuario.displayName}</h5>
                    <p className="card-text">Email: {usuario.email}</p>
                    <button className="btn btn-dark" onClick={() => setActivarFormulario(true)}>
                        Editar Nombre
                    </button>

                    {
                        error && 
                        <div className="alert alert-warning mt-3">
                            Solo archivos .png o .jpg
                        </div>
                    } {/* Si error es verdadero, que muestre este error */}
                    
                    <div className="custom-file">
                        <input 
                            type="file" 
                            className="custom-file-input" 
                            id="inputGroupFile01" 
                            style={{display:'none'}}
                            onChange={e => seleccionarArchivo(e)}
                            disabled={loading}
                        /> {/* Con el style hacemos que desaparezca la barra */}
                        {/* El evento onChage recibe en su interior otro evento
                        llamado “e” el cual se va a procesar a travez de una 
                        función de flecha la cual va a retornar un resultado
                        que será el seleccionarArchivo(e) */}

                        <label 
                            className={loading ? 'btn btn-dark mt-2 disabled' : 'btn btn-dark mt-2'} 
                            htmlFor="inputGroupFile01"
                            /* Hacemos el disabled em el input y en el label 
                            para deshabilitar el botón cuando esté cargando 
                            la imagen. */
                            >
                                Actualizar Imagen
                        </label>
                    </div>

                </div>
                {
                    loading && 
                    <div className="card-body">
                        <div className="d-flex justify-content-center my-3">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                }
                {
                    activarFormulario &&
                    <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-5">
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={nombreUsuario}
                                        /* Value: Para ver el nombre en el input */
                                        onChange={e => setNombreUsuario(e.target.value)}
                                        /* onChange: Guardamos lo que se escriba en el input */
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-dark" 
                                            type="button" 
                                            onClick={()=> actualizarUsuario()}
                                        >
                                            Actualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Perfil
