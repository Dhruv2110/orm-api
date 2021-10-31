const lighthouse = require('lighthouse')
const { launch, killAll } =  require('chrome-launcher')
const fs = require('fs');


async function launchChromeAndRunLighthouse(url) {
    const opts = {
        chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    }
    const config = {
        extends: 'lighthouse:default',
        settings: {
            emulatedFormFactor: 'desktop',
            onlyAudits: [
                'html-lang-valid',
                'document-title',
                'meta-description',
                'canonical',
                'hreflang',
                'link-text',
                'is-on-https',
                'service-worker',
                'installable-manifest',
                'speed-index',
            ],
        },
    }
    try {
        const chrome = await launch(opts)
        if (chrome) {
            const results = await lighthouse(url, { port: chrome.port }, config)
            //console.log(results)
            await killAll()
            return results && results.lhr
        }
    } catch (err) {
        await killAll()
        return err
    }
}

exports.run = async (urlToCheck) => {

    const checkProtocol = (url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        } else {
            return 'https://' + url
        }
    }


    var url = ''

    if(checkProtocol(urlToCheck)) {
        url = checkProtocol(urlToCheck).toString()
    }
    
    const lighthouse = await launchChromeAndRunLighthouse(url)

        try {
            const [resLighthouse] = await Promise.all([lighthouse])
            //console.log(resLighthouse)
            const regex = /.*(?=\[)/

            const data = [
                {
                    title: 'Progressive Web App',
                    desc:
                        'Learn if a website has the basics setup for a Progressive Web App. ' +
                        resLighthouse.categories.pwa.description.replace(regex, ''),
                    content: [
                        resLighthouse.audits['is-on-https'],
                    ],
                },
                {
                    title: 'Page Speed',
                    desc:
                        'Test your website for page speed performance. ' +
                        resLighthouse.audits['speed-index'].description.replace(regex, ''),
                    content: [
                        resLighthouse.audits['speed-index'],
                    ],
                },
                {
                    title: 'SEO Essentials',
                    desc:
                        'Check your webpage for the important tags that search engines look for. ' +
                        resLighthouse.categories.seo.description.replace(regex, ''),
                    content: [
                        resLighthouse.audits['document-title'],
                        resLighthouse.audits['meta-description'],
                        resLighthouse.audits['canonical'],
                        resLighthouse.audits['html-lang-valid'],
                    ],
                },
            ]

            //console.log(typeof(data));
            let jData = JSON.parse(JSON.stringify(data));
            // for(let jd of data){
            //     console.log(jd.content);
            // }
            //console.log(jData);
            var URL = urlToCheck;
            var useHttps = !!jData[0].content[0].score
            var pageSpeedIndex = Math.trunc((jData[1].content[0].numericValue)/1000)
            var hasTitle = !!jData[2].content[0].score
            var hasMetaDesc = !!jData[2].content[1].score
            var hasCanTag = !!jData[2].content[2].score
            //var hasLangTag = !!jData[2].content[3].score

            var dataToDB = { URL, useHttps, pageSpeedIndex, hasTitle, hasMetaDesc, hasCanTag}
            //console.log(dataToDB)
            return dataToDB;
            // fs.writeFile('myjsonfile.json', json, function (err) {
            //     if (err) throw err; 
            //     console.log('complete');
            // });
        } catch (error) {
            console.log(error)
        }
}

