import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedIn><Home /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>
      }/>
    </Routes>
  );
}

export default App;
