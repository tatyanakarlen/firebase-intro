import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import { db, auth, storage } from './firebase-config/firebase';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
// import { getDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, 'movies');
  // NEW MOVIE STATE
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // UPDATE TITLE STATE
  const [updatedTitle, setUpdatedTitle] = useState('');

  //FILE UPLOAD STATE
  const [fileUpload, setFileUpload] = useState(null);

  const getMovieList = async () => {
    // READ THE DATA
    // SET MOVIE LIST STATE
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    if (auth.currentUser === null) {
      console.log('you cannot post');
      return;
    } else {
      try {
        await addDoc(moviesCollectionRef, {
          title: newMovieTitle,
          releaseDate: newMovieReleaseDate,
          recievedAnOscar: isNewMovieOscar,
          userId: auth?.currentUser?.uid,
        });
        getMovieList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteMovie = async (id, userId) => {
    if (auth.currentUser.uid != userId) {
      console.log('you cannot delete this');
      return;
    } else {
      const movieDoc = doc(db, 'movies', id);
      await deleteDoc(movieDoc);
      setMovieList(movieList.filter((movie) => movie.id !== id));
    }
  };

  const updateMovieTitle = async (id, userId) => {
    if (auth.currentUser.uid != userId) {
      console.log('you cannot update this');
      return;
    } else {
      const movieDoc = doc(db, 'movies', id);
      await updateDoc(movieDoc, { title: updatedTitle });
      const indexOfMovieToUpdate = movieList.findIndex(
        (movie) => movie.id === id
      );

      const updatedMovie = {
        ...movieList[indexOfMovieToUpdate],
        title: updatedTitle,
      };
      const newMovieList = [...movieList];
      newMovieList[indexOfMovieToUpdate] = updatedMovie;
      setMovieList(newMovieList);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release date..."
          onChange={(e) => setNewMovieReleaseDate(Number(e.target.value))}
          type="number"
        />
        <input
          checked={isNewMovieOscar}
          type="checkbox"
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Recieved Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>
      Firebase course
      <Auth />
      <div>
        {movieList.map((movie, index) => (
          <div key={index}>
            <h1 style={{ color: movie.recievedAnOscar ? 'green' : 'red' }}>
              Title: {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id, movie.userId)}>
              Delete Movie
            </button>
            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id, movie.userId)}>
              Update title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
