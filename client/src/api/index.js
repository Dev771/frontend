import axios from 'axios';

const API = axios.create({ baseURL: "http://localhost:8080" });

API.interceptors.request.use((req)=> {
    if(localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
})

export const getPost = () => API.get('/posts');
export const createPost = (NewPost) => API.post('/posts', NewPost);
export const likePost = (id, state) => API.patch(`/posts/${id}/${state}`);

export const getTag = () => API.get('/tags');

export const SignIn = (formData) => API.post('/auth/signIn', formData);
export const SignUp = (formData) => API.post('/auth/signUp', formData);