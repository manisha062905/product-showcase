import React from "react";
import {Route, Redirect} from 'react-router-dom';
import Products from "./components/products/Products";
import ProductDetail from "./components/products/ProductDetail";
import ProductForm from "./components/products/ProductForm";
import Assignment from "./components/assignment/Assignment";
import Cart from "./components/cart/Cart"

const routesMap =[
    {
        id:1,
        path: '/',
        redirectTo: '/assignment',
    },
    {
        id: 2,
        path: '/products',
        component: Products
    },
    {
        id: 3,
        path: '/assignment',
        component: Assignment
    },
    {
        id: 4,
        path: '/cart',
        component: Cart
    },
    {
        id: 5,
        path: '/products/create',
        component: ProductForm
    },
    {
        id: 6,
        path: '/products/edit/:id',
        component: ProductForm
    },
    {
        id: 7,
        path: '/products/:id',
        component: ProductDetail
    },
    {
        id: 8,
        path: '*',
        redirectTo: '/products'
    }
]

export const routes = routesMap.map((route, index) => {
    if (route.redirectTo){
        return <Redirect key={route.id} exact from={route.path} to={route.redirectTo}/>
    }
    console.log(route)
    return (<Route
        key={index}
        exact
        path={route.path}
        component={route.component}
    />)
})
