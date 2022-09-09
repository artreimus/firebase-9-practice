import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAmh-eTUbbJxMUzsXpu8UUhZxwhcYpmNr8',
  authDomain: 'fir-9-lessons-77221.firebaseapp.com',
  projectId: 'fir-9-lessons-77221',
  storageBucket: 'fir-9-lessons-77221.appspot.com',
  messagingSenderId: '82928697194',
  appId: '1:82928697194:web:130fe2e7e2eabb819bef13',
};

interface booksData {
  title: string;
  id: string;
  author: string;
}

// init firebase app
initializeApp(firebaseConfig);

// init services
const database = getFirestore();
const auth = getAuth();

// collection reference
const collectionRef = collection(database, 'books');

// queueries
// const q = query(
//   collectionRef,
//   where('author', '==', 'patrick rothfuss'),
//   orderBy('createdAt', 'asc')
// );

const q = query(collectionRef, orderBy('createdAt', 'asc'));

// // get collection data - THIS IS NOT REAL TIME, THUS WE USE ONSNAPSHOT instead
// getDocs(collectionRef)
//   .then((snapshot) => {
//     let books: unknown[] = [];
//     snapshot.docs.forEach((doc) => {
//       // snap.docs returns the docs
//       books.push({ ...doc.data(), id: doc.id }); // doc.data returns the data
//     });
//     console.log(books);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

// real time data collection
// Fires function whenever there is a change in the collection
const unsubCollection = onSnapshot(q, (snapshot) => {
  let books: unknown[] = [];
  snapshot.docs.forEach((doc) => {
    // snap.docs returns the docs
    books.push({ ...doc.data(), id: doc.id }); // doc.data returns the data
  });
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector('.add') as HTMLFormElement | null;

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titleInputElement = document.querySelector(
    '#title'
  ) as HTMLInputElement | null;
  const authorInputElement = document.querySelector(
    '#author'
  ) as HTMLInputElement | null;

  addDoc(collectionRef, {
    title: titleInputElement.value,
    author: authorInputElement.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector(
  '.delete'
) as HTMLFormElement | null;
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const idInputElement = document.querySelector(
    '#id-delete'
  ) as HTMLInputElement | null;

  const docReference = doc(database, 'books', idInputElement.value);

  deleteDoc(docReference).then(() => {
    deleteBookForm.reset();
  });
});

//get a single document
const docReference = doc(database, 'books', '17pS93DuVZkuykHwfS3Z');
// getDoc(docReference).then((doc) => { // not real time, thus we use onSnapshot
//   console.log(doc.data(), doc.id);
// });

const unsubDocument = onSnapshot(docReference, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
const updateBookForm = document.querySelector(
  '.update'
) as HTMLFormElement | null;

updateBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const idInputElement = document.querySelector(
    '#id-update'
  ) as HTMLInputElement | null;

  const titleInputElement = document.querySelector(
    '#title-update'
  ) as HTMLInputElement | null;

  const docReference = doc(database, 'books', idInputElement.value);

  updateDoc(docReference, {
    title: titleInputElement.value,
  }).then(() => {
    updateBookForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector('.signup') as HTMLFormElement | null;

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailInputElement = document.querySelector(
    '#email-signup'
  ) as HTMLInputElement | null;

  const passwordInputElement = document.querySelector(
    '#password-signup'
  ) as HTMLInputElement | null;

  createUserWithEmailAndPassword(
    auth,
    emailInputElement.value,
    passwordInputElement.value
  )
    .then((cred) => {
      console.log('user created: ', cred.user);
      signupForm.reset();
    })
    .catch((error) => console.log(error.message));
});

// Logout and login
const logoutButton = document.querySelector(
  '.logout'
) as HTMLButtonElement | null;

logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => console.log('the user signed out'))
    .catch((error) => console.log(error.message));
});

const loginForm = document.querySelector('.login') as HTMLFormElement | null;
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailInputElement = document.querySelector(
    '#email-login'
  ) as HTMLInputElement | null;

  const passwordInputElement = document.querySelector(
    '#password-login'
  ) as HTMLInputElement | null;

  signInWithEmailAndPassword(
    auth,
    emailInputElement.value,
    passwordInputElement.value
  )
    .then((cred) => {
      console.log('user logged in: ', cred.user);
      loginForm.reset();
    })
    .catch((error) => console.log(error.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user);
});

const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', (e) => {
  console.log('unsubscribing...');
  unsubCollection();
  unsubDocument();
  unsubAuth();
});
