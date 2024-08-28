import * as React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { LeftHealthBars } from './LeftHealthBars';
import { RightHealthBars } from './RightHealthBars';
import { Timer } from './Timer';
import { FightPlayer1AttributeInfo } from './FightPlayer1AttrbiuteInfo';
import { FightPlayer2AttributeInfo } from './FightPlayer2AttrbiuteInfo';
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export function BroadCastCombiner() {
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    return (
        <div>
            {fightersInfo.preFightStarted &&
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <LeftHealthBars />
                        <FightPlayer1AttributeInfo />
                    </Grid>
                    <Grid item xs={2}>
                        <Timer />
                    </Grid>
                    <Grid item xs={5}>
                        <RightHealthBars />
                        <FightPlayer2AttributeInfo />
                    </Grid>
                </Grid>
            }
        </div>
    )
}