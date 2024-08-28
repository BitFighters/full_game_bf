import { Alert, AlertTitle, Snackbar } from "@mui/material";


const vertical= 'bottom';
const horizontal = 'center';

interface SuccessSnackBarOption {
  message: string,
  open: boolean,
  handleClose: any
}

export default function ErrSnackBarHelper (data: SuccessSnackBarOption) {
  
  const handleClose = () => {
    data.handleClose(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={data.open}
        autoHideDuration={12000}
        onClose={handleClose}
        key={vertical + horizontal}
      >

        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Error </AlertTitle>
            {data.message}
        </Alert>
        
      </Snackbar>
    </div>
  )
}