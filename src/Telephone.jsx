import { useEffect, useState } from 'react'
import axios from 'axios'

const ShowList = (props) => {
  return (
    <ul>
      {props.persons.map(person => {
        return (<li key={person.id}>{person.name}: {person.number} <button value={person.id} onClick={props.HandleDelete}>delete</button></li>)
      })}
    </ul>
  )
}

const InputForm = (props) => {
  return (
    <form onSubmit={props.HandleAddSubmit} >
      <div>
        name: <input value={props.newPerson.name} onChange={props.HandleNameChange} />
      </div>
      <div>
        number: <input value={props.newPerson.number} onChange={props.HandleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.keyword} onChange={props.HandleFilterChange}></input>
    </div>
  )
}

const ResetButton = (props) => {
  return (
    <div>
      <button onClick={props.HandleReset}>Reset Data</button>
    </div>
  )
}

const Information = ({message}) => {

  return(
    <div className="information">
      Added {message}
    </div>
  )
}
const Telephone = () => {

  const [info, setInfo] = useState("something is happening")
  const [persons, setPersons] = useState([])

  const setPersonsHook = () => { axios.get("http://localhost:3001/persons").then((response) => { setPersons(response.data) }) }
  useEffect(setPersonsHook, [])

  const defaultPersons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [canSubmit, setCanSubmit] = useState(true)
  const [keyword, setKeyword] = useState('')


  const HandleNameChange = (event) => {
    const newObject = { name: event.target.value, number: newPerson.number }
    setNewPerson(newObject)
    CheckPersons(newObject)
  }

  const HandleNumberChange = (event) => {
    const newObject = { name: newPerson.name, number: event.target.value }
    setNewPerson(newObject)
    CheckPersons(newObject)
  }

  const CheckPersons = (object) => {
    setCanSubmit(true)
    persons.map((person) => {
      if (person.name === object.name) {
        setCanSubmit(false)
      }
    })
  }

  const HandleAddSubmit = (event) => {
    event.preventDefault()
    if (canSubmit) {
      axios.post("http://localhost:3001/persons", newPerson).then((response) => {
        setPersons(persons.concat(response.data))
        setInfo(newPerson.name)
        setNewPerson({ name: '', number: '' })
      })
    }
    else {
      if (confirm(`${newPerson.name} is already in phonebook,do you set a new number to instead the old number?`))
        {
          const personID  = persons.filter(person=> person.name==newPerson.name)[0].id
          axios.put(`http://localhost:3001/persons/${personID}`,newPerson)
          .then(response=>{console.log(response.data)})
          .catch(error=>{
            setInfo(`${newPerson.name} is already removed from server`)
          })
        }
    }
  }

  const HandleFilterChange = (event) => {
    setKeyword(event.target.value)
  }

  const HandleDelete = (event) => {
    axios.delete(`http://localhost:3001/persons/${event.target.value}`).then(response => {
      setPersons(
        persons.filter(element=> element.id !== response.data.id)
      )
    })
  }

  const HandleReset = (event) => {


    persons.map(element=>{
      axios.delete(`http://localhost:3001/persons/${element.id}`)
    })

    defaultPersons.map(element=>{
      axios.post("http://localhost:3001/persons", element)
      })
    
    location.reload()

  }
  const ShownPersons = (persons) => {
    if (keyword == '') {
      return (persons)
    }
    else {
      return (
        persons.filter((person) => person.name.includes(keyword))
      )
    }
  }


  return (
    <div>
      <ResetButton HandleReset={HandleReset} />
      <Filter keyword={keyword} HandleFilterChange={HandleFilterChange} />
      <h1>Phonebook</h1>
      <Information message={info}/>
      <InputForm HandleAddSubmit={HandleAddSubmit} HandleNameChange={HandleNameChange} HandleNumberChange={HandleNumberChange} newPerson={newPerson} />
      <h1>Numbers</h1>
      <div><ShowList persons={ShownPersons(persons)} HandleDelete={HandleDelete}></ShowList></div>
    </div>
  )
}

export default Telephone