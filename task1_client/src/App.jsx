import React from "react"
import { useState } from "react"
import {  Segment, Button } from "semantic-ui-react";
import CustomersList from "./components/Customer/Customers";
import ProductsList from "./components/Product/Products";
import StoresList from "./components/Store/Stores";
import SalesList from "./components/Sales/Sales";
import './App.css';

// export const BASE_URL = "https://localhost:7155"
export const BASE_URL = "https://backendreview.azurewebsites.net";

const Customers = 0;
const Products = 1;
const Stores = 2;
const Sales = 3;

//export const BASE_URL = find_BASEURL

function App() {
  const [page, setPage] = useState(0)

  const handlePageUpdate = (pageNumber) => {
    setPage(pageNumber);
  }  
  
  return (
    <div>
        <Segment basic inverted>            
            <h3 className="header_item">React</h3>
            <Button secondary onClick={() => handlePageUpdate(Customers)}>Customers</Button>
            <Button secondary onClick={() => handlePageUpdate(Products)}>Products</Button>
            <Button secondary onClick={() => handlePageUpdate(Stores)}>Stores</Button>
            <Button secondary onClick={() => handlePageUpdate(Sales)}>Sales</Button>
        </Segment>
        <RenderChild pressCount={page}/>
        <div className="footer">
            <hr/>
            <label>2024-Sujan Raj Shrestha</label>
            <p>We are in: {import.meta.env.MODE}.</p>
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

