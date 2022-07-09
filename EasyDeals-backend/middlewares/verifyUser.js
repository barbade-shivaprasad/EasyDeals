const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config();
const verifyUser=(request,response,next)=>{
    try {
        let token = request.cookies.token;
        let decodedToken = jwt.verify(token,process.env.secret)
        request.body.email = decodedToken.email;
        next();
    } catch (error) {
        console.log(error)
        response.status(202).send("Please login/signup");
    }
}

module.exports = verifyUser;