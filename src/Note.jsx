import {useState,useEffect} from 'react'
import axios from 'axios'
import noteService from './services/notes.jsx'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Note = ({ note, toggleImportance }) => {

  const label = note.important? "change to not important":"change to important"

  return (
    <li className="note" key={note.id}>{note.content} <button onClick={toggleImportance}>{label}</button></li>
  )
}

const SubmitForm = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
    <input value={props.value} onChange={props.onChange}></input><button type="submit">add</button>
    </form>
  )
}
const ShowList = (props) => {
  return(
  <ul>{props.notes.map((note)=><Note note={note} toggleImportance={()=> props.toggleImportanceOf(note.id)}></Note>)}</ul>
  )
}
const Filter = (props) => {

  const text = props.showAll? "Show Important": "Show All"
  return(
    <form onSubmit={props.onSubmit}>
      <button>{text}</button>
    </form>

  )
}

const ResetServer = (props) =>{

  return(
  <button onClick={props.onClick}>Reset</button>
  )
}
const NoteDisplay = () =>{

  
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  const shownNotes = showAll? notes: notes.filter(note=>note.important === true)

  const hook = () => {noteService.getAll().then((data)=>{setNotes(data)})}
  useEffect(hook,[])

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
}

  const handleNoteSubmit = (event) => {
    event.preventDefault()

    const imp = Math.random() > 0.5

    const note = {
      content:  newNote,
      important: imp,
      date: new Date()
    }
    noteService.create(note).then((data)=>
      {
        setNotes(notes.concat(data))
        setNewNote('')
    })
 
  }

  const handleFilterSubmit = (event) => {
    event.preventDefault()
    setShowAll(!showAll)
  }
  
  const toggleImportanceOf = (id) => {
  
    const note = notes.find((note)=> note.id === id)
    const changeNote = {...note,important: !note.important}
    
    noteService.update(id,changeNote).then((data)=>
      {
        setNotes(notes.map((note)=>
          {
            return((note.id===id)? data :note)
          }))
      }).catch((error) => {
        alert('The note '+id+' was already deleted from server')
        setNotes(notes.filter((note) => note.id !== id))
      })
  }

  const handleResetServer = (event) => {
    const defaultNotes = [
      {
      id: "1",
      content: "HTML is easy",
      date: "2022-1-17T17:30:31.098Z",
      important: true
      },
      {
      id: "2",
      content: "Browser can execute only JavaScript",
      date: "2022-1-17T18:39:34.091Z",
      important: false
      },
      {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-1-17T19:20:14.298Z",
      important: true}
    ]

    notes.map(note => {
      noteService.Delete(note.id)
    });
    
    defaultNotes.map(note => {
      noteService.create(note).then(data=>{setNotes(notes.concat(data))})
    })

    location.reload()
  }
  return (
  <div>
    <ShowList notes={shownNotes} toggleImportanceOf={toggleImportanceOf}/>
    <Notification message={errorMessage} />
    <SubmitForm value={newNote} onSubmit={handleNoteSubmit} onChange={handleNoteChange}/>
    <Filter showAll={showAll} onSubmit={handleFilterSubmit}></Filter>
    <ResetServer onClick={handleResetServer}></ResetServer>
  </div>
  
)

}
export default NoteDisplay