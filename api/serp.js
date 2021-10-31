const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch(process.env.SERP_API)

module.exports = (keyword,callback) => {
    //var data
    params = { q: keyword}

        search.json(params, (result) => {

            var output = result.organic_results

            callback(output)
        })
    // console.log(res)
}




