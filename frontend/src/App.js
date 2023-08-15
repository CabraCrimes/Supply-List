import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { Helmet } from "react-helmet";

const baseURL = "http://localhost:5000";

function App() {

  <Helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Rubik&display=swap" rel="stylesheet"/>
  </Helmet>

  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);

  const fetchEvents = async () => {
    const data = await axios.get(`${baseURL}/events`);
    const { events } = data.data;
    setEventsList(events);
    console.log("DATA:", data);
  };

  const handleChange = (e, field) => {
    if (field === "edit") {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/events/${id}`);
      const updatedList = eventsList.filter((event) => event.id !== id);
      setEventsList(updatedList);
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleEdit = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription) {
        const data = await axios.put(`${baseURL}/events/${eventId}`, {description: editDescription});
        const updatedEvent = data.data.event;
        const updatedList = eventsList.map((event) => {
          if (event.id === eventId) {
            return (event = updatedEvent);
          } else {
            return event;
          }
        });
        setEventsList(updatedList);
      } else {
        const data = await axios.post(`${baseURL}/events`, { description });
        setEventsList([...eventsList, data.data]);
        
      }
      setDescription("");
      setEditDescription("");
      setEventId("");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      <h1 className="text-white mb-2 mt-2">Supplies</h1>
      
      {/* Input */}
      <section className="mb-3 ">
        <form onSubmit={handleSubmit} className="shadow p-2 px-4 pb-3 ms-4 rounded">
          <label className="d-flex my-2 text-center" htmlFor="description"><h5 className="">Add item</h5></label>
          <div className="d-flex text-start">
          <input
            className="input-group-text me-2"
            onChange={(e) => handleChange(e, "description")}
            type="text"
            name="description"
            id="description"
            placeholder="Add.."
            value={description}
          />
          <button type='submit' className="btn btn-light">Submit</button>
          </div>
        </form>
      </section>

      {/* List generated */}
      <section >
        <ul>
          {eventsList.map((event) => {
            if (eventId === event.id) {
              return (
                <li key={event.id}>
                  <form onSubmit={handleSubmit} key={event.id}>
                    <div className="d-flex text-start">
                    <input
                      className="inputList input-group-text me-2"  
                      onChange={(e) => handleChange(e, "edit")}
                      type="text"
                      name="editDescription"
                      id="editDescription"
                      value={editDescription}
                    />
                    <button type="submit" className="btn btn-light">Submit</button>
                    </div>
                  </form>
                </li>
              );
            } else {
              return (
                <li key={event.id} className="mb-3 shadow p-2 rounded d-flex align-items-center text-center">
                  <FontAwesomeIcon icon={faXmark} onClick={() => handleDelete(event.id)} type="button" className="btn btn-outline-light border-0 me-2" />
                  <p className="m-0">{`${event.description} : ${format(new Date(event.created_at), "MM/dd, p")}`}</p>
                  <FontAwesomeIcon icon={faPenToSquare} onClick={() => toggleEdit(event)} type="button" className="btn btn-outline-light border-0" />
                </li>
              );
            }
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
