import { useState, useEffect } from 'react'
import axios from 'axios'
import service from './services/numbers.jsx'


const Name = ({person}) =>{
    return(<li>{person.name}: {person.number}</li>)
  }

  const PersonForm = (props)=>{
    
    return(
    <form onSubmit={props.addNumber}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange}/></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
    <div>
      <button type="submit" >add</button>
    </div>
    </form>
  )
  }
  
  const Person = (props) => {
    return(
      <ul>{props.displayList.map(person => <Name key={person.name} person={person}></Name>)}</ul>
    )
  }
  const Filter = (props) => {
    return(<>
    Search: <input value={props.search} type="search" onChange={props.handleSearchChange}></input>
    </>
  )
  }

  function NumberNote(){  

  const [persons, setPersons] = useState([])
  const [displayList,setDisplayList] = useState([])
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [canAdd, setCanAdd] = useState(true)
  const newPerson = {name:newName, number:newNumber}
  
  const hook = () => {service.getAll().then(
    data => {
    setPersons(data)
    setDisplayList(data)
    })}
    
  useEffect(hook,[])

  const addNumber = (event) => 
    {
    event.preventDefault()
    const numberObject = {
      name: newName,
      number: newNumber
    }
    if (canAdd)
    {
      service.create(numberObject).then(data=>
        {
          setPersons(persons.concat(data))
          setNewName('')
        })
     
    }
    else{
      alert(`${newName} is already added to phonebook`)
    }
  }
  
  const handleSearchChange = (event) => {
    console.log('change')
    setSearch(event.target.value)
    displayPerson(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log('handleNameChange:' ,event.target.value)
    setNewName(event.target.value)
    checkPerson(event.target.value,newNumber)
  }

  const handleNumberChange = (event) => {
    console.log('handleNumberChange:' ,event.target.value)
    setNewNumber(event.target.value)
    checkPerson(newName,event.target.value)
  }

  const displayPerson = (keyword) => {
    let aList = []
    persons.forEach(element => { if (element.name.match(keyword))
      {
        aList = aList.concat(element)
    } 

    setDisplayList(aList)
    })};

  const checkPerson = (name,number) => {
    setCanAdd(true)
    persons.forEach(element => {
      if(element.name == name){
        if(element.number == number){
          setCanAdd(false)
        }
      }
    });
  }
  console.log('persons:', persons,'display list: ',displayList)
  return (
    <div>
      <h1>Phonebook</h1>
      <Filter search={search} handleSearchChange={handleSearchChange}></Filter>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange} addNumber={addNumber}></PersonForm>
      <h1>Numbers</h1>
      <Person displayList={displayList}></Person>
    </div>
  )
}


export default NumberNote
