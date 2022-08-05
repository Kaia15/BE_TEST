const responseTime = ((req, res, next)=>{
    req.startTime = Date.now();
    next();
  })
  
  module.exports = responseTime;
  