import React, { memo, useState } from 'react';

import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import {
  Grid,
  Button,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Error from '../../components/errorHandling';

const validationSchema = Yup.object({
  title: Yup.string().min(6).max(50).required(),
  author: Yup.string().min(6).max(50).required(),
  status: Yup.string().required(),
});

const theme = createMuiTheme({
  palette: {
    primary: { main: '#36454f' },
    secondary: {
      main: '#002984',
    },
  },
});

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '50%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '50%',
  },
  loginError: {
    paddingTop: 20,
    paddingLeft: '25%',
    fontSize: 17,
    fontFamily: 'Helvetica',
    color: '#d8000c',
  },
}));

export const AddBook = memo(() => {
  const classes = useStyles();
  const [errorDisp, setErrorDisp] = useState('none');
  const [successDisp, setSuccessDisp] = useState('none');
  const [dataError, setDataError] = useState('');
  const [dataSuccess, setDataSuccess] = useState('');

  return (
    <Formik
      initialValues={{
        title: '',
        author: '',
        status: '',
      }}
      enableReinitialize="true"
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const formData = {
          title: values.title,
          author: values.author,
          status: values.status,
        };

        axios
          .post('/book', formData)
          .then(res => {
            if (!res.data.success) {
              console.log(res.data.message);
              setErrorDisp('');
              setDataError(res.data.message);
              setTimeout(() => {
                setErrorDisp('none');
              }, 3000);
            }
            if (res.data.success) {
              setSuccessDisp('');
              setDataSuccess(res.data.message);
              values.title = '';
              values.author = '';
              values.status = '';
              setTimeout(() => {
                setSuccessDisp('none');
              }, 3000);
            }
          })
          .catch(err => console.log(err));
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        isSubmitting,
        handleBlur,
        touched,
      }) => (
        <ThemeProvider theme={theme}>
          <div align="center" className={classes.paper}>
            <Typography component="h1" variant="h5" align="center">
              Add Book
              <hr
                style={{
                  backgroundColor: 'black',
                  height: 1,
                  width: 600,
                }}
              />
            </Typography>
            <Alert
              variant="filled"
              severity="error"
              style={{ display: errorDisp }}
            >
              {dataError}
            </Alert>

            <Alert
              variant="filled"
              severity="success"
              style={{ display: successDisp }}
            >
              {dataSuccess}
            </Alert>
            <form className={classes.form} onSubmit={handleSubmit}>
              <div align="center">
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  spacing={6}
                >
                  <Grid item xs={6}>
                    <TextField
                      // variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      id="title"
                      label="Title"
                      name="title"
                      type="text"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="title"
                      autoFocus
                    />
                    <div>
                      <Error touched={touched.title} message={errors.title} />
                    </div>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="author"
                      label="Author Name"
                      type="text"
                      id="author"
                      autoComplete="author"
                      value={values.author}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div>
                      <Error touched={touched.author} message={errors.author} />
                    </div>

                    <FormControl className={classes.formControl}>
                      <InputLabel id="status">Book Status</InputLabel>

                      <Select
                        fullWidth
                        name="status"
                        label="Status"
                        id="status"
                        value={values.status}
                        onChange={handleChange}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Already Booked">
                          Already Booked
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <div>
                      <Error touched={touched.status} message={errors.status} />
                    </div>
                  </Grid>
                </Grid>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </div>
        </ThemeProvider>
      )}
    </Formik>
  );
});
