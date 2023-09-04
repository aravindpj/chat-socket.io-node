const moment = require("moment")

exports.generateMessage=(from,text)=>{
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

exports.generateLocation=(from,lat,lng)=>{
    return{
        from,
        url: `https://www.google.com/maps?q=${lat}, ${lng}`,
        createdAt: moment().valueOf()
    }
}