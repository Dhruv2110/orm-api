const SerpModel = require('../models/serp');
const Keywords = require('../models/keywords');

const serp = require('../api/serp')


exports.loadSerpData = async (req, res, next) => {
    try{

            var { keyword } = req.body;
        console.log(req.body)
            keyword = keyword.filter(k => k !== '')

            let results = [];

            let promise = new Promise((resolve, reject) => {
                for(let i=0; i <keyword.length ;i++) {

                    serp(keyword[i], async data => {

                        let saveSerp = new Promise(async (resolve,reject) => {
                            for (let d=0; d< data.length ;d ++) {
                                let serpUrlExists = await SerpModel.findOne({keyword: keyword[i], url: data[d].link, userId: req.user._id})
                                
                                if(serpUrlExists) {
                                    serpUrlExists.currentPosition = data[d].position
                                    serpUrlExists.previousPosition = serpUrlExists.currentPosition
    
                                    await serpUrlExists.save()

                                    if(d=== data.length-1) {
                                        results.push({url:data[0].link, keyword: keyword[i], index: i})
                                        
                                        resolve(true)
                                    }
                                } else {
                                    let serpData = new SerpModel({
                                        url: data[d].link,
                                        currentPosition: data[d].position,
                                        previousPosition: 0,
                                        keyword: keyword[i],
                                        userId: req.user._id
                                    })
    
                                    await serpData.save()
                                    if(d=== data.length-1) {
                                        results.push({url:data[0].link, keyword: keyword[i], index: i})
                                        resolve(true)
                                    }
                                }
                            }
                        })

                        await saveSerp;
                        if(results.length === keyword.length) {
                            resolve(results)
                        }
                    })
                }
            })

            let finalResult = await promise;
            finalResult = finalResult.sort((a,b) => a['index'] - b['index'])

            let finalList = [];
            let finalListPromise = new Promise(async(resolve,reject) => {
                for(let i=0; i<finalResult.length ; i++) {
                    let serpitem = await SerpModel.findOne({url: finalResult[i].url, keyword: finalResult[i].keyword, userId: req.user._id})
                    finalList.push(serpitem)
                    if(finalList.length === finalResult.length) {
                        resolve(true)
                    }
                }
            })
            
            await finalListPromise;
            console.log(finalList)
            res.status(200).send({ msg: 'data fetched successfully', data: finalList })
        }
    catch(err){
        console.log(err)
        res.status(500).send({code:-1})
    }
}