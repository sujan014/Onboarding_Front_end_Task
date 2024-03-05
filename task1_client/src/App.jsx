import React from "react"
import { useState } from "react"
import './App.css'
import CustomersList from "./components/Customers";
import ProductsList from "./components/Products";
import StoresList from "./components/Stores";
import SalesList from "./components/Sales";
// export const BASE_URL = "https://localhost:7155"
export const BASE_URL = "https://onboardingtaskmain.azurewebsites.net";

import {  Segment,
          Button 
        } from "semantic-ui-react";

const Customers = 0;
const Products = 1;
const Stores = 2;
const Sales = 3;

function App() {
  const [page, setPage] = useState(0)

  async function customerHandle(){
    setPage(Customers);    
    console.log(`press: ${page}`);
  }
  async function productHandle(){
    setPage(Products);
    console.log(`press: ${page}`);
  }
  async function storeHandle(){
    setPage(Stores);
    console.log(`press: ${page}`);
  }
  async function salesHandle(){
    setPage(Sales);
    console.log(`press: ${page}`);
  }
  
  return (
    <div>
        <Segment basic inverted>            
            <h3 className="header_item">React</h3>
            <Button secondary onClick={() => customerHandle()}>Customers</Button>
            <Button secondary onClick={() => productHandle()}>Products</Button>
            <Button secondary onClick={() => storeHandle()}>Stores</Button>
            <Button secondary onClick={() => salesHandle()}>Sales</Button>
        </Segment>
        <RenderChild pressCount={page}/>
        <div className="footer">
            <hr/>
            <label>2024-Sujan Raj Shrestha</label>
        </div>
    </div>
  )
}

function RenderChild(props){
  return (
    <div>
      {
        (() => 
          {
            if (props.pressCount == Customers) {
              return (
                <CustomersList />
              )
            } else if (props.pressCount == Products) {
              return (
                <ProductsList />
              )
            } else if (props.pressCount == Sales) {
              return (
                <SalesList />
              )
            } else if (props.pressCount == Stores) {
              return (
                <StoresList />
              )
            }
            else {
              return (
                <h1>`Invalid count ${props.pressCount}`</h1>
              )
            }
          }
        )()
      }
    </div>
  )
}
export default App
