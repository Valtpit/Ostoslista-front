import './App.css';
import {useEffect,useState} from "react";
import axios from "axios";

const URL = "http://localhost/ostoslista-back/"

function App() {
  const [item, setItem] = useState([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  function save(e) {
    e.preventDefault()
    const json = JSON.stringify({description:description, amount:amount})
    axios.post(URL + "add.php", json,{
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then((response) => {
      setItem(item => [...item,response.data])
      setDescription("");
      setAmount("")
    }).catch (error => {
      alert(error.response.data.error)
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + "delete.php", json,{
      headers: {
        "Content-Type" : "application/json"
      }
    })
      .then((response) => {
        const newListWithoutRemoved = item.filter((item) => item.id !== id)
        setItem(newListWithoutRemoved)
      }).catch (error => {
        alert(error.response ? error.response.data.error : error)
      })
  }

  useEffect(() => {
    axios.get(URL)
    .then ((response) => {
      setItem(response.data)
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }, [])

  return (
    <div className="container">
    <h3>Ostoslista</h3>
    <form>
    <label>Uusi tuote</label>
    <input value={description} onChange={e => setDescription(e.target.value)} placeholder="tuotteen nimi"></input>
    <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="tuotteen määrä"></input>
    <button onClick={save}>lisää</button>
    </form>

    <ol>
      {item?.map(item => (
        <li key={item.id}>
          <div className="layout">
          <p>{item.description}</p>
          <p>{item.amount}</p>
          <a href="#" className="delete" onClick={() => remove(item.id)}>Poista</a>
          </div>
        </li>
      ))}
    </ol>

    </div>
  );
}

export default App;
