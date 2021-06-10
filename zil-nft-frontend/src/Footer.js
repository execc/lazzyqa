import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Lazzyqa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function  () {
  const classes = useStyles();

  return (
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Lazzyqa
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">

        </Typography>
        <Copyright />
      </footer>
  );
}