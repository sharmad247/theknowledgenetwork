var request = require('request');
var xml2js = require('xml2js');
const util = require('util');

const pubmedBase = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

function search(term, done) {
    var query = term.split(' ').join('+')
    request(pubmedBase + '/esearch.fcgi?db=pubmed&term='+ encodeURIComponent(query) +'&reldate=60&datetype=edat&retmax=500&usehistory=y&retmode=JSON', function (error, response, body) {
        var result = JSON.parse(body);
        done(result.esearchresult.idlist);
    });
}

function getText(node) {
    if(typeof(node) === 'object' && node._ !== undefined)
        return node._
    else
        return node
}

function fetchAbstracts(ids, database, sort, done) {
    var idString = ids.join(',');
    var parser = new xml2js.Parser();

    request(pubmedBase + '/efetch.fcgi?db='+ database +'&id='+ idString + '&retmode=xml&rettype=abstract', function(error, reponse, body){
        var result = parser.parseString(body, function(err, result){
            // console.log(util.inspect(result, false, null))
            done(result);
        })
    })
}

function articleToAuthorList(article) {
    try {
        var authorList = article.MedlineCitation[0].Article[0].AuthorList
        var title = article.MedlineCitation[0].Article[0].ArticleTitle[0]
        var abstract = article.MedlineCitation[0].Article[0].Abstract[0].AbstractText[0]

        authorList[0].Title = title
        authorList[0].Abstract = abstract

        return authorList
    } catch (err) {
        return []
    }
}

function trimFullstop(text) {
    return text.endsWith('.') ? text.substring(0, text.length - 1) : text
}

function extractEmail(affliation) {
    validEmail = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    return affliation.split(' ').map(trimFullstop).filter(validEmail)
}

function authorListToAuthor(authorList) {
    try {
        return {
            name : authorList[0].Author[0].ForeName[0] + ' ' + authorList[0].Author[0].LastName[0],
            affliation: authorList[0].Author[0].AffiliationInfo[0].Affiliation[0],
            title: authorList[0].Title,
            abstract: getText(authorList[0].Abstract),
            emails: extractEmail(authorList[0].Author[0].AffiliationInfo[0].Affiliation[0])
        }
    } catch(err) {
        return {
            name : '',
            affliation: ''
        }
    }
}

function isALetter(c) {
    var value = c.charCodeAt(0)
    return (value >= 65 && value <= 90) || (value >= 97 && value <= 122)
}

function removeFullStop(word) {
    var lastCharacter = word.charAt(word.length - 1)
    if (!isALetter(lastCharacter))
        return word.substring(0, word.length - 1)
    else
        return word 
}

function isInIndia(text) {
    var arr = text.split(' ')
    var arr2 = arr.map(removeFullStop)

    return arr2.indexOf('India') > -1
}

function indianAuthor(o) {
    return isInIndia(o.affliation);
}

function findAuthorsWithTopic(topic, database, sort, done) {
    search(topic, function(ids) {
        if(ids.length === undefined || ids.length < 1) {
            console.log("No articles found");
            done([]);
        } else {
            fetchAbstracts(ids, database, sort, function(abs){
                result = [];
                try {
                    result = abs.PubmedArticleSet.PubmedArticle.map(articleToAuthorList).map(authorListToAuthor).filter(indianAuthor);
                } catch (err) {
                    console.error(err);
                }
                done(result);
            });
        }
    });
}

exports.findAuthorsWithTopic = findAuthorsWithTopic
