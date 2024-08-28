// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { List, ListItem, Box, Grid, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNullOrUndefined } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { FetchWalletLog } from '../../../hooks/ApiCaller';

const ColoredH1 = styled.div`
  padding: 10px;
  margin: 10px;
  h2, h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }
`;

const TableColumnCommonStyles = `
  width: 24.75%; // Slight adjustment to ensure everything fits
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid;
  border-right: 1px solid;
  color: white;
`;




const ListItemViews = styled.div`
  // img {
  //   height: 60px;
  // }

  // h1, h2{
  //   color: aliceblue;
  //   font-style: bold;
  //   font-size: 20px;
  //   font-family:'Cooper Black', sans-serif;
  //   color: aliceblue;
  // }
`

const Item = styled.div`
  color: #31bca3;
  font-style: bold;
  font-size: 20px;
  font-family:'Cooper Black', sans-serif;
  border: 1px solid #42eacb;
  padding:5px;
  backgrond-color: #000000;
`

const HeaderItem = styled.div`
  backgrond-color: black;
  color: #31bca3;
  font-style: bold;
  font-size: 22px;
  font-family:'Cooper Black', sans-serif;
  line-height: 75%;
  border: 1px solid #42eacb;
  padding: 10px;
`

const HeaderContainer = styled.div`
  position: sticky;
  backgrond-color: black;
`

const BackDrop = styled.div`
  width: 100%;
`

const Wrapper = styled.div`
  border-collapse: collapse;
  background-color: black;
  margin-top: 50px;
  margin: 2%;
`

const ListWrapper = styled.div`
  display: block;
  max-height: 55vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 10px;
    border: 6px solid transparent;
    background-clip: content-box;  // This line is important for the thumb to have spaces on both sides, essentially reducing its visual width
  }

  &::-webkit-scrollbar-track {
    background-color: lightgrey;
    border-radius: 10px;
  }
`


interface LogEntry {
  balance_change: number;
  created_at: number;
  group: string;
  message: string;
  user_wallet_address: string;
}

export default function MyLogView() {
  const [log, setLog] = useState<LogEntry[] | null>(null);

  const loopFunctionUpdater = async () => {
    try {
      const logData = await FetchWalletLog();
      if (Array.isArray(logData.data)) {
        setLog(logData.data);
      }
    } catch (error) {
      console.error("Error fetching log data:", error);
    }
  }

  useEffect(() => {
    console.log("MyLogView_useeffect_first");
    loopFunctionUpdater()
  }, []);

  return (
    <BackDrop key={uuidv4()}>
      <Wrapper>
        <HeaderContainer>
          <Grid container spacing={0} >
            <Grid item xs={3}>
              <HeaderItem className='fs-5'> Date </HeaderItem>
            </Grid>
            <Grid item xs={3}>
              <HeaderItem className='fs-5'> Bits</HeaderItem>
            </Grid>
            <Grid item xs={6}>
              <HeaderItem className='fs-5'> Event </HeaderItem>
            </Grid>
          </Grid>
        </HeaderContainer>
        <ListWrapper>
          <List>
            {
              !isNullOrUndefined(log) && log.length > 0 &&
              log.map((entry, index) => {
                const date = new Date(entry.created_at);
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                return (
                  <Box>
                    <ListItem disablePadding key={uuidv4()}>
                      <Grid container spacing={0} >
                        <Grid item xs={3.1}>
                          <Item> {formattedDate} </Item>
                        </Grid>
                        <Grid item xs={3.1}>
                          {
                            entry.balance_change > 0 ?
                              <Item style={{
                                color: 'green'
                              }}>{entry.balance_change}</Item> :
                              <Item style={{
                                color: 'red'
                              }}>{entry.balance_change}</Item>
                          }
                        </Grid>
                        <Grid item xs={5.8}>
                          <Item>{entry.group}</Item>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Box>
                )
              })
            }
          </List>
        </ListWrapper>
      </Wrapper>
    </BackDrop>
  );
}
