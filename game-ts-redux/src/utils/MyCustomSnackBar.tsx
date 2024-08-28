import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


const vertical= 'bottom';
const horizontal = 'center';

export interface MyCustomSnackBarData {
  snackBarMessage: string;
  errSnackBarMessage: string
}

export default function MyCustomSnackBar(messageData: MyCustomSnackBarData) {
  const [snackBarOpen , setSnackBarOpen] = useState(false);
  const [errsnackBarOpen , setErrSnackBarOpen] = useState(false);

  
  if (messageData.snackBarMessage !== "") {
    setSnackBarOpen(true);
  }
  if (messageData.errSnackBarMessage !== "") {
    setErrSnackBarOpen(true);
  }

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false);
  };
  
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={errsnackBarOpen}
        autoHideDuration={6000}
        onClose={errSnackBarHandleClose}
        key={uuidv4()}
      >
        <Alert onClose={errSnackBarHandleClose} severity="error" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Error </AlertTitle>
            {messageData.errSnackBarMessage}
        </Alert>
      </Snackbar>


      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        key={uuidv4()}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Success </AlertTitle>
            {messageData.snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}