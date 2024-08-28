import React from 'react';
import { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import styled from 'styled-components';

const BlackDiv = styled.div`
  color: black;
  font-family:'Cooper Black', sans-serif;
  font-style: bold;
  font-size: 14px;
  margin-left: 20px;
`
const TextDiv = styled.div`
  background-color: white;
  width: 250px;
  border-radius: 50px;
  border:1px solid #ccc!important
`

const ProgressDiv = styled.div`
  // color:#000!important;
  // background-color:#9e9e9e!important;
  border-radius: 50px;
  background-color: #ed764f;
`

function XpProgressBar() {

  const [percent, setPecent] = useState(0);

  const getTime = () => {
    setPecent(percent+10)
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1 *100);
    return () => clearInterval(interval);
  }, []);

  return (
      <div> 
        {/* <TextDiv>
          <ProgressBar 
            variant={`${"ORANGE"}`} 
            now={1158} 
            min={0} 
            max={2000} 
            label={<BlackDiv> XP: {`1158/2000`} </BlackDiv> }
          />
        </TextDiv> */}

        <TextDiv>
          <ProgressDiv style={{
            height:`22px`,
            width:`${percent}%`
          }}>
            <BlackDiv> XP: {1158}/{2000} </BlackDiv>
          </ProgressDiv>
        </TextDiv>
      </div>
  );
}

export default XpProgressBar;