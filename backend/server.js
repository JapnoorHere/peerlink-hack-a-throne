const exp = require('express');
const cors = require('cors');
const {signup,login,addpost,viewpost,profile,request,acceptreq,mentorlist,namereturn,sendMailchat,quiz,showquiz} = require('./control');

const app = exp();

app.use(cors());
app.use(exp.json());

const routes = exp.Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.post('/:id/addpost', addpost);
routes.get('/viewpost', viewpost);
routes.get('/:id/profile', profile);
routes.post('/request', request);
routes.post('/accept', acceptreq);
routes.get('/mentorlist', mentorlist);
routes.get('/:id/namereturn', namereturn);
routes.post('/:id/mailchat', sendMailchat);
routes.post('/quiz',quiz)
routes.post('/showquiz',showquiz)
app.use('/', routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
