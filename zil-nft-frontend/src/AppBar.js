import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  separator: {
    flexGrow: 1,
  },
  title: {
    marginRight: theme.spacing(2),
  }
}));

export default function () {
  const classes = useStyles();
  const history = useHistory();
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const go = async (address) => {
    history.push(`/${address}`)
  }
  return (
    <AppBar position="relative">
      <Toolbar>
        <CameraIcon className={classes.icon} />
        <Typography variant="h6" color="inherit" noWrap className={classes.title}>
          Lazzyqa
        </Typography>
        <Button color="inherit" onClick={() => go('')}>
          Explore
        </Button>
        <div className={classes.separator} />
        <Typography variant="h6" color="inherit" noWrap>
          {isAuthenticated ?
            <Button color="inherit" onClick={() => go('myportfolio')}>
              My Portfolio
        </Button>
            : 
        <Button color="inherit" onClick={() => loginWithRedirect()}>
          Log In
        </Button>}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}