
import styled from 'styled-components'


const Backdrop = styled.div`
`

const Wrapper = styled.div`
`

const TextDiv = styled.div`
  border-style: solid;
  border-width: 10px;
`

export function HealthBars() {
  return (
    <Backdrop>
      <Wrapper>
        <TextDiv>
        <div className="progress" style={{height: '15px', padding: '1px', margin: '1px'}}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{width: '25%'}} 
            aria-valuenow={25} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >  </div>
        </div>

        <div className="progress" style={{height: '15px', padding: '1px', margin: '1px'}}>
          <div 
            className="progress-bar bg-success" 
            role="progressbar" 
            style={{width: '35%'}} 
            aria-valuenow={25} 
            aria-valuemin={0} 
            aria-valuemax={100}
          > </div>
        </div>
        </TextDiv>
      </Wrapper>
    </Backdrop>
  )
}