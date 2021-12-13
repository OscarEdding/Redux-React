import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyDv8VeaujTnQxFxIJtCBrq5whOjzcqyXIo",
	authDomain: "redux-ducks-b9537.firebaseapp.com",
	projectId: "redux-ducks-b9537",
	storageBucket: "redux-ducks-b9537.appspot.com",
	messagingSenderId: "843635181632",
	appId: "1:843635181632:web:c564b26571c9a379cdb7a5"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, firebase, db, storage }
