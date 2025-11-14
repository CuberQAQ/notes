import { useEffect, useState } from "react";
import Note from "./components/Note.jsx";
import notesService from "./services/notes.js";
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNode, setNewNode] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  useEffect(() => {
    console.log("effect");
    notesService.getAll().then((notes) => setNotes(notes));
  }, []);

  console.log("render", notes.length, "notes");

  const notesToShow = showAll ? notes : notes.filter((n) => n.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((n) => (n.id === id ? returnedNote : n)))
      )
      .catch(() => {
        setErrorMessage(`Note "${note.content}" was already deleted from server`);
        setTimeout(() => setErrorMessage(null), 5000);

        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    const newNoteObj = {
      // id: notes.length + 1,
      content: newNode,
      important: Math.random() < 0.5,
    };

    notesService.create(newNoteObj).then((returnedNote) => {
      setNewNode("");
      setNotes(notes.concat(returnedNote));
    });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNode(event.target.value);
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNode} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
