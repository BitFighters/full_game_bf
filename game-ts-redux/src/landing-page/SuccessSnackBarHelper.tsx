import { Alert, AlertTitle, Snackbar } from "@mui/material";


const vertical= 'bottom';
const horizontal = 'center';

interface SuccessSnackBarOption {
  message: string,
  open: boolean,
  handleClose: any
}

export default function SuccessSnackBarHelper (data: SuccessSnackBarOption) {
  // const [snackBarOpen , setSnackBarOpen] = useState(false);
  // const [errSnackBarMessage, setErrSnackBarMessage] = useState("");

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

        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Success </AlertTitle>
            {data.message}
        </Alert>
        
      </Snackbar>
    </div>
  )
}