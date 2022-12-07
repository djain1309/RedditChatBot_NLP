import './App.css';
import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import {Circles} from 'react-loader-spinner'

function App() {
  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const [userText, setUserText] = useState('');
  const [loading, setLoading] = useState('');
  const [all, setAll] = useState({name: 'All', value: true});
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
      setAll({...all, value:false})
      topic.push(politics.name);
    } if(education.value){
                 setAll({...all, value:false})


      topic.push(education.name);
    }if(technology.value){
                 setAll({...all, value:false})


      topic.push(technology.name);
    }
    if(healthcare.value){
                  setAll({...all, value:false})


      topic.push(healthcare.name);
    }
    if(environment.value){
                  setAll({...all, value:false})


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
            setAll({...all, value:false})

      setPolitics({...politics, value: event.value});
    } else if(event.name === "Environment"){
            setAll({...all, value:false})

      setEnvironment({...environment, value: event.value});
    }
    else if(event.name === "Technology"){
       setAll({...all, value:false})
      setTechnology({...technology, value: event.value});
    }
    else if(event.name === "Healthcare"){
       setAll({...all, value:false})
      setHealthcare({...healthcare, value: event.value});
    }
    else if(event.name === "Education"){
       setAll({...all, value:false})
      setEducation({...education, value: event.value});
    }
    else if(event.name === "All"){
      if(event.value === true){
        setTechnology({...technology, value: false})
        setHealthcare({...healthcare, value: false})
        setEnvironment({...environment, value: false})
        setEducation({...education, value: false})
        setPolitics({...politics, value: false})
      }
      setAll({...all, value: event.value});
    }
  }
  return (
  <React.Fragment>
    <div className="App">
      
      <div className="Background">
        <nav className='nav'>CHATBOT</nav>
      </div>
      <div className='options'>
      <label className='label' >
          <input type="checkbox"  checked={all.value}
                 onChange={() => onCheckboxHandler({name: "All", value: !all.value})}/>
          All (default)
        </label>
        <label className='label' >
          <input type="checkbox" checked={politics.value}
          onChange={() => onCheckboxHandler({name: "Politics", value: !politics.value})}/>
          Politics
        </label>
        <label className='label' >
          <input type="checkbox" checked={education.value}
          onChange={() => onCheckboxHandler({name: "Education", value: !education.value})}/>
          Education
        </label>
        <label className='label' >
          <input type="checkbox" checked={healthcare.value}
          onChange={() => onCheckboxHandler({name: "Healthcare", value: !healthcare.value})}/>
          Healthcare
        </label>
        <label className='label' >
          <input type="checkbox" checked={technology.value}
          onChange={() => onCheckboxHandler({name: "Technology", value: !technology.value})}/>
          Technology
        </label>
        <label className='label' >
          <input type="checkbox" checked={environment.value}
          onChange={() => onCheckboxHandler({name: "Environment", value: !environment.value})}/>
          Environment
        </label>

      </div>

      <button
        onClick={() => openInNewTab('https://public.tableau.com/app/profile/sakshi.singhal5370/viz/sakshi_16703798725510/Dashboard1')}
        style={{backgroundColor: "#fff", float: "right", cursor: "pointer"}}  >
        GO TO TABLEAU
      </button>
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
