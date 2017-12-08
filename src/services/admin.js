
/*
* Middlewere para revisar si es admin
*/
module.exports = (req, res, next) => {
  if(req.user.role === 'admin'){
    next();
  }
  else {
    res.send({ message: 'Unauthorized!' });
  }
};