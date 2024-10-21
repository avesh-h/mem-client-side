import { Container } from "@material-ui/core";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import ChatPage from "./components/Chat/ChatPage";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import PostDetails from "./components/PostDetails/PostDetails";
import { ChatState } from "./Context/ChatProvider";
import "./index.css";

const App = () => {
  const { user } = ChatState();
  return (
    // <Router>
    <Container maxWidth="lg">
      {/* <ChatProvider> */}
      <Navbar />
      <Routes>
        {/* if we entered in path like "/" then it immediatly forward to the
          '/posts' */}
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/posts" element={<Home />} />
        <Route path="/posts/search" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/posts" /> : <Auth />}
        />
        <Route
          path="/posts/chats"
          element={user ? <ChatPage /> : <Navigate to="/posts" />}
        />
      </Routes>
      {/* </ChatProvider> */}
    </Container>
    // </Router>
  );
};

export default App;
