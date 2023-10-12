import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    code: { type: String, unique: true, required: true},
    status: { type: Boolean, default: true},
    price: { type: Number, required: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true},
    thumbnail: { type: [String], default: [] },
});

mongoose.set('strictQuery', false)
const productModel = mongoose.model('products', productSchema);

export default productModel