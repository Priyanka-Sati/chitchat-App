import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase'


function App() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
      db.collection('posts').onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(doc => ({
            id : doc.id,
            post : doc.data()
          })));
      })
  }, [])

  return (
    <div className="app">
      <div className="app_header">
          <img
              className="app_headerImage"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPUEANUgfVsF5nYaWOLz_g45vjXu8T7qoX3RJ2LyYQA4ljmgAkj2HGILbjR2Y9GT-xrhk&usqp=CAU"
              alt=""
          />
      </div>
      <h1>Hello</h1>

      {
        // applying key -> using it it does not refresh all post it only add the new post  
        console.log(posts),
        posts.map(({id, post}) => (
            <Post key={id} username = {post.username} caption={post.caption} imgUrl={post.imgUrl} />
        ))
      }
    </div>
  );
}

export default App;
