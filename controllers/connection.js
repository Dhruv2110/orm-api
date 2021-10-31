const connections = require('../models/connection');
const api = require('../api/api')


exports.loadConnections = async (req, res, next) => {
    // keywords.find({})
    
    console.log("Hello , Connections");
    
    console.log(req.user);
    connections.find({ userId: req.user._id })
        .then(listconnections => {
            //console.log(listconnections);
            res.json(listconnections);
        })
        .catch(err => console.log(err))
}

exports.saveConnections = async (req, res, next) => {

    //console.log("Request Body : ", req.body);
    var URL = req.body.data;
    
    try {
        var URL = req.body.data;
        //console.log("URLs : ", URL[1]);
        //console.log("ID : ", URL[0]);
        var link = URL[0].toString()
        // urlToScan = "mlchynr.com"
        results = await api.run(URL[1])
        console.log(results);
        var isValid = false
        var { useHttps, hasTitle, hasMetaDesc, hasCanTag } = results
        if (useHttps && hasTitle && hasMetaDesc && hasCanTag)
        {
            isValid = true
        }
        var SpeedIndex
        if (Number.isNaN(results.pageSpeedIndex)) { SpeedIndex = 0}
        else { SpeedIndex = results.pageSpeedIndex}
        var data = {
            URL: results.URL,
            useHttps: results.useHttps,
            pageSpeedIndex: SpeedIndex,
            hasTitle: results.hasTitle,
            hasMetaDesc: results.hasMetaDesc,
            hasCanTag: results.hasCanTag,
            isValid: isValid
        }
        var doc;
        switch (link) {
            case "twitter":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { twitter: data }
                );
                break;
            case "facebook":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { facebook: data }
                );
                break;
            case "linkedin":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { linkedin: data }
                );
                break;
            case "website":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { website: data }
                );
                break;
            case "youtube":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { youtube: data }
                );
                break;
            case "medium":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { medium: data }
                );
                break;
            case "pinterest":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { pinterest: data }
                );
                break;
            case "crunchbase":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { crunchbase: data }
                );
                break;
        }
        // let doc = await connections.findOneAndUpdate(
        //     { userId: req.user._id},
        //     { twitter: data}
        //     );

        // const newconnections = new connections({ 
        //     twitter: data,
        //     facebook: { URL: data.facebookURL },
        //     linkedin: { URL: data.linkedinURL },
        //     website: { URL: data.websiteURL },
        //     pinterest: { URL: data.pinterestURL },
        //     youtube: { URL: data.youtubeURL },
        //     crunchbase: { URL: data.crunchbaseURL },
        //     medium: { URL: data.mediumURL },
        //     userId: "607709c7cc0ebf29b85c5340" });
        // await newconnections.save()

        console.log(isValid)
        return res.status(200).send({
            msg: "connections Saved successfully.",
            saved:true,
            valid: isValid,
            status: 200
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).send({
            msg: 'Internal server error',
            status: 500
        })
    }
}

exports.emptyConnections = async (req, res, next) => {

    console.log("Request Body : ", req.body);
    var URL = req.body.data;
    
    try {
        var URL = req.body;
        //console.log("URLs : ", URL[1]);
        //console.log("ID : ", URL[0]);
        var link = URL[0].toString()
        var data = {
            URL: '',
            useHttps: false,
            pageSpeedIndex: 0,
            hasTitle: false,
            hasMetaDesc: false,
            hasCanTag: false,
            isValid: false
        }
        var doc;
        switch (link) {
            case "twitter":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { twitter: data }
                );
                break;
            case "facebook":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { facebook: data }
                );
                break;
            case "linkedin":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { linkedin: data }
                );
                break;
            case "website":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { website: data }
                );
                break;
            case "youtube":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { youtube: data }
                );
                break;
            case "medium":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { medium: data }
                );
                break;
            case "pinterest":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { pinterest: data }
                );
                break;
            case "crunchbase":
                doc = await connections.findOneAndUpdate(
                    { userId: req.user._id },
                    { crunchbase: data }
                );
                break;
        }

        // console.log(isValid)
        return res.status(200).send({
            msg: "connections Saved successfully.",
            saved: true,
            status: 200
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).send({
            msg: 'Internal server error',
            status: 500
        })
    }
}