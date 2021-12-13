import React from 'react'
import {Link, NavLink} from 'react-router-dom'

import {useDispatch, useSelector} from 'react-redux'
import {cerrarSesionAccion} from '../redux/usuarioDucks'

import {withRouter} from 'react-router-dom'
 
const Navbar = (props) => {
    const dispatch = useDispatch()

    const cerrarSesion = () => {
        dispatch(cerrarSesionAccion())
        props.history.push('/login')
    }

    const activo = useSelector(store => store.usuario.activo)

    return (
        <div className="navbar navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">APP POKE</Link>
            <div className="d-flex">
                {/* Si en los NavLink no colocamos la palabra 
                    exact, los botones del NavLink vas a quedar
                    siempre activos, por lo que si les colocamos
                    el exact, va a activarlos exactamente cuando
                    estemos en esa ruta */}
                {
                    activo ? (
                        <> {/* Mediante ese pequeño Fragment podemos
                            enviar 2 elementos (Inicio y Cerrar Sesión) */}
                            <NavLink className="btn btn-dark mr-2" to="/" exact>Inicio</NavLink>
                            <NavLink className="btn btn-dark mr-2" to="/perfil" exact>Perfil</NavLink>
                            <button className="btn btn-dark mr-2" onClick={() => cerrarSesion()}>
                                Cerrar Sesión
                            </button>
                        </>

                    ) : (
                        <NavLink className="btn btn-dark mr-2" to="/login" exact>Login</NavLink>
                    )
                }

            </div>
        </div>
    )
}

export default withRouter(Navbar)
