
import { useAppSelector } from "../../hooks";
import styled from 'styled-components'



const Backdrop = styled.div`
  position: fixed;
  left: 0%;
  margin: auto;
  margin-top: 10px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-style: solid;
  border-width: 2px;
`

const TextDiv = styled.div`
  font-family: Monospace;
  font-size: 1.5em;
  font-weight: 550;
  padding-left: 5px;
`

export function CoinsView() {
  const bitsBalance = useAppSelector((state) => state.userPathStore.bitsBalance)
  return (
    <Backdrop>
      <Wrapper>

          <img 
            src="bitfgihter_assets/items/coin.png" 
            className="rounded-circle" 
            alt="Cinque Terre" 
            height="25" 
            width="25"
          ></img>

          <TextDiv>
            {bitsBalance}
          </TextDiv>
        

      </Wrapper>
    </Backdrop>
  )
}