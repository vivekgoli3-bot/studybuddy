
import mongoose from 'mongoose';

const userLoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { collection: 'user_login' }); 

export default mongoose.model('UserLogin', userLoginSchema);
