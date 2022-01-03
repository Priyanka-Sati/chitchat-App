import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth, storage } from './firebase'
import Modal from '@material-ui/core/Modal';
import { Button, Input, makeStyles } from '@material-ui/core';
// import InstagramEmbed from 'react-instagram-embed';


import Post from './Post';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
  return{
    top : `${top}%`,
    left : `${left}%`,
    transform : `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position : 'absolute',
    width : 400,
    backgroundColor : theme.palette.background.paper,
    border : '2px solid #000',
    boxShadow : theme.shadows[5],
    padding : theme.spacing(2, 4, 3),
  }
}))


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect (() => {  // frontend listener useEffect
    const unsubscribe =  auth.onAuthStateChanged((authUser) =>{   // backend listener
        if(authUser){
          //user had loggefd in onAuthStateChanged
          console.log(authUser)
          setUser(authUser);
          
        }
        else{
          // user has logged out
          setUser(null)
        }
    })
    return () => {
      // when we not use unsubcribe and in every update in user auth useEffect is called and there can be lot of listener call so this can be heavy to solve this unsubscribe is used
      // if useEffect if fires again perform some cleanup action before refire.
      // perform some cleanup action
      unsubscribe();
    }

  }, [user, username]);

  useEffect(() => {
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(doc => ({
            id : doc.id,
            post : doc.data()
          })));
      })
  }, []);

  const signUp = (event) => {
      event.preventDefault();  // not using this will cause the referesh after clicking submit button

      auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
          return authUser.user.updateProfile({
            displayName : username
          })
      }).catch((err) => alert(err.message));
      setOpen(false)
  }

  const signIn= (event) => {
    event.preventDefault();  // not using this will cause the referesh after clicking submit button

    auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err.message));

    setOpenSignIn(false);
  }

 
  return (
    <div className="app">


      {/* ******** SIGN UP ******** */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>

          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPUEANUgfVsF5nYaWOLz_g45vjXu8T7qoX3RJ2LyYQA4ljmgAkj2HGILbjR2Y9GT-xrhk&usqp=CAU"
                alt=""
              />
            </center>
              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />        
              
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
           </form>
            
        </div>
      </Modal>

       {/* ******** SIGN IN ******** */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>

          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPUEANUgfVsF5nYaWOLz_g45vjXu8T7qoX3RJ2LyYQA4ljmgAkj2HGILbjR2Y9GT-xrhk&usqp=CAU"
                alt=""
              />
            </center>
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
           </form>
            
        </div>
      </Modal>



      <div className="app_header">
          <img
              className="app_headerImage"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPUEANUgfVsF5nYaWOLz_g45vjXu8T7qoX3RJ2LyYQA4ljmgAkj2HGILbjR2Y9GT-xrhk&usqp=CAU"
              alt=""
          />

        {
          user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className='app_loginContainer'>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>          
          )
        }

      </div>   
        
        <div className='app_posts'>
            {
              // applying key -> using it it does not refresh all post it only add the new post  
              posts.map(({id, post}) => (
                  <Post key={id} postId={id} user={user} username = {post.username} caption={post.caption} imgUrl={post.imgUrl} />
              ))
            }
        </div>

      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login</h3>
      )}

    </div>
  );
}

export default App;
