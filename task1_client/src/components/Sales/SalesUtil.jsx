import axios from "axios";
import { BASE_URL } from "../../App";

const getCustomers = async () => {
    try{
        const url = `${BASE_URL}/api/Customer`;
        const fetch_cstm = await axios.get(url);
        return (fetch_cstm !== null) ? fetch_cstm : null;
    }
    catch{
        throw new Error("Cannot fetch Sales customers.");
        // return null;
    }
}

const getProducts = async () => {
    try{
        const url = `${BASE_URL}/api/Product`;
        const fetch_prds = await axios.get(url);
        return (fetch_prds !== null) ? fetch_prds : null;
    }
    catch{        
        throw new Error("Cannot fetch Sales Products.");        
        // return null;
    }
}

const getStores = async () => {
    try{
        const url = `${BASE_URL}/api/Store`;
        const fetch_stores = await axios.get(url);
        return (fetch_stores !== null) ? fetch_stores : null;
    }
    catch{
        throw new Error("Cannot fetch Sales customers.");        
        // return null;
    }
}

export {getCustomers, getProducts, getStores};