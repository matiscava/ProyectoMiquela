const isAuth = (req, res, next) => {
  if( req.isAuthenticated()){
    next();
  } else {
    res.redirect('/users/login')
  }
}

const canIngress = (req, res, next) => {
  if( req.isAuthenticated() && (req.user.admin || req.user.canIngress)){
    next();
  } else if (!req.isAuthenticated()){
    res.redirect('/')
  }else{
    res.status(401).json( { msg: "You are not authorized to view this resource, because you don't have the permissions" });
  }
}

const canEngress = (req, res, next) => {
  if( req.isAuthenticated() && (req.user.admin || req.user.canEIngress)){
    next();
  } else if (!req.isAuthenticated()){
    res.redirect('/')
  }else{
    res.status(401).json( { msg: "You are not authorized to view this resource, because you don't have the permissions" });
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
  isAuth,
  canEngress,
  canIngress
}