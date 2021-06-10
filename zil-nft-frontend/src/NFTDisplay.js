import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function NFTCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const { image, title, subtitle, creator, owner } = props;
  const go = async (address) => {
    history.push(`/address/${address}`)
  }
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={image}
        title={title}
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography>
          {subtitle}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          View
        </Button>
        <Button size="small" color="default" onClick={() => go(creator)}>
          Author's portfolio
        </Button>
        <Button size="small" color="default" onClick={() => go(owner)}>
          Owner's portfolio
        </Button>
      </CardActions>
    </Card>
  )
}

export default function  (props) {
  const classes = useStyles();
  const { nfts } = props;

  return (
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {nfts ? nfts.map((nft) => (
              <Grid item key={nft._id} xs={12} sm={6} md={4}>
                <NFTCard 
                  image={nft.image} 
                  title={nft.title} 
                  creator={nft.creator}
                  owner={nft.owner}
                  subtitle={(nft.meta && nft.meta.subtitle || '')}
                  />
              </Grid>
            )): <CircularProgress />}
          </Grid>
        </Container>
  );
}