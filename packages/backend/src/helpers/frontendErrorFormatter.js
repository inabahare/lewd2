/*
Transform errors from 
[ { location: 'body',
       param: 'token',
       value: '2929a93a6d784bb764ada80a1a08506fcc5b60e9',
       msg: 'Invalid token' } ]

to 

{
    token: 'Invalid token'
}

*/
export default err => {
  if (err) {
    const result = [];
    err.forEach(e => {
      result[e.param] = e.msg;
    });
    return result;
  }
  return undefined;
};