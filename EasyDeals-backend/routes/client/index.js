const admin = require('../../services/admin')
const client = require('../../services/client')
const {Router} = require('express')
const {upload} = require('../../middlewares/upload')
const verifyUser = require('../../middlewares/verifyUser')

const router = Router();


router.get('/',admin.temp)
router.post('/signup',upload.single('file'),client.signUp);
router.post('/login',client.login);
router.post('/getfriends',verifyUser,client.getFriends);
router.post('/getchat',verifyUser,client.getChat);
router.post('/addfriend',verifyUser,client.addFriend);
router.post('/sendmail',client.sendMail);
router.post('/verify',client.verifyotp);
router.post('/dealupload',upload.single('file'),verifyUser,client.uploadDeal);
router.post('/verifyuser',verifyUser,client.getClientData);
router.post('/getuserdata',client.getClientData);
router.post('/getalldeals',client.getAllDeals);
router.post('/getDealData',verifyUser,client.getDealData);
router.get('/getimg/:id',client.getImg);
router.post('/changeunreadcount',client.changeUnreadCount)
router.post('/getpersonaldata',verifyUser,client.getpersonalData)
router.post('/editprofile',verifyUser,upload.single('file'),client.edit)
router.post('/getmydeals',verifyUser,client.getMyDeals);
router.post('/deletedeal',verifyUser,client.deleteDeal);
router.post('/logout',client.logout);
router.post('/updatedeal',verifyUser,client.updateDeal);
router.post('/updatepassword',client.changepassword);
router.post('/gethistory',verifyUser,client.getHistory);
module.exports = router;