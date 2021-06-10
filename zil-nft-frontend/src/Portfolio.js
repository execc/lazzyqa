import './App.css';
import { useEffect, useState } from 'react'
import { getPortfolio, savePortfolio } from './api'
import { useAuth0 } from "@auth0/auth0-react";
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CryptoJS from 'crypto-js';
import DeleteForeverRounded from '@material-ui/icons/DeleteForeverRounded';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  manager: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4, 0, 3),
  }
}));

function AddressRow(props) {
  const { value, changeAddress, deleteAddress } = props
  return (
    <>
      <Grid item xs={11} sm={11} md={11}>
        <TextField 
          value={value}
          onChange={(e) => {changeAddress(e.target.value)}}
          id="outlined-basic"
          size="small" 
          label="Zilliqa Address" 
          variant="outlined" 
          fullWidth={true} />
      </Grid>
      <Grid item xs={1} sm={1} md={1} style={{ marginTop: '2px' }}>
        <Button color="secondary" fullWidth={true} variant="outlined" onClick={deleteAddress}>
          <DeleteForeverRounded />
        </Button>
      </Grid>
    </>
  )
}


function Portfolio() {
  const classes = useStyles();
  const { user } = useAuth0();
  const [addresses, setAddresses] = useState([])
  const [name, setName] = useState()
  const hash = CryptoJS.SHA256((user && user.email) || 'test').toString();
  const id = hash.substr(0, 12)
  useEffect(() => {
    const fn = async () => {
      const result = await getPortfolio(id)
      setAddresses(result ? result.addresses: [])
      setName(result && result.name ? (result.name || '') : user ? user.given_name || '' : '')
    }

    fn()
  }, [id])

  const saveFolio = async () => {
    const folio = {
      _id: id,
      email: user && user.email,
      name,
      addresses
    }
    await savePortfolio(folio)
  }

  const addAddress = () => {
    setAddresses([...addresses, 'New Address'])
  }

  const deleteAddress = (index) => () => {
    setAddresses([...addresses.slice(0, index), ...addresses.slice(index + 1)])
  }

  const changeAddress = (index) => (value) => {
    const newAddresses = [...addresses]
    newAddresses[index] = value
    setAddresses(newAddresses)
  }

  if (!user) {
    return <div/>
  }

  return (
    <>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            You Portfolio
            </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Share you portfolio with link<br/>
            {window.location.protocol}//{window.location.hostname}{window.location.port ? `:${window.location.port}` : ''}/portfolio/{id}
            </Typography>
          <div>

          </div>
        </Container>
      </div>

      <div className={classes.manager}>
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={11} sm={11} md={11}>
              <TextField 
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="outlined-basic"
                size="small" 
                label="" 
                variant="outlined" 
                fullWidth={true} />
            </Grid>
        
            {
              addresses.map((a, index) => <AddressRow
                  key={index}
                  value={a}
                  changeAddress={changeAddress(index)}
                  deleteAddress={deleteAddress(index)}
                />)
            }

            <Grid item xs={12} sm={12} md={12}>
              <Button color="default" fullWidth={true} variant="outlined" onClick={addAddress}>
                Add Address
            </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Button color="primary" fullWidth={true} variant="outlined" onClick={saveFolio}>
                Save
            </Button>
            </Grid>

          </Grid>
        </Container>
      </div>

    </>
  );
}

export default Portfolio;
