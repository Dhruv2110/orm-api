// const keywords = require('../models/keywords');
const Keywords = require('../models/keywords');


exports.loadKeywords = (req,res,next) => {
    // keywords.find({})
    // console.log(req.user);
    console.log("Hello , Keywords");
    Keywords.find({ userId: req.user._id})
            .then(listKeywords => {
                console.log(listKeywords);
                res.json(listKeywords);
            })
            .catch(err => {
                res.send({msg:'Unable to load keywords'})
                console.log(err)})
}

exports.saveKeywords = async (req,res,next) => {
    // Keywords.find
    console.log("Request Body : ",req.body);
    try{
        var data = req.body;
        // console.log("Here: UserId : ",req.user._id);
        console.log("Data : ",data);
        // const newKeywords = new Keywords({ keywords: { items: data }, userId: "607709c7cc0ebf29b85c5340"});
        await Keywords.findOneAndUpdate({userId: (req.user._id).toString()} , {keywords:{items: data}})
                      .then(result => {
                          console.log('In Result,' , result);
                          return res.status(200).send({
                              msg: "Keywords Saved successfully.",
                              status: 200
                          })
                      })
                      .catch(err => {
                          console.log(err);
                      })
    }
    catch(err)
    {
        console.error(err)
        res.status(500).send({
            msg: 'Internal server error',
            status: 500
        })
    }

}