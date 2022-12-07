import './App.css';
import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import {Circles} from 'react-loader-spinner'

function App() {

  const [userText, setUserText] = useState('');
  const [loading, setLoading] = useState('');
  const [all, setAll] = useState({name: 'All', value: false});
  const [politics, setPolitics] = useState({name: 'Politics', value: false});
  const [education, setEducation] = useState({name: 'Education', value: false});
  const [healthcare, setHealthcare] = useState({name: 'Healthcare', value: false});
  const [technology, setTechnology] = useState({name: 'Technology', value: false});
  const [environment, setEnvironment] = useState({name: 'Environment', value: false});
  // const [topic, setTopic] = useState([]);
  

  const [chat, setChat] = useState([]);

  const onChangeHandler = (event) => {
    setUserText(event.target.value);
  }

  let loader = <div>{loading ? <Circles
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="circles-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />: null}
</div>

  const onClickHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    const topic = [];
    if(politics.value){
      topic.push(politics.name);
    } if(education.value){
      topic.push(education.name);
    }if(technology.value){
      topic.push(technology.name);
    }
    if(healthcare.value){
      topic.push(healthcare.name);
    }
    if(environment.value){
      topic.push(environment.name);
    }
    if(all.value){
      topic.push(all.name);
    }
    axios.post("http://34.130.189.193:9999/query", {
      query: userText,
      topic: topic
    })
    .then(function (response) {
      setChat([...chat, userText, response.data.response]);
      setLoading(false);

    })
    .catch(function (error) {
      console.log(error);
    });

    setUserText('');
  }


  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [chat]);

  const onCheckboxHandler = (event) => {
    // const val = event.value;
    if(event.name === "Politics"){
      setPolitics({...politics, value: event.value});
    } else if(event.name === "Environment"){
      setEnvironment({...environment, value: event.value});
    }
    else if(event.name === "Technology"){
      setTechnology({...technology, value: event.value});
    }
    else if(event.name === "Healthcare"){
      setHealthcare({...healthcare, value: event.value});
    }
    else if(event.name === "Education"){
      setEducation({...education, value: event.value});
    }
    else if(event.name === "All"){
      setEducation({...all, value: event.value});
    }
  }
  return (
  <React.Fragment>
    <div className="App">
      
      <div className="Background">
        <nav className='nav'>CHATBOT</nav>
      </div>
      <div className='options'>
      <label className='label' onClick={() => onCheckboxHandler({name: "All", value: !all.value})}>
          <input type="checkbox" value={all} />
          All (default)
        </label>
        <label className='label' onClick={() => onCheckboxHandler({name: "Politics", value: !politics.value})}>
          <input type="checkbox" value={politics} />
          Politics
        </label>
        <label className='label' onClick={() => onCheckboxHandler({name: "Education", value: !education.value})}>
          <input type="checkbox" value={education}  />
          Education
        </label>
        <label className='label' onClick={() => onCheckboxHandler({name: "Healthcare", value: !healthcare.value})}>
          <input type="checkbox" value={healthcare}  />
          Healthcare
        </label>
        <label className='label' onClick={() => onCheckboxHandler({name: "Technology", value: !technology.value})}>
          <input type="checkbox" value={technology}  />
          Technology
        </label>
        <label className='label' onClick={() => onCheckboxHandler({name: "Environment", value: !environment.value})}>
          <input type="checkbox" value={environment}  />
          Environment
        </label>

      </div>
    </div>

    <div className="image">
    </div>

    <div className="chatScreen">
      <div style={{paddingTop : "20px"}}>
      </div>

    {chat.map((text, index) => {
      return (<div key={index}>
        {index%2!==0 ? 
        
        <div className='response'>
              <img src={"https://images.unsplash.com/photo-1586374579358-9d19d632b6df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym90fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"} alt='botimage' className="setBotImage" />
              <div className="botResponse">
                <i><b>{text}</b></i>
              </div>
            </div>
        : null}
            {index%2===0 ? <div className='queries'>
      <div className="userResponse">
      <i><b>{text}</b></i>

      </div>
      <img src={"https://cdn.pixabay.com/photo/2016/03/31/18/26/coding-1294361_960_720.png"} alt='userimage' className="setUserImage" />
    </div>: null}
        </div>)
    })}
  {loader}
  <div ref={messagesEndRef} />  
    </div>
      <form className='inputs'>
        <input type="text" className="inputBox" onChange={onChangeHandler} value={userText} />
        
        <button type="submit" className='submit' onClick={onClickHandler}> ENTER </button>
      </form>
  </React.Fragment>
   
  );
}

export default App;
