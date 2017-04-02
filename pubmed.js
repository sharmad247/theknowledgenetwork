var request = require('request');
var xml2js = require('xml2js');
const util = require('util');

const pubmedBase = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

function search(term, done) {
    request(pubmedBase + '/esearch.fcgi?db=pubmed&term='+ encodeURIComponent(term) +'&reldate=60&datetype=edat&retmax=500&usehistory=y&retmode=JSON', function (error, response, body) {
        var result = JSON.parse(body);
        done(result.esearchresult.idlist);
    });
}

function fetchAbstracts(ids, done) {
    var idString = ids.join(',');
    var parser = new xml2js.Parser();

    request(pubmedBase + '/efetch.fcgi?db=pubmed&id='+ idString + '&retmode=xml&rettype=abstract', function(error, reponse, body){
        var result = parser.parseString(body, function(err, result){
            // console.log(util.inspect(result, false, null))
            done(result);
        })
    })
}

function articleToAuthorList(article) {
    try {
        return article.MedlineCitation[0].Article[0].AuthorList
    } catch (err) {
        return []
    }
}

function authorListToAuthor(authorList) {
    try {
        return {
            name : authorList[0].Author[0].ForeName[0] + ' ' + authorList[0].Author[0].LastName[0],
            affliation: authorList[0].Author[0].AffiliationInfo[0].Affiliation[0]
        }
    } catch(err) {
        return {
            name : '',
            affliation: '' 
        }
    }
}

function findAuthorsWithTopic(topic, done) {
    search(topic, function(ids) {
        fetchAbstracts(ids, function(abs){
            done(abs.PubmedArticleSet.PubmedArticle.map(articleToAuthorList).map(authorListToAuthor).filter(function(o) {
                return o.affliation.indexOf('India') > -1;
            })); 
        });
    });
}

exports.findAuthorsWithTopic = findAuthorsWithTopic