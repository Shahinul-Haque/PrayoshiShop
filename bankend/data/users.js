import bcrypt from 'bcryptjs'
const users = [
    {
        name: 'Admin User',
        email : 'admin@example.com',
        password : bcrypt.hashSync('123456',10),
        isAdmin : true
    },
    {
        name: 'Tanji Prayoshi',
        email : 'tanji@example.com',
        password : bcrypt.hashSync('123456',10),
        
    },
    {  
        name: 'Shahinul Haque',
        email : 'shahin@example.com',
        password : bcrypt.hashSync('123456',10),
        
    },
 
]

export default users