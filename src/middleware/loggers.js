
const logger = (req, res,  next)=>{
    console.log(`${req.method} request for '${req.url}' at ${new Date().toISOString()} from IP: ${req.ip}`);
    next();
}

module.exports = logger;