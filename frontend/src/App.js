import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const baseURL = "http://localhost:5000";

function App() {
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
    <div className="App border border-success">
      <h1 className="text-white mb-2">Supplies</h1>
      <section className="mb-3">
        <form onSubmit={handleSubmit}>
          <label className="d-flex my-2 text-center" htmlFor="description"><h5 className="">Add item</h5></label>
          <div className="d-flex text text-start">
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
      <section>
        <ul>
          {eventsList.map((event) => {
            if (eventId === event.id) {
              return (
                <li key={event.id}>
                  <form onSubmit={handleSubmit} key={event.id}>
                    <input
                      onChange={(e) => handleChange(e, "edit")}
                      type="text"
                      name="editDescription"
                      id="editDescription"
                      value={editDescription}
                    />
                    <button type="submit">Submit</button>
                  </form>
                </li>
              );
            } else {
              return (
                <li key={event.id}>
                  {format(new Date(event.created_at), "MM/dd, p")}: {" "}
                  {event.description}
                  <button onClick={() => toggleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>X</button>
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
