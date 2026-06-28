import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

function Home() {
  return <h1>Welcome to Nexus</h1>;
}

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
