#! /usr/bin/env node
var aws=require('./aws')
var fs=require('fs')
var Promise=require('bluebird')
var cf=new aws.CloudFormation()
var s3=new aws.S3()
var chalk=require('chalk')
var bucket=require('../../config').templateBucket

if(require.main === module){
    run()
}
module.exports=run
async function run(){
    var template=JSON.stringify(require('../'))

    await s3.putObject({
        Bucket:bucket,
        Key:"sagebuild.json",
        Body:template
    }).promise()

    var result=await cf.validateTemplate({
        TemplateURL:`http://s3.amazonaws.com/${bucket}/sagebuild.json`
    }).promise()

    console.log(result)
    fs.writeFileSync(`${__dirname}/../build/template.json`,JSON.stringify(require('../'),null,2))
    fs.writeFileSync(`${__dirname}/../build/template.min.json`,JSON.stringify(require('../')))
    return template
}
