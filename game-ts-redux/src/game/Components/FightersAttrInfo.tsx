import { useAppSelector } from "../../hooks";
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';


const BackdropLeft = styled.div`
  position: fixed;
  // text-align: center;
  margin: auto;
  width: 40%;
  // width: auto;
  // background-color: #2c2c2c;
  opacity: 0.8;
  left: 0%;
`

const BackDropLeftForHealthBars = styled.div`
  position: fixed;
  width: 40%;
  border-style: solid;
  border-width: 10px;
  // left: 0px;
`

const BackdropRight = styled.div`
  position: fixed;
  text-align: center;
  margin: auto;
  // width: 12%;
  margin: auto;
  // background-color: #2c2c2c;
  opacity: 0.8;
  right: 0%;
`

const Wrapper = styled.div`
  position: fixed;
`

const TextWrapper = styled.h5`
  color: aliceblue;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  font-size: 32px;
  padding: 10px;
  background-color: black;
`

const Imagewrapper = styled.div`
  
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TableWrapper = styled.div`
  color: #C1D5EE;
  display: flex;
  justifyContent: center;
`

export function FightersAttrInfo() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  // console.log("fightersInfo-->", fightersInfo)
  return (
    <Wrapper>
      {fightersInfo.player1.walletAddress !== "" && 
      <div>
        <BackdropLeft>
          <BackDropLeftForHealthBars>
            <div className="progress" style={{height: '15px'}}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{width: '25%'}} 
                aria-valuenow={25} 
                aria-valuemin={0} 
                aria-valuemax={100}
              ></div>
            </div>

            <div className="progress" style={{height: '15px', marginTop: '5px'}}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{width: '35%'}} 
                aria-valuenow={25} 
                aria-valuemin={0} 
                aria-valuemax={100}
              ></div>
            </div>
          </BackDropLeftForHealthBars>
          <TextWrapper>
            {fightersInfo.player1.nick_name}
          </TextWrapper>
          <Imagewrapper>
            <div>
              <img
                src={fightersInfo.player1.profile_image}
                style={{
                  height: '150px',
                  width: '150px',
                }}
              />

            </div>
            
          </Imagewrapper>
          <div key={uuidv4()} style={{
            color: '#C1D5EE',
            // display: `flex`,
            // justifyContent: 'flex-start',
            // justifyContent: `center`,
            // width: '100%'
          }}>
            <table style={{
              width: `40%`
            }}>
              <tbody>
                <tr key={uuidv4()}>
                  <td>Defense</td>
                  <td>{fightersInfo.player1.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Punch</td>
                  <td>{fightersInfo.player1.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Kick</td>
                  <td>{fightersInfo.player1.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Speed</td>
                  <td>{fightersInfo.player1.speed}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BackdropLeft>
      
        <BackdropRight>
          <TextWrapper>
            {fightersInfo.player2.nick_name}
          </TextWrapper>
          <Imagewrapper>
            <div>
              <img
                src={fightersInfo.player2.profile_image}
                style={{
                  height: '150px',
                  width: '150px',
                  transform: `scaleX(-1)`
                }}
              />

            </div>
            
          </Imagewrapper>
          <div key={uuidv4()} style={{
            color: '#C1D5EE',
            // display: `flex`,
            // justifyContent: 'flex-end',
          }}>
            <table style={{
              width: `100%`
            }}>
              <tbody>
                <tr key={uuidv4()}>
                  <td>Defense</td>
                  <td>{fightersInfo.player2.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Punch</td>
                  <td>{fightersInfo.player2.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Kick</td>
                  <td>{fightersInfo.player2.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Speed</td>
                  <td>{fightersInfo.player2.speed}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BackdropRight>
      </div>}
    </Wrapper>
  )
}