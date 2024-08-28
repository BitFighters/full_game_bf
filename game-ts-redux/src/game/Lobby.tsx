import React from 'react';
// import '../App.css';
import styled from 'styled-components'


const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function Lobby() {
  
  return (
    <div>
      <Backdrop>
        Lobby
      </Backdrop>
    </div>
  );
}

export default Lobby;
