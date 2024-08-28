
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
// import { ListViewerData } from './MenuSideBar';

export interface ListViewerData {
  main: string,
  sequence: number,
  subdata: string,
}

export interface ListViewerDataWrapper {
  data : ListViewerData;
}

export default function ListViewer(data: ListViewerData) {
  console.log(data)
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {/* {
        data.map((ddd: ListViewerData) => {
          return(
            <ListItem>
              <ListItemText primary={ddd.main} secondary="July 20, 2014" />
              <ListItemAvatar>
                <Avatar>
                  <CancelIcon />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          )
        })
      } */}
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Work" secondary="Jan 7, 2014" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Vacation" secondary="July 20, 2014" />
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
      </ListItem>
    </List>
  )
}