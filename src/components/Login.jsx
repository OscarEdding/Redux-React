import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ingresoUsuarioAccion} from '../redux/usuarioDucks'

import {withRouter} from 'react-router-dom'

const Login = (props) => {
    const dispatch = useDispatch()

    const loading = useSelector(store => store.usuario.loading)
    console.log(loading)
    const activo = useSelector(store => store.usuario.activo)
    console.log(activo)

    React.useEffect(() => {
        console.log(activo) /* Para verificar que no se hagan loops */
        if(activo) { /* Si activo está en verdadero */
            props.history.push('/') /* Que lo empuje al inicio */
        }
    }, [activo, props.history])

    return (
        <div className="mt-5 text-center">
            <h3>Ingreso con Google</h3>
            <hr/>
            <button 
                className="btn btn-dark"
                onClick={() => dispatch(ingresoUsuarioAccion())}
                disabled={loading}
            >
                Acceder
            </button>
        </div>
    )
}

export default withRouter(Login)
