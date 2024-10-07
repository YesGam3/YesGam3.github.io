import axios from 'axios'
import {useState,useEffect} from 'react'

const Discription = ({country}) => {

    const [data,setData] = useState({})

    const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"
    const hook = () => {
        axios.get(baseURL+`/name/${country.name.common}`).then(response=> {setData(response.data)})
    }
    
    useEffect(hook,[])
    
    console.log(Object.values(country.languages).map(element=> element))
    return(
        <div>
            <h1>{country.name.common}</h1>
            <div>capital: {country.capital}</div>
            <div>area: {country.area}</div>

            <h2>languages: </h2>
            <ul>
                {Object.values(country.languages).map(element=> <li>{element}</li>)} 
            </ul>
            <img src={country.flags.svg} width={400} height={300}></img>
        </div>
    )
}

const ShowButton = (props) => {
    return(<button onClick={props.onClick}> show </button>)
}

const ShownList = (props) => {
    if (props.list.length > 10){
        return(<p>Too many match</p>)
    }
    if (props.list.length == 1){
        return(<Discription country={props.list[0]}></Discription>)
    }
    else{
        return(
            <ul>
                {props.list.map((element) => <ShownElement element={element}/>)}
            </ul>
        )
    }
}

const ShownElement = ({element}) => {
    const [isShown,setIsShown] = useState(false)
    
    if (isShown) {
        return (
            <li key={element.name.common}>
                {element.name.common} <button onClick={() => { setIsShown(!isShown) }}> Show </button>
                <Discription country={element} />
            </li>
        )
    }
    else {
        return (<li key={element.name.common}> {element.name.common} <button onClick = {() => {setIsShown(!isShown)}}> Show </button></li>)
    }
}

const Country = () => {

    const [list,setList] = useState([])
    const [keyword, setKeyword] = useState("")
    const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"
    const hook = () => {
        axios.get(baseURL+"/all").then(response => {setList(response.data)
            console.log(response.data)
        })
    }

    useEffect(hook,[])

    const handleSearchChange = (event) => {
        setKeyword(event.target.value)
    }

    //const shownList = list.filter(element => {console.log(element.name.common)})
    const shownList = list.filter(element => element.name.common.includes(keyword))

    return(
        <>
        <div>
            find country <input value={keyword} onChange={handleSearchChange}></input>
            <ShownList list={shownList}></ShownList>
        </div>
        </>
    )

}


export default Country