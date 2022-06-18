export default (req, location, param, value, msg) => {
  if (!req.session.err) {
    req.session.err = [];
  }

  req.session.err.push({
    location: location,
    param: param,
    value: value,
    msg: msg
  });
};


/*
[ { location: 'body',
       param: 'token',
       value: '2929a93a6d784bb764ada80a1a08506fcc5b60e9',
       msg: 'Invalid token' } ]
       */