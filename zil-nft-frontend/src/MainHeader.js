import React from 'react';
import { useHistory } from "react-router-dom";
import { getRandomAddress } from "./api"
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  }
}));

export default function () {
  const classes = useStyles();
  const history = useHistory();
  const { loginWithRedirect } = useAuth0();
  const goRandom = async () => {
    const random = await getRandomAddress()
    history.push(`/address/${random}`)
  }

  return (

    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          NFT Portfolio
            </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Create, view and share NFT Portfolios on Zilliqa blockchain in laziest way.
            </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => loginWithRedirect({redirectUri: window.location.href + 'myportfolio'})}>
                Create portfolio
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={goRandom}>
                Random portfolio
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}