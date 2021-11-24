import { ObjectId } from 'mongodb';

export const userMock = {
    _id: new ObjectId('6199c6fe7de7bff2aad820b1'),
    first_name: 'Parinita',
    last_name: 'Kumari',
    email: 'parinita123@gmail.com',
    password: '123456',
    user_type: 'OWNER',
    phone_number: '+919334445729',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    __v: 0
}