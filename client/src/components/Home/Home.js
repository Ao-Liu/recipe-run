import React, { useState, useEffect } from 'react';
import { Toolbar, Typography, Container, Grow, Grid, AppBar, TextField, Button, Paper, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import medal from '../../images/medal.png';

import { getPostsBySearch } from '../../actions/posts'; 
import { getContest, getRecentContests, getRecipe } from '../../actions/contest'; 
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const {contests, isLoading} = useSelector((state) => state.contests);
  const [ucStartDate, setUcStartDate] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [started, setStarted] = useState(false);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [rulesOpen, setRulesOpen] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRecentContests());
  }, []);

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleUpdateTime = () => {
    let ms = new Date(contests[2].startDate) - new Date();
    if (ms < 0) {
      setStarted(true);
    }
    setUcStartDate(mssecondsToTime(ms));
  }

  const mssecondsToTime = (secs) => {
    secs = Math.floor(secs/1000);
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.abs(Math.floor(divisor_for_minutes / 60));

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.abs(Math.ceil(divisor_for_seconds));

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
 
  const updateContestInfo = () => {
    console.log(`------------${JSON.stringify(contests[2].number)}`);
    console.log(`------------${JSON.stringify(mssecondsToTime(new Date(contests[2].startDate) - new Date()))}`);
    history.push(`/home/`);
  }

  const handleClickViewRules = () => {
    setRulesOpen(true);
  }

  const handleCloseViewRules = () => {
    setRulesOpen(false);
  }

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  // const getRecipeById = (id) => {
  //   dispatch(getRecipe(id));
  // }

  return (
    isLoading ? <CircularProgress /> : <Grow in>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid>
          <Dialog
            open={rulesOpen}
            onClose={handleCloseViewRules}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Rules"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Contest Organizer: {contests[2].creator} <br/><br/>
                Rules: {contests[2].rules} <br/><br/>
                Prize: {contests[2].prize.map((p) => `${p } `)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewRules} autoFocus> Close </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={12} md={3}>
          <img src={medal} height="350em"/>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className={classes.holder}  style={{ padding: '72px', borderRadius: '15px', backgroundColor:'#FEF7CE'}} elevation={0}>
            <Typography style={{ fontWeight: 600, marginLeft: '10px' }} variant="h3" component="h2">{contests[2].name} #{contests[2].number} in</Typography>
            <div style={{display:'none'}}>{setInterval(handleUpdateTime, 1000)}</div>
            <Typography style={{ fontWeight: 600, textAlign:'center', marginTop: '30px'}} variant="h1" component="h2">{ucStartDate.h}h {ucStartDate.m}m {ucStartDate.s}s</Typography>
            <Grid style={{ marginTop: '30px', textAlign:'center' }}>
              {started ? <Button variant="contained" size="large" color="primary" 
              onClick={updateContestInfo} 
              disableElevation style={{ backgroundColor: '#82B36F' }}>Register Now</Button> : 
              <Button variant="contained" size="large" color="primary" 
              onClick={updateContestInfo} 
              disableElevation style={{ backgroundColor: '#82B36F' }}>Preview</Button>}
              <Button variant="contained" size="large" color="primary" disableElevation onClick={handleClickViewRules} style={{ backgroundColor: '#FFF', color: '#000', marginLeft:'30px' }}>View Rules</Button> 
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          {/* <div style={{display:'none'}}>{getRecipeById(contests[1].recipe)}</div> */}
          <Paper className={classes.holder} style={{ padding: '50px', borderRadius: '15px', height:"25vh", backgroundColor:'#EFEEFE',}} elevation={0}>
              <Typography style={{ fontWeight: 600, marginLeft: '10px' }} variant="h4" component="h2">{contests[1].name} #{contests[1].number} review</Typography>
              <Typography style={{ fontWeight: 600, textAlign:'start', marginTop: '30px', marginLeft:'20px'}} variant="h2" component="h2">???</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.holder} style={{padding: '50px', borderRadius: '15px', height:"25vh", backgroundColor:'#FAE4EC',}} elevation={0}>
              <Typography style={{ fontWeight: 600, marginLeft: '10px' }} variant="h4" component="h2">{contests[0].name} #{contests[0].number} review</Typography>
              <Typography style={{ fontWeight: 600, textAlign:'start', marginTop: '25px', marginLeft:'20px'}} variant="h2" component="h4">???</Typography>
            </Paper>
        </Grid>
      </Grid>
    </Grow>
  );
};

export default Home;
