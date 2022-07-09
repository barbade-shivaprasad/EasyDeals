const nodeMailer = require('nodemailer')

async function mailer(otp,recepient){

    let email = recepient;
    let parts = email.split("@");
    if (parts[parts.length - 1] !== "rgukt.ac.in")
        throw new Error("Please use rgukt domain mail");
       
       let transporter = nodeMailer.createTransport({
        service:'gmail',
        pool:true,
        port: 527,
        secure: false,
        maxConnections:3000,
        maxMessages:Infinity,
        auth: {
            type:'OAuth2',
            user: 'sgc.rgukt@gmail.com',
            clientId:'683342718243-od3akdcdfut6qqno9b03qenqpgv2dhjp.apps.googleusercontent.com',
            clientSecret:'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',
            accessToken:'ya29.a0ARrdaM8shiiTa4YVsZkoO7wlp_mbCVPYd00wEr9b5tX2rEbGWaLVMj1YFLAvx3EEpIKbRHImXNSaZE1l3SuamZymG_WAfe_AyKSdjboLQ1CuULzVwMD6aYDnGP_oQZtzYOJf3TWO3YlyDAyOiXKQpFHQbuMR',
            expires:'3599',
            refreshToken:'1//04vMzM6huObNbCgYIARAAGAQSNwF-L9IrHuTkWf9lna1pu1EMPtOHHX6-ZCso_jLRL7nokJsboU1czIWhBsMdSohllGW8hpm6Y1E',
        }
       })
    
       let mailOptions = {
           from:'sgc.rgukt@gmail.com',
           to:recepient,
           subject:'OTP for verification',
           text:`${otp} is your otp for verification \n\n Thank you.\n\n Regards,\n Your juniors.` 
       }
    
       try{
           let info = await transporter.sendMail(mailOptions);
           transporter.close()
           info.statusCode = 200;
           return info;
       }
       catch(err){
    
           err.statusCode = 202;
           return err;
       }
       
    }

    module.exports= mailer;