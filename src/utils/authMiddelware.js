const isAuth = (req, res, next) => {
  if( req.isAuthenticated()){
    next();
  } else {
    res.redirect('/users/login')
  }
}

const isAdmin = (req, res, next) => {
  if( req.isAuthenticated() && req.user.admin){
    next();
  } else if (!req.isAuthenticated()){
    res.redirect('/users/login')
  }else{
    res.status(401).json( { msg: 'You are not authorized to view this resource, because you are not admin' });
  }
}

export {
  isAdmin,
  isAuth
}