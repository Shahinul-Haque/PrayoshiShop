import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartRecucers';
import {
    orderCreateReducer,
    orderDeliverReducer,
    orderDetailsReducers,
    orderListMyReducer,
    orderListReducer,
    orderPayReducers
} from './reducers/orderReducers';
import {
    createProductReviewReducer, getTopProductsReducer, productCreateReducer,
    productDeleteReducer,
    productDetailsReducer,
    productListReducer,
    productUpdateReducer
} from './reducers/productReducers';
import {
    removeUserReducer,
    userDetailsReducer,
    userListRedecuer,
    userLoginReducer,
    userRegisterReducer,
    userUpdateProfileReducer,
    userUpdateReducer
} from './reducers/userReducer';


const reducer = combineReducers({
    listProduct : productListReducer,
    productDetails : productDetailsReducer,
    cart : cartReducer,
    userLogin : userLoginReducer,
    userRegister : userRegisterReducer,
    userDetails : userDetailsReducer,
    userUpdate : userUpdateProfileReducer,
    orderCreate : orderCreateReducer,
    orderDetails : orderDetailsReducers,
    orderPay : orderPayReducers,
    orderList : orderListMyReducer,
    userList : userListRedecuer,
    removeUser: removeUserReducer,
    updateUser : userUpdateReducer,
    productDelete : productDeleteReducer,
    productCreate : productCreateReducer,
    productUpdate : productUpdateReducer,
    listOfOrders: orderListReducer,
    orderDeliver : orderDeliverReducer,
    createReview : createProductReviewReducer,
    topProductsList : getTopProductsReducer,
});

const cartItemFromStorage = localStorage.getItem('cartItems') 
                            ? JSON.parse(localStorage.getItem('cartItems')) : []
                            

const userLoginStroage = localStorage.getItem('userInfo')
                          ? JSON.parse(localStorage.getItem('userInfo')) : null

const shippingStroage = localStorage.getItem('shippingAddress') 
                        ? JSON.parse(localStorage.getItem('shippingAddress')) : {}                         

const initialState = {
             cart: { cartItems : cartItemFromStorage, shippingAddress : shippingStroage },
             userLogin : { userInfo : userLoginStroage},
             }

const middleWare = [thunk]

const store = createStore(
        reducer, 
        initialState, 
        composeWithDevTools(applyMiddleware(...middleWare)),
    )

export default store;    