import axios from "axios";

//for Live project
// const API = axios.create({
//   baseURL: process.env.REACT_APP_MY_LIVE_URL,
// });

const createServiceAPI = (baseURL) => {
  const serviceAPI = axios.create({ baseURL });

  //Middleware to set the token in all the services.
  serviceAPI.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
      req.headers.Authorization = `Bearer ${
        JSON.parse(localStorage.getItem("profile")).tokenId ||
        JSON.parse(localStorage.getItem("profile")).token
      }`;
    }
    return req;
  });

  return serviceAPI;
};

const servicesConfig = {
  AUTH_API: "http://localhost:5000/api",
  POST_API: "http://localhost:5001/api",
  MAIL_API: "http://localhost:5002/api",
  CHAT_API: "http://localhost:5003/api",
};

const AUTH_API = createServiceAPI(servicesConfig.AUTH_API);
const POST_API = createServiceAPI(servicesConfig.POST_API);
const MAIL_API = createServiceAPI(servicesConfig.MAIL_API);
const CHAT_API = createServiceAPI(servicesConfig.CHAT_API);

// let API;

// const servicesObj = {
//   AUTH_SERVICE: 5000,
//   POST_SERVICE: 5001,
// };

//to check the token of user is present in localstorage or not and this interceptors callback is going to excuted before sending the request to the backend and set token to the request header so in backend middleware function can check the user is authorized or not

//Previous method in which we fetches the all the posts
// export const fetchPosts = async (page) => {
//   const fullArray = await API.get("/posts");
//   return fullArray.data;
// };

//New method now we fetches the posts for the specific page ,we send page number to the backend.
export const fetchPosts = async (page) => {
  const fullArray = await POST_API.get(
    page ? `/v1/posts?page=${page}` : "/v1/posts"
  );
  return fullArray.data;
};

//Query parameters are include for search the post
export const fetchPostsBySearch = async (searchQuery) => {
  //Query parameters are always begin with "?" we can see below
  const searchedPosts = await POST_API.get(
    `/v1/posts?search=${searchQuery.search || ""}&tags=${
      searchQuery.tags || ""
    }`
  );
  return searchedPosts;
};

//post detail
export const getSinglePost = async (id) => {
  const getPost = await POST_API.get(`/v1/posts/${id}`);
  return getPost;
};

export const createPost = async (newpost) => {
  const singleData = await POST_API.post("/v1/posts", newpost);
  return singleData.data;
};

export const updatePost = async (id, updatedPost) => {
  const updatedData = await POST_API.patch(`/v1/posts/${id}`, updatedPost);
  return updatedData;
};

export const deletePost = async (id) => {
  const deleteId = await POST_API.delete(`/v1/posts/${id}`);
  return deleteId;
};

export const likePost = async (id) => {
  const likePost = await POST_API.patch(`/v1/posts/${id}/likePost`);
  return likePost;
};

export const commentPost = async (finalComment, id) => {
  const commentPost = await POST_API.post(`/v1/posts/${id}/commentPost`, {
    finalComment,
    id,
  });
  return commentPost;
};

export const signIn = (formData) => {
  // const data = API.post("/user/signin", formData);
  const data = AUTH_API.post("/v1/user/signin", formData);

  return data;
};

export const signUp = (formData) => {
  // const data = API.post("/user/signup", formData);
  const data = AUTH_API.post("/v1/user/register", formData);

  return data;
};

//Need to implement real chat feature

//get searched User

export const searchUser = async (search) => {
  const data = await CHAT_API.get(`v1/chat/users?search=${search}`);
  return data;
};

export const createChat = async (userId) => {
  const data = await CHAT_API.post("v1/chat", { userId });
  return data;
};

export const fetchChats = async () => {
  const data = await CHAT_API.get(`v1/chat`);
  return data;
};

//Chat
export const addGroupMember = async (group) => {
  //For create the group for first time
  const data = await CHAT_API.post("v1/chat/group", group);
  return data;
};

export const renameGroup = async (group) => {
  const data = await CHAT_API.put("v1/chat/rename", group);
  return data;
};

export const removeMemberFromGroup = async (id) => {
  const data = await CHAT_API.put("v1/chat/groupremove", id);
  return data;
};

export const addToGroup = async (group) => {
  //Add grp member in the existing grp
  const data = await CHAT_API.put("v1/chat/groupadd", group);
  return data;
};

// MESSAGES
export const sendMessage = async (content) => {
  const data = await CHAT_API.post("v1/message", content);
  return data;
};

export const fetchMessages = async (chatId) => {
  const data = await CHAT_API.get(`v1/message/${chatId}`);
  return data;
};
