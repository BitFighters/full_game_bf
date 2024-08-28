import { InputBase } from "@mui/material";
import styled from "styled-components";


const ListItemViews = styled.div`
  img {
    height: 60px;
  }

  h1 {
    color: aliceblue;
    font-style: bold;
    font-size: 28px;
    font-family:'Cooper Black', sans-serif;
  }
`

const BetInfoView = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  margin: 2px;
  padding: 2px 5px 2px 5px;
  

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }
  

  h3 {
    // margin-top: 5px;
    font-family: Monospace;
    font-style: bold;
    font-size: 14px;
    color: white;
    line-height: 75%;
    display: flex;
    align-items: center;

    span {
      background-color: #63a595;
      border-radius: 10px;
      padding: 10px;
      display: flex;

      font-family: Monospace;
      font-style: bold;
      font-size: 14px;
    }
  }
`


const ImageAndTextView = styled.div`
  border: 4px solid #000000;
  border-radius: 6px;
  // border-color: red;
`

const ImageView = styled.div`
  margin: 4px;
  margin-top: 20px;
  border: 5px solid #000000;
  background-color: #232323;
  // border-color: red;
`

const BackDrop = styled.div`
  width: 100%;

`

const InputTextField = styled(InputBase)`
  // border-radius: 1px 1px 10px 10px;
  border: 2px solid #000000;
  input {
    // padding: 5px;
  }
`

interface QueueWindowInfo {
  profile_image: string,
  nick_name: string,
  wallet: string, 
  fight_id: string,
  total_bet: number,
}