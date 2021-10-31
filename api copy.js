const lighthouse = require('lighthouse')
import { Options, launch, killAll } from 'chrome-launcher'
import captureWebsite from 'capture-website'

const fs = require('fs');

const opts: Options = {
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
}
const config = {
    extends: 'lighthouse:default',
    settings: {
        emulatedFormFactor: 'desktop',
        onlyAudits: [
            'html-lang-valid',
            'without-javascript',
            'js-libraries',
            'document-title',
            'meta-description',
            'canonical',
            'hreflang',
            'link-text',
            'crawlable-anchors',
            'load-fast-enough-for-pwa',
            'works-offline',
            'offline-start-url',
            'is-on-https',
            'service-worker',
            'installable-manifest',
            'first-contentful-paint',
            'speed-index',
            'largest-contentful-paint',
            'interactive',
            'total-blocking-time',
            'cumulative-layout-shift',
        ],
    },
}

async function launchChromeAndRunLighthouse(
    url: string,
    opts: Options,
    config: any,
) {
    try {
        const chrome = await launch(opts)
        if (chrome) {
            const results = await lighthouse(url, { port: chrome.port }, config)
            await killAll()
            return results && results.lhr
        }
    } catch (err) {
        await killAll()
        return err
    }
}


app.get('/api/analyze', async (req: Request, res: Response) => {
    const url = req.query.url?.toString() || ''
    const lighthouse = launchChromeAndRunLighthouse(url, opts, config)
    const dir = './images'
    const withoutJsImage = v1()
    const withJsImage = v1()

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    const withoutJs = captureWebsite.file(
        url,
        `./images/${withoutJsImage}.jpeg`,
        {
            type: 'jpeg',
            isJavaScriptEnabled: false,
            fullPage: true,
        },
    )

    const withJs = captureWebsite.file(url, `./images/${withJsImage}.jpeg`, {
        type: 'jpeg',
        fullPage: true,
    })

    try {
        const [resLighthouse] = await Promise.all([lighthouse, withoutJs, withJs])
        const regex = /.*(?=\[)/

        const data = [
            {
                title: 'JS library scan',
                desc:
                    'Dscovers which front-end JavaScript libraries are being utilized on a webpage. This allows you to know if a website is built on frameworks like React, Vue, or Angular for example. ' +
                    resLighthouse.audits['js-libraries'].description.replace(regex, ''),
                content: resLighthouse.audits['js-libraries'].details.items,
            },
            {
                title: 'Progressive Web App',
                desc:
                    'Learn if a website has the basics setup for a Progressive Web App. ' +
                    resLighthouse.categories.pwa.description.replace(regex, ''),
                content: [
                    resLighthouse.audits['service-worker'],
                    resLighthouse.audits['installable-manifest'],
                    resLighthouse.audits['offline-start-url'],
                    resLighthouse.audits['works-offline'],
                    resLighthouse.audits['load-fast-enough-for-pwa'],
                    resLighthouse.audits['is-on-https'],
                ],
            },
            {
                title: 'Page Speed',
                desc:
                    'Test your website for page speed performance. ' +
                    resLighthouse.audits['speed-index'].description.replace(regex, ''),
                content: [
                    resLighthouse.audits['first-contentful-paint'],
                    resLighthouse.audits['speed-index'],
                    resLighthouse.audits['largest-contentful-paint'],
                    resLighthouse.audits['interactive'],
                    resLighthouse.audits['total-blocking-time'],
                    resLighthouse.audits['cumulative-layout-shift'],
                ],
            },
            {
                title: 'Screenshots',
                desc:
                    'Compare screenshots of your webpage with JavaScript turned On/Off. ' +
                    resLighthouse.audits['without-javascript'].description.replace(
                        regex,
                        '',
                    ),
                content: [
                    {
                        title: 'JavaScript Off',
                        image: `/api/images/${withoutJsImage}.jpeg`,
                    },
                    {
                        title: 'JavaScript On',
                        image: `/api/images/${withJsImage}.jpeg`,
                    },
                ],
            },
            {
                title: 'Links Are Not Crawlable',
                desc:
                    'Search engine bots only crawl links coded as  <a> tag with an href attribute. This section scans for unsupported link types. ' +
                    resLighthouse.audits['crawlable-anchors'].description.replace(
                        regex,
                        '',
                    ),
                content: resLighthouse.audits['crawlable-anchors'].details.items
                    ? resLighthouse.audits['crawlable-anchors'].details.items.map(
                        ({ node }: { node: object }) => node,
                    )
                    : [],
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

        findRemoveSync(__dirname + '/images', {
            age: { seconds: 86400 },
            extensions: '.jpeg',
        })

        res.send(data)
    } catch (error) {
        res.send(error)
    }
})