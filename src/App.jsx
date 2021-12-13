import React from 'react';

// Componentes
import Pokemones from "./components/Pokemones";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Perfil from './components/Perfil';

// Rutas
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

// Firebase
import {auth} from './firebase'

function App() {

	// Firebase
	const [firebaseUser, setFirebaseUser] = React.useState(false)

	React.useEffect(() => {
		const fetchUser = () => {
		 	auth.onAuthStateChanged(user => {
				/* Lee los usuarios que se encuentran en la base de 
				datos de Google. */
			  	console.log(user)
			  	if(user) {
				  	setFirebaseUser(user)
			  	} else {
					setFirebaseUser(null)
			  	}
		  	})
		} 
		fetchUser()
	}, [])

	console.log("Soy el user", firebaseUser)

	// LocalStorage
	const RutaProtegida = ({component, path, ...rest}) => {
		/* Esta RutaProtegida va a reemplazar al Route dentro 
		del return.
		El component, el path y el rest son los atributos de los Route
		dentro del Switch. */
		if(localStorage.getItem('usuario')) {
			const usuarioStorage = JSON.parse(localStorage.getItem('usuario'))
			/* Si el localStorage lee el usuario y no existe el 
			usuario, va a hacer el Redirect del else. */
		  	if(usuarioStorage.uid === firebaseUser.uid) {
				/* Si el id del usuario del localStorage es igual al id usuario
				que se encuentra en la base de datos, empujamos al usuario a 
				la ruta deseada. */
				console.log('son iguales')
				return <Route component={component} path={path} {...rest} />
		  	}else {
				console.log('no exite')
				return <Redirect to="/login" {...rest} />
		  	}
		} else {
		  	return <Redirect to="/login" {...rest} />
		}
	}
  
	return firebaseUser !== false ? (
		<Router>
			<div className="container mt-3">
				<Navbar />
				<Switch>
					<RutaProtegida component={Pokemones} path="/" exact/>
					{/* <Route component={Pokemones} path="/" exact/> */}
					<RutaProtegida component={Perfil} path="/perfil" exact/>
					<Route component={Login} path="/login" exact/>
				</Switch>
			</div>
		</Router>
	) : (<div>Cargando...</div>)
}
  
export default App;
