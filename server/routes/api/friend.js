const router = require('express').Router(),
      auth = require('../auth'),
      User = require('../../models/User'),
      Friend = require('../../models/Friend');

router.use(auth.verifyToken);

router.post('/add', (req, res, next) => {
    if(!req.body.id) {
        res.send({error : {message : "Please provide user id!"}});
    }
    User.findById(req.body.id, (error, user) => {
        if(error) {
            res.send({error : {message : error.message}});
        }else if(!user) {
            res.send("User is not registered.");
        }else {
            User.findById(req.user.id, (error, myProfile) => {
                if(error) {
                    res.send({error : {message : error.message}});
                }
                const index = user.friends.findIndex(obj => obj.requestId===myProfile.id);
                if(index>-1 && user.friends[index].status===1) {
                    res.send({message : "You've already sent a friend request..Please wait for a reply!!"});
                }else if(index>-1 && user.friends[index].status===2) {
                    res.send({message : "You're already friends."});
                }else if(index>-1 && user.friends[index].status===0) {
                    const friend = new Friend();
                    friend.friendId = user.id;
                    friend.save()
                    .then(friendData => {
                        user.friends[index].friendDetails = friendData;
                        user.save();
                        res.send({message : "You're now friends!!"});
                    })
                    .catch(error => {
                        res.send({error : {message : error.message}});
                    })
                }else {
                    user.friends.push({
                        status : 1,
                        requestId : myProfile.id
                    });
                    user.save();
                    myProfile.friends.push({
                        status : 0,
                        requestId : user.id
                    });
                    myProfile.save();
                    res.send({message : "Request sent successfully.."});
                }
            })

        }
    })
});

module.exports = router;