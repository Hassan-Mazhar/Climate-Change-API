
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const PORT = 9000
const app = express()

const newspapers = [
    {

        name:'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
        
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    }
    


]
const articles = []


newspapers.forEach(newspapers => {
    axios.get(newspapers.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspapers.base + url,
                    source: newspapers.name
                })

        })
})
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change API')

})

app.get('/news',(req,res)=>{
	
    res.json(articles)
})


app.get('/news/:newspaperId', (req,res)=>{

    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspapers => newspapers.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspapers => newspapers.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles=[]

            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })

            })
                res.json(specificArticles)
        }).catch(err => console.log(err))

    }) 




app.listen(PORT, () => console.log('server running on PORT ${PORT}') )



