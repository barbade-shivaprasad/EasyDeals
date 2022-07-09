import axios from "axios";

let transport = axios.create({withCredentials:true});

export default transport;