import React, { useState, useEffect } from 'react';
import './CowBobbing.css'



const Cow = () => {
  const [cowstyle, setCowstyle] = useState({})

  useEffect(() => {
    if(window.innerWidth < window.innerHeight) {
      setCowstyle({width: '30vh', height: '30vw'})
    } else {
      setCowstyle({width: '30vw', height: '30vh'})
    }
  }, [])

  

  return (
    <div>
    <div class="cow bobbing"
      style={cowstyle}
    >
      {/* Cow body */}
      <div
        style={{
          width: '100%',
          height: '70%',
          background: 'white',
          borderRadius: '50%',
          border: '2px solid black',
        }}
      >
        {/* Cow spots */}
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: 'black',
            borderRadius: '50%',
            top: '30%',
            left: '20%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: 'black',
            borderRadius: '50%',
            top: '25%',
            left: '50%',
          }}
        />
        {/* Cow head */}
        <div
          style={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            background: 'white',
            borderRadius: '50%',
            border: '2px solid black',
            top: '20%',
            left: '80%',
          }}
        />
        {/* Cow eyes */}
        <div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'black',
            borderRadius: '50%',
            top: '30%',
            left: '85%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'black',
            borderRadius: '50%',
            top: '30%',
            left: '90%',
          }}
        />
      </div>
      {/* Cow legs */}
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '30%',
          background: 'white',
          border: '2px solid black',
          top: '60%',
          left: '20%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '30%',
          background: 'white',
          border: '2px solid black',
          top: '65%',
          left: '40%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '30%',
          background: 'white',
          border: '2px solid black',
          top: '65%',
          left: '60%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '30%',
          background: 'white',
          border: '2px solid black',
          top: '60%',
          left: '80%',
        }}
      />
    </div>
    <div style={{position:'relative',top:20,fontWeight:100,fontSize:"1.5rem"}}>Cow courtesy of ChatGPT</div>
    </div>
  );
};

export default Cow;
