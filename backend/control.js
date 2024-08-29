const User = require('./schema');
const { MailtrapClient } = require("mailtrap");

const TOKEN = "bad6e5bb5bbd790d454c6d5403011d4d";
const ENDPOINT = "https://api.mailtrap.io/api/v1/inboxes/your-inbox-id/messages"; 

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
const signup = async (req, res) => {
    console.log("in login");
    const { name, email, reg, passingYear, stream, password,img} = req.body;
    try {
        const currentYear = new Date().getFullYear();
        const year=passingYear-currentYear;
        let role;
        if(year>1){
             role='junior'
        }
        else{
             role='senior'
        }
        const user = new User({ name, email, reg, passingYear, stream, password, role,img });
        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
        console.log("User registered successfully");
        console.log(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "User already exists" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password);
        const user = await User.findOne({ email: email});
        console.log(user);
        const isMatch = password==user.password

        if (isMatch) {
            res.status(201).json({msg:'succes',data:user});
        } else {
            res.status(401).json({ msg: 'Incorrect password' });
        }

    }
    catch(err) {
        console.error(err);
        res.status(400).json({ msg: 'Invalid credentials' });

    }
}
const addpost = async (req, res) => {
    try{
        const id=req.params.id;
        const {img,desc} = req.body;
        console.log(desc);
        const user = await User.findByIdAndUpdate(id, { $push: { post: { img, desc } } }, { new: true });
        res.status(201).json({msg:'post added successfully',data:user});
    }
    catch(err) {
        console.error(err);
        res.status(400).json({ msg: 'Failed to add post' });

    }
}
const viewpost = async (req, res) => {
    try {
        const usersWithPosts = await User.find({ post: { $exists: true, $ne: [] } });
        console.log(usersWithPosts);
        res.status(200).json({ msg: 'Posts fetched successfully', data: usersWithPosts });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: 'Failed to fetch posts' });
    }
};


const profile = async (req, res) => {
    try {
        console.log("Loading profile...");
        const id = req.params.id;
        console.log(id)

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User fetched successfully', data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch user' });
    }
};

const request = async (req, res) => {
    try {
        console.log("Requesting...");
        const {reqid,userid}=req.body;
        const user = await User.findByIdAndUpdate(
            reqid,
            { $push: { request: userid } },
            { new: true}
        );
        
        res.status(201).json({ msg: 'Request sent successfully', data: user })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to request' });
    }}
const acceptreq=async(req, res) => {
    try {
        console.log("Accepting request...");
        const {acceptid,userid}=req.body;
        const user = await User.findByIdAndUpdate(
            acceptid,
             { mentor: userid } 
        );
        await User.findByIdAndUpdate(
            userid,
            { $push: { juniorlist: acceptid } }
            
        );
        await User.findByIdAndUpdate(
            userid,
            { $pull: { request: acceptid } }
        );
        
        res.status(201).json({ msg: 'Request accepted successfully', data: user })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to accept request' });
    }}
const mentorlist=async(req, res) => {
    try {
       const user=await User.find({role:'senior'})
       res.status(200).json({ msg: 'Mentor list fetched successfully', data: user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch mentor list' });
    }

    }
const namereturn=async(req,res)=>{
    try {
        const user=await User.find({_id:req.params.id})
        console.log(user[0].name);
        res.status(200).json({ msg: 'Name updated successfully', data: user[0].name });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to update name' });
    }
 
}

const sendMailchat = async (req, res) => {
    try {
        console.log('In mail function');
        const id = req.params.id; 
        
        console.log('ID:', id);
        const user = await User.find({mentor:id});
        const juniorlist = user.map(user => user._id);
        console.log(juniorlist);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

       
        console.log('User retrieved:',juniorlist);

        
        const emails = [];
        for (let i = 0; i < juniorlist.length; i++) {
            const jj=juniorlist[i]
            console.log('ID:',juniorlist[i]);

            const junior = await User.findOne({_id:juniorlist[i]});

            console.log('Junior retrieved:', junior);
            if (junior && junior.email) {
                emails.push(junior.email);
            } else {
                console.error('Junior user not found or missing email:', user.juniorList[i]);
            }
        }
        console.log('Emails to be sent to:', emails);

        if (emails.length === 0) {
            console.error('No valid juniors to send email to');
            return res.status(400).json({ msg: 'No valid juniors to send email to' });
        }

        const sender = {
            email: "mailtrap@demomailtrap.com",
            name: "Mailtrap Test",
        };

        
        const recipients = emails.map(email => ({ email }));

        
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Your mentor is inviting you to group chat!",
            text: "link: https://chat-room-78me.onrender.com",
            category: "Integration Test",
        });

        console.log('Email sent successfully:', response);
        res.status(200).json({ msg: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
    }
};
const quiz = async (req, res) => {
    try {
        const {score, topic, totalScore,id} = req.body;
        
        const user = await User.findByIdAndUpdate(id, { $push: { quiz: { score,topic,totalScore } } }, { new: true });
        res.status(201).json({msg:'post added successfully',data:user});
}
catch(err){
    console.log(err)
}
}
const showquiz = async (req, res) => {
    try{
        const {id}=req.body;
        const user=await User.findById(id);
        res.status(200).json({msg:'quiz fetched successfully',data:user});
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {signup,login,addpost,viewpost,profile,request,acceptreq,mentorlist,namereturn,sendMailchat,quiz,showquiz};
