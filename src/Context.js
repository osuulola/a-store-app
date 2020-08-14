import React, { useState, createContext, useEffect, useRef } from 'react'
import { storeProducts, detailProduct } from "./data";

const ProductContext = createContext();


const ProductProvider = (props) => {
  const [state,setState] = useState({
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    name:"",
    cartTax: 0,
    cartTotal: 0,
  });

  const setProducts =  () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    })
    setState({ ...state, products:tempProducts, });
  }

  const addTotals = () => {    
    let subTotal = 0;
    let mutCart = {...state};

    mutCart.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;    
    setState({...state,
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    })
  }

   const isInitialMount = useRef(true);

  useEffect(() => {
    setProducts();
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log("in mnt"); 
   } else {
    setProducts();
    addTotals();
    console.log("not it");
    // console.log(state);
   } 
   console.log("in mnt");   
  },[addTotals,setProducts,]);

 

  const getItem = (id) => {
    const product = state.products.find(item => item.id === id);
    return product;
  }

  const handleDetail = (id) => {
    const product = getItem(id);
    setState({ ...state, detailProduct: product })
  }

  const addToCart = (id) => {
    let tempProducts = [...state.products];
    const product = getItem(id);
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    setState({ ...state, products: tempProducts, cart: [...state.cart, product] })
  }

  const openModal = (id) => {
        addTotals();
      }

  const closeModal = () => {
    setState({ ...state, modalOpen: false })
  }

  const increment = (id) => {
    let tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);

    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count + 1;
    product.total = product.count * product.price;
    setState({ ...state, cart: [...tempCart] }
    );
  }

  const decrement = (id) => {
    let tempCart = [...state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);

    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;

    if (product.count === 0) {
      removeItem(id);
    } else {
      product.total = product.count * product.price;
      setState({ ...state, cart: [...tempCart] }
      )
    }
  }

  const removeItem = (id) => {
    let tempProducts = [...state.products];
    let tempCart = [...state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    setState({
      ...state,
      cart: [...tempCart],
      products: [...tempProducts]
    })
  }

  const clearCart = () => {
    setState({ ...state, cart: [] })
  }

  
  return (<ProductContext.Provider value={{
    ...state,
    handleDetail: handleDetail,
    addToCart: addToCart,
    openModal: openModal,
    closeModal: closeModal,
    increment: increment,
    decrement: decrement,
    removeItem: removeItem,
    clearCart: clearCart
  }}>
    {props.children}
  </ProductContext.Provider>)
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer, ProductContext };